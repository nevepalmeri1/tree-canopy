// Resolve a public TikTok URL through TikTok's public oEmbed endpoint.
// No credentials and no arbitrary remote hosts; failures are expected for private or unavailable videos.
const allowedHosts=new Set(["www.tiktok.com","tiktok.com","vm.tiktok.com","vt.tiktok.com","m.tiktok.com"]);
async function unwrapShortURL(start){
 let current=start;
 for(let i=0;i<4;i++){
  if(!allowedHosts.has(current.hostname.toLowerCase())||current.protocol!=="https:")return null;
  const match=current.pathname.match(/^\/@[^/]+\/video\/(\d{10,25})\/?$/);
  if(match)return {id:match[1],canonical:current.href};
  const response=await fetch(current.href,{method:"HEAD",redirect:"manual",signal:AbortSignal.timeout(3500),headers:{"User-Agent":"Mozilla/5.0"}});
  const loc=response.headers.get("location");
  if(!loc)break;
  const next=new URL(loc,current);
  if(!allowedHosts.has(next.hostname.toLowerCase())||next.protocol!=="https:")break;
  current=next;
 }
 return null;
}
async function oembed(url){
 const endpoint=new URL("https://www.tiktok.com/oembed");
 endpoint.searchParams.set("url",url);
 const response=await fetch(endpoint,{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"},signal:AbortSignal.timeout(7000)});
 if(!response.ok)return null;
 const data=await response.json();
 const html=String(data.html||"");
 const matched=(String(data.embed_product_id||"")+" "+html+" "+String(data.url||"")).match(/(?:data-video-id=["']|\/video\/|\/player\/v1\/|^)(\d{10,25})/);
 const thumbnail=typeof data.thumbnail_url==="string"&&data.thumbnail_url.startsWith("https://")?data.thumbnail_url:null;
 return {id:matched?matched[1]:null,canonical:typeof data.url==="string"&&data.url.startsWith("https://www.tiktok.com/")?data.url:url,title:String(data.title||"TikTok video").slice(0,220),author:String(data.author_name||"TikTok creator").slice(0,80),thumbnail};
}
// TikTok oEmbed frequently omits thumbnails. Fetch only public video metadata
// as a best-effort secondary source, never the video file itself.
async function alternateCover(url){
  try{
    const endpoint=new URL("https://www.tikwm.com/api/");
    endpoint.searchParams.set("url",url);
    const r=await fetch(endpoint,{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"},signal:AbortSignal.timeout(7000)});
    if(!r.ok)return null;
    const result=await r.json();
    if(Number(result?.code)!==0||!result?.data)return null;
    const data=result.data;
    const id=String(data.id||"");
    if(!/^\d{10,25}$/.test(id))return null;
    const cover=[data.origin_cover,data.cover,data.ai_dynamic_cover].find(u=>typeof u==="string"&&u.startsWith("https://"));
    return {id,canonical:url,title:String(data.title||"TikTok video").slice(0,220),author:String(data.author?.unique_id||data.author?.nickname||"TikTok creator").slice(0,80),thumbnail:cover||null};
  }catch{return null;}
}
module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","public, s-maxage=900, stale-while-revalidate=1200");
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const raw=typeof req.query?.url==="string"?req.query.url:"";
 if(!raw||raw.length>500)return res.status(400).json({error:"TikTok URL required"});
 let input;try{input=new URL(raw)}catch{return res.status(400).json({error:"Invalid URL"})}
 if(input.protocol!=="https:"||!allowedHosts.has(input.hostname.toLowerCase())||!(/^\/t\/[A-Za-z0-9]+\/?$/.test(input.pathname)||/^\/@[^/]+\/video\/\d{10,25}\/?$/.test(input.pathname)))return res.status(400).json({error:"Only public TikTok post links are accepted"});
 try{
   // TikTok often does not return oEmbed metadata for a short share URL. Try it
   // first, then resolve the redirect and ask oEmbed again for the canonical post.
   const shortResult=await oembed(input.href).catch(()=>null);
   if(shortResult?.id&&shortResult.thumbnail)return res.status(200).json(shortResult);
   const expanded=await unwrapShortURL(input).catch(()=>null);
   const canonical=expanded?.canonical||shortResult?.canonical||input.href;
   const fullResult=canonical!==input.href?await oembed(canonical).catch(()=>null):null;
   const result=fullResult||shortResult;
   const shouldFallback=!(result?.id||expanded?.id)||!result?.thumbnail;
   const alternate=shouldFallback?await alternateCover(canonical):null;
   const id=result?.id||expanded?.id||alternate?.id;
   if(!id)return res.status(404).json({error:"TikTok could not resolve this share link"});
   console.info("[tiktok/resolve] metadata",JSON.stringify({oembed:!!result,redirect:!!expanded,alternate:!!alternate,cover:!!(result?.thumbnail||alternate?.thumbnail)}));
   return res.status(200).json({id,canonical,title:result?.title||alternate?.title||"TikTok video",author:result?.author||alternate?.author||"TikTok creator",thumbnail:result?.thumbnail||alternate?.thumbnail||null});
 }catch{const alternate=await alternateCover(input.href);if(alternate)return res.status(200).json(alternate);return res.status(502).json({error:"TikTok cover unavailable. Open the original video instead"});}
};
// Resolve a public TikTok URL through TikTok's public oEmbed endpoint.
// No credentials and no arbitrary remote hosts; failures are expected for private or unavailable videos.
module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","public, s-maxage=1800, stale-while-revalidate=3600");
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 const value=typeof req.query?.url==="string"?req.query.url:"";
 if(!value||value.length>500)return res.status(400).json({error:"TikTok URL required"});
 let input;try{input=new URL(value)}catch{return res.status(400).json({error:"Invalid URL"})}
 const host=input.hostname.toLowerCase();
 if(input.protocol!=="https:"||!["www.tiktok.com","tiktok.com","vm.tiktok.com","vt.tiktok.com","m.tiktok.com"].includes(host)||!(/^\/t\/[A-Za-z0-9]+\/?$/.test(input.pathname)||/^\/@[^/]+\/video\/\d{10,25}\/?$/.test(input.pathname)))return res.status(400).json({error:"Only public TikTok post links are accepted"});
 try{
  const target=new URL("https://www.tiktok.com/oembed");
  target.searchParams.set("url",input.href);
  const response=await fetch(target,{headers:{"Accept":"application/json","User-Agent":"FuseGeneratedPrototype/1.0"},signal:AbortSignal.timeout(7500)});
  if(!response.ok)return res.status(404).json({error:"TikTok did not return metadata for this post"});
  const data=await response.json();
  const html=String(data.html||"");
  const src=String(data.author_url||"")+" "+String(data.embed_product_id||"")+" "+html+" "+String(data.url||"");
  const idMatch=src.match(/(?:data-video-id=["']|\/video\/|\/player\/v1\/)(\d{10,25})/);
  if(!idMatch)return res.status(422).json({error:"TikTok metadata did not include a playable video ID"});
  const id=idMatch[1];
  const canonical=(typeof data.url==="string"&&data.url.startsWith("https://www.tiktok.com/"))?data.url:input.href;
  return res.status(200).json({id,canonical,title:String(data.title||"TikTok video").slice(0,220),author:String(data.author_name||"Creator").slice(0,80),thumbnail:typeof data.thumbnail_url==="string"&&data.thumbnail_url.startsWith("https://")?data.thumbnail_url:null});
 }catch{return res.status(502).json({error:"Could not reach TikTok. Open the original video instead"});}
};
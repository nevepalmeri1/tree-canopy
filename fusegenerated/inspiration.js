"use strict";
// Curated creator inspiration is intentionally separate from the public TikTok friend feed.
// All founder-supplied links are unassigned until the demo user identifies the restaurant.
(function(){
  const originalExplore=explore,originalOffer=offerDetail,originalFriends=friends,originalRender=render;
  const getVideos=()=>[...founderInspo,...(Array.isArray(state.inspoExtras)?state.inspoExtras:[])];
  const selection=id=>(state.inspoAssignments||{})[id]||"";
  function card(v){
    const meta=inspirationCache[v.id]||{};
    const index=founderInspo.findIndex(item=>item.id===v.id);
    const label=index>=0?"Video "+(index+1):"Saved video";
    const cover=meta.thumbnail&&/^https:\/\//.test(meta.thumbnail)?
      '<img class="inspo-cover-image" src="'+esc(meta.thumbnail)+'" alt="'+esc((meta.title||label)+" TikTok cover")+'" loading="lazy" referrerpolicy="no-referrer">':'';
    const nativePlayer=meta.id&&!cover?'<div class="inspo-embedded-fallback"><iframe loading="lazy" title="'+esc(label)+' original TikTok video preview" src="https://www.tiktok.com/player/v1/'+esc(meta.id)+'?controls=1&description=0" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media;fullscreen;picture-in-picture" allowfullscreen></iframe><a href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer">Watch original TikTok ↗</a></div>':"";
    const media=nativePlayer||('<a class="inspo-cover-link'+(cover?" has-cover":"")+'" href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Watch '+esc(label)+' on TikTok">'+
      cover+'<div class="inspo-cover-fallback"><span class="inspo-tiktok-logo">♪</span><strong>'+esc(label)+'</strong><span class="inspo-preview-status">'+(meta.status==="unavailable"?"TikTok cover not available":"Fetching original cover…")+'</span></div>'+
      '<span class="inspo-cover-play" aria-hidden="true">▶</span><span class="inspo-cover-cta">Watch on TikTok ↗</span></a>');
    return '<article class="founder-inspo-card" data-inspo-id="'+esc(v.id)+'"><div class="founder-inspo-media">'+media+'</div><div class="founder-inspo-copy"><span class="eyebrow">REAL TIKTOK EXAMPLE</span><h3>'+esc(meta.title||"Creator video inspiration")+'</h3><p>'+esc(meta.author||"Original creator — not verified")+'</p><a href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer">Open on TikTok ↗</a>'+
      '<label class="label" for="assign-'+esc(v.id)+'">Match with a restaurant</label><select class="field" data-inspo-assign="'+esc(v.id)+'" id="assign-'+esc(v.id)+'"><option value="">Not assigned yet</option>'+state.businesses.filter(b=>b.id!=="juniper").map(b=>'<option value="'+esc(b.id)+'" '+(selection(v.id)===b.id?"selected":"")+'>'+esc(b.name)+'</option>').join("")+'</select></div></article>';
  }
  function linkedPlacesHTML(){
    const matches=getVideos().filter(v=>{const id=selection(v.id);return id&&state.businesses.some(b=>b.id===id&&b.id!=="juniper");});
    if(!matches.length)return '<div class="friends-where-empty"><p>No restaurants linked yet.</p><p>Use <strong>Match with a restaurant</strong> under one of the TikToks above. As you assign videos, the matching restaurant and the same video will appear here.</p></div>';
    return matches.map(v=>{
      const b=business(selection(v.id)),meta=inspirationCache[v.id]||{},i=founderInspo.findIndex(x=>x.id===v.id);
      const title=meta.title||"Imported TikTok "+(i>=0?i+1:"video");
      const cover=meta.thumbnail&&/^https:\/\//.test(meta.thumbnail)?
        '<img loading="lazy" referrerpolicy="no-referrer" src="'+esc(meta.thumbnail)+'" alt="'+esc(title+" cover")+'">':
        '<span class="friend-where-placeholder">▶</span>';
      return '<article class="friend-where-linked" data-linked-video="'+esc(v.id)+'"><a class="friend-where-cover" href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Watch video from '+esc(b.name)+'">'+cover+'</a><div class="friend-where-info"><p class="eyebrow">TAGGED FROM VIDEO '+(i>=0?i+1:"")+'</p><h3>'+esc(b.name)+'</h3><p class="friend-where-location">'+esc(b.neighborhood)+'</p><p class="friend-where-video-title">'+esc(title)+'</p><a class="friend-where-action" href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer">Watch matching TikTok ↗</a></div></article>';
    }).join("");
  }
  function refreshLinkedPlaces(){
    const section=document.querySelector("#whereFriendsWent");
    if(section)section.innerHTML=linkedPlacesHTML();
  }
  function gallery(restaurantId){
    const videos=getVideos().filter(v=>!restaurantId||selection(v.id)===restaurantId);
    return '<section class="inspo-gallery" id="inspiration"><div class="section-heading"><h2>Video examples</h2><span>'+videos.length+' examples</span></div><p class="small muted">'+(restaurantId?"TikToks assigned to this restaurant to help with the creative brief.":"Your five imported TikToks. They are not yet verified posts from Fuse friends. Tap a cover to watch the original video.")+'</p>'+
      (videos.length?'<div class="inspo-scroll">'+videos.map(card).join("")+'</div><p class="inspo-swipe-hint">← Swipe to see all five videos →</p>':'<div class="inspo-empty">No videos assigned to this restaurant yet. Explore the full inspiration gallery to assign some.</div>')+
      (!restaurantId?'<div class="inspo-actions"><button type="button" data-inspo-add class="button secondary">+ Add another TikTok</button></div>':'')+'</section>';
  }
  function insertBeforeFinalSection(html,fragment){
    const idx=html.lastIndexOf("</section>");
    return idx<0?html+fragment:html.slice(0,idx)+fragment+html.slice(idx);
  }
  explore=originalExplore;
  friends=function(){
    const html=originalFriends(),marker='<div class="section-heading"><h2>Where friends went</h2>';
    const end=html.indexOf(marker),empty=html.indexOf('<div class="friends-tiktok-empty">');
    if(end<0)return insertBeforeFinalSection(html,gallery(null));
    if(empty>=0&&empty<end)return html.slice(0,empty)+gallery(null)+html.slice(end);
    return html.slice(0,end)+gallery(null)+html.slice(end);
  };
  offerDetail=function(id){const c=campaign(id);return c?insertBeforeFinalSection(originalOffer(id),gallery(c.businessId)):originalOffer(id);};
  render=function(){originalRender();refreshLinkedPlaces();if((state.tab==="friends"&&!state.detail)||state.detail?.type==="offer")requestAnimationFrame(resolveVisible);};
  const taskCache={};
  async function resolveOne(v){
    if(taskCache[v.id])return taskCache[v.id];
    taskCache[v.id]=(async()=>{let data={status:"unavailable"};try{
      const r=await fetch("/api/tiktok/resolve?url="+encodeURIComponent(v.url),{credentials:"same-origin"});
      if(!r.ok)throw Error("TikTok metadata unavailable");
      const j=await r.json();
      if(!/^\d{10,25}$/.test(String(j.id||"")))throw Error("Missing video ID");
      data={status:"ready",id:String(j.id),title:String(j.title||"TikTok example"),author:String(j.author||"TikTok creator"),thumbnail:typeof j.thumbnail==="string"&&j.thumbnail.startsWith("https://")?j.thumbnail:null};
    }catch{}
    inspirationCache[v.id]=data;
    refreshLinkedPlaces();
    const existing=document.querySelector('[data-inspo-id="'+v.id+'"]');
    if(existing){const holder=document.createElement("div");holder.innerHTML=card(v);if(holder.firstElementChild)existing.replaceWith(holder.firstElementChild);}
    return data;})();
    return taskCache[v.id];
  }
  function resolveVisible(){
    const ids=[...document.querySelectorAll("[data-inspo-id]")].map(n=>n.getAttribute("data-inspo-id"));
    for(const v of getVideos())if(ids.includes(v.id)&&!inspirationCache[v.id])resolveOne(v);
  }
  document.addEventListener("error",event=>{
    const image=event.target;
    if(image?.matches?.(".inspo-cover-image")){image.hidden=true;image.closest(".inspo-cover-link")?.classList.add("cover-failed");}
  },true);
  function acceptURL(value){try{
    const parsed=new URL(value);const host=parsed.hostname.toLowerCase();
    if(parsed.protocol!=="https:"||!["www.tiktok.com","tiktok.com","m.tiktok.com","vm.tiktok.com","vt.tiktok.com"].includes(host))return null;
    if(!(/^\/t\/[A-Za-z0-9]+\/?$/.test(parsed.pathname)||/^\/@[^/]+\/video\/\d{10,25}\/?$/.test(parsed.pathname)))return null;
    return parsed.href;
  }catch{return null;}}
  function showAdd(){
    $("#modalTitle").textContent="Add TikTok inspiration";
    $("#modalContent").innerHTML='<p class="small muted">Paste a TikTok you’d like creators to learn from. You can assign it to a restaurant after watching.</p><form data-form="inspo-add"><div class="form-group"><label for="inspo-link" class="label">TikTok video URL</label><input class="field" id="inspo-link" name="link" required type="url" placeholder="https://www.tiktok.com/t/..."></div><button class="button full" type="submit">Add video</button></form>';
    $("#modal").showModal();
  }
  document.addEventListener("click",e=>{const node=e.target.closest("[data-inspo-add]");if(node){e.preventDefault();e.stopImmediatePropagation();showAdd();}},true);
  document.addEventListener("change",e=>{if(!e.target.matches("[data-inspo-assign]"))return;
    if(!state.inspoAssignments)state.inspoAssignments={};
    state.inspoAssignments[e.target.dataset.inspoAssign]=e.target.value;
    persist();refreshLinkedPlaces();toast(e.target.value?"Linked restaurant to this TikTok.":"Removed restaurant link.");
  });
  document.addEventListener("submit",e=>{if(!e.target.matches('[data-form="inspo-add"]'))return;
    e.preventDefault();e.stopImmediatePropagation();
    const url=acceptURL(String(new FormData(e.target).get("link")||"").trim());
    if(!url)return toast("Use a TikTok post or TikTok short share link.");
    if(getVideos().some(x=>x.url===url))return toast("That video is already in inspiration.");
    if(!Array.isArray(state.inspoExtras))state.inspoExtras=[];
    state.inspoExtras.push({id:uid(),url});persist();$("#modal").close();goTab("explore");toast("TikTok added.");
  },true);
  render();
})();
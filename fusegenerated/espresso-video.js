"use strict";
// Espresso media is stored only in this browser, not published to Fuse or TikTok.
(function(){
 const DATABASE="fusegenerated-local-videos",STORE="clips",KEY="espresso";
 let openPromise=null,activeUrl=null,renderVersion=0;
 function db(){
  if(!("indexedDB" in window))return Promise.reject(new Error("This browser does not support saved videos."));
  if(!openPromise)openPromise=new Promise((resolve,reject)=>{
   const request=indexedDB.open(DATABASE,1);
   request.onupgradeneeded=()=>{const d=request.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE);};
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
  return openPromise;
 }
 async function read(){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readonly"),req=tx.objectStore(STORE).get(KEY);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
 async function write(blob){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readwrite");tx.objectStore(STORE).put(blob,KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
 async function remove(){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
 function uploader(){return '<div class="espresso-local-upload"><label class="label" for="espressoLocalVideo">Show my Espresso video here</label><input id="espressoLocalVideo" class="field" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" aria-label="Choose your Espresso video"><p class="fine-print">Select your Espresso video once to save and play it on this device. MP4 (H.264) works best in Chrome. It stays private to this browser and is not a published post.</p></div>'}
 function put(target,blob,isPost){
  if(!target)return;
  const label='<p class="eyebrow">ESPRESSO BY STRIVE · YOUR VIDEO</p>';
  if(!blob){target.innerHTML=label+'<div class="espresso-empty-video"><span>▶</span><p>Your Espresso video will play here.</p></div>'+uploader();return}
  if(!activeUrl)activeUrl=URL.createObjectURL(blob);
  target.innerHTML=label+'<video class="espresso-inline-player" controls playsinline preload="metadata" aria-label="Your Espresso by Strive video"></video><p class="small muted">Saved locally to this device · Not yet posted to TikTok or Instagram.</p>'+(isPost?'':uploader())+'<button class="button secondary tiny espresso-video-remove" data-espresso-remove type="button">Remove saved video</button>';
  target.querySelector("video").src=activeUrl;
  target.querySelector("video").addEventListener("error",()=>{const msg=target.querySelector(".espresso-video-error");if(!msg){const p=document.createElement("p");p.className="espresso-video-error small";p.textContent="This file format cannot play in this browser. Upload an MP4 (H.264) version instead.";target.appendChild(p);}});
 }
 async function refresh(){
  const slot=document.getElementById("espressoVideoSlot"),post=document.getElementById("espressoPostVideoSlot");if(!slot&&!post)return;
  const current=++renderVersion;
  try{const blob=await read();if(current!==renderVersion)return;put(slot,blob,false);put(post,blob,true)}
  catch(e){if(slot)slot.innerHTML=uploader()+'<p class="small muted">Video storage unavailable in this browser.</p>';if(post)post.innerHTML='<p class="small muted">Video storage unavailable.</p>'}
 }
 document.addEventListener("change",async event=>{
  if(event.target?.id!=="espressoLocalVideo")return;
  const file=event.target.files?.[0];if(!file)return;
  if(!/^video\//.test(file.type)&&!/\\.(mov|mp4)$/i.test(file.name)){if(typeof toast==="function")toast("Choose an MP4 or MOV video.");return}
  try{await write(file);if(activeUrl){URL.revokeObjectURL(activeUrl);activeUrl=null}await refresh();if(typeof toast==="function")toast("Your Espresso video is now saved and playable in My Content.")}
  catch(e){if(typeof toast==="function")toast("Could not save video in this browser. Try a smaller MP4.");}
 });
 document.addEventListener("click",async event=>{
  if(!event.target.closest("[data-espresso-remove]"))return;
  try{await remove();if(activeUrl){URL.revokeObjectURL(activeUrl);activeUrl=null}await refresh();if(typeof toast==="function")toast("Saved Espresso video removed.")}
  catch{if(typeof toast==="function")toast("Could not remove the video.")}
 });
 const originalRender=render;
 render=function(){originalRender();refresh()};
 refresh();
})();
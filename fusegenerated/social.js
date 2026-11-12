"use strict";
(function(){
let client=null,user=null,profile=null,friends=[],pending=[],results=[],searchMatches=null,busy=false,notice="",configured=false;
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const h=(label,action,attrs="")=>'<button type="button" class="button tiny" data-social-action="'+action+'" '+attrs+'>'+label+'</button>';
const input=(name,label,type="text",value="",extra="")=>'<label class="label" for="social-'+name+'">'+label+'</label><input class="field" id="social-'+name+'" name="'+name+'" type="'+type+'" value="'+safe(value)+'" '+extra+' required>';
const alert=()=>notice?'<div class="notice" role="status">'+safe(notice)+'</div>':"";
const redraw=()=>{if(typeof render==="function"&&["friends","profile"].includes(state.tab)&&!state.detail)render()};
async function load(){if(!client||!user)return;const {data:p,error:e}=await client.from("profiles").select("*").eq("id",user.id).maybeSingle();if(e){notice=e.message;return}profile=p;const {data:rels}=await client.from("friendships").select("id,requester,recipient,status").or("requester.eq."+user.id+",recipient.eq."+user.id);friends=(rels||[]).filter(r=>r.status==="accepted");pending=(rels||[]).filter(r=>r.status==="pending");const ids=[...new Set([...friends,...pending].map(r=>r.requester===user.id?r.recipient:r.requester))];const {data:people}=ids.length?await client.from("profiles").select("id,username,display_name,school,bio").in("id",ids):{data:[]};results=people||[]}
async function run(fn){if(busy)return;busy=true;notice="";try{await fn()}catch(e){notice=e.message||"Something went wrong"}finally{busy=false;redraw()}}
function person(id){return results.find(p=>p.id===id)}
function card(p,button){return '<article class="friend-card"><div class="friend-avatar">'+safe(p.display_name.slice(0,1).toUpperCase())+'</div><div class="friend-meta"><h3>'+safe(p.display_name)+'</h3><p>@'+safe(p.username)+' · '+safe(p.school||"Creator")+'</p><span>'+safe(p.bio||"On FuseGenerated")+'</span></div>'+button+'</article>'}
function auth(){return '<section class="page">'+
'<p class="eyebrow">JOIN YOUR FRIENDS</p><h1 class="page-title">Your own Fuse account.</h1><p class="subhead">Sign up or sign in from any phone. Your profile and friendships will be saved securely online.</p>'+alert()+
'<form data-social-form="signup" class="panel"><h3>Create account</h3>'+input("email","Email","email","","autocomplete=\"email\"")+
input("password","Password (at least 8 characters)","password","","minlength=\"8\" autocomplete=\"new-password\"")+
'<button class="button full" type="submit">Sign up →</button></form>'+
'<form data-social-form="signin" class="panel"><h3>Already have an account?</h3>'+input("login-email","Email","email","","autocomplete=\"username\"")+
input("login-password","Password","password","","autocomplete=\"current-password\"")+
'<button class="button secondary full" type="submit">Sign in</button></form><p class="fine-print">A confirmation email may be required. Each friend must create their own account.</p></section>'}
function setup(){return '<section class="page">'+
'<p class="eyebrow">WELCOME TO FUSE</p><h1 class="page-title">Create your profile.</h1><p class="subhead">Choose your name and unique username. Friends can find you with your username.</p>'+alert()+
'<form data-social-form="profile" class="panel">'+input("name","Display name","text","","maxlength=\"80\"")+
input("username","Username (3–24 lowercase letters, numbers or underscores)","text","","minlength=\"3\" maxlength=\"24\" pattern=\"[a-z0-9_]{3,24}\"")+
input("school","School (optional)","text","","maxlength=\"100\"")+
'<label class="label" for="social-bio">Bio (optional)</label><textarea class="field" id="social-bio" name="bio" maxlength="250"></textarea>'+
'<button class="button full" type="submit">Save my profile →</button></form></section>'}
function account(){if(!configured)return notReady();if(!user)return auth();if(!profile)return setup();return '<section class="page">'+
'<p class="eyebrow">YOUR REAL ACCOUNT</p><h1 class="page-title">'+safe(profile.display_name)+'</h1><p class="subhead">@'+safe(profile.username)+'</p>'+alert()+
'<div class="panel profile-person"><div class="profile-avatar">'+safe(profile.display_name.slice(0,1).toUpperCase())+'</div><div><h3>'+safe(profile.display_name)+'</h3><p class="small muted">'+safe(profile.school||"Add your school")+'</p><p class="small muted">'+safe(profile.bio||"Add your bio")+'</p></div></div>'+
'<form data-social-form="edit" class="panel"><h3>Edit profile</h3>'+input("name","Display name","text",profile.display_name,'maxlength="80"')+
input("school","School","text",profile.school||'','maxlength="100"')+
'<label class="label" for="social-bio">Bio</label><textarea class="field" id="social-bio" name="bio" maxlength="250">'+safe(profile.bio||"")+'</textarea>'+
'<button class="button full" type="submit">Save changes</button></form>'+
'<div class="panel"><h3>Invite Mary or another friend</h3><p class="small muted">Have them open FuseGenerated and sign up. Then search their username in Friends.</p>'+h("Go to Friends","friends")+'</div>'+
'<div class="panel"><p class="small muted">'+safe(user.email||"")+'</p>'+h("Sign out","signout")+'</div>'+
'<p class="fine-print">Restaurant opportunities and creator video examples remain demo data; your account/profile/friendships are real.</p></section>'}
function friendshipButton(p){const r=[...friends,...pending].find(x=>x.requester===p.id||x.recipient===p.id);if(!r)return h("Add friend","request",'data-id="'+safe(p.id)+'"');if(r.status==="accepted")return h("Friends ✓","remove",'data-id="'+safe(r.id)+'"');if(r.recipient===user.id)return h("Accept","accept",'data-id="'+safe(r.id)+'"');return '<span class="status waiting">Requested</span>'}
function discover(){if(!configured)return notReady();if(!user||!profile)return account();return '<section class="page friends-page">'+
'<p class="eyebrow">REAL CONNECTIONS</p><h1 class="page-title">Friends.</h1><p class="subhead">Find Mary by her username once she joins. Your friendships sync between devices.</p>'+alert()+
'<form data-social-form="search" class="panel"><label class="label" for="social-search">Find someone on Fuse</label><input class="field" id="social-search" name="query" type="search" placeholder="Search name or @username" required><button class="button full" type="submit">Search creators</button></form>'+
'<div id="social-results">'+(searchMatches===null?'':('<div class="section-heading"><h2>Search results</h2><span>'+searchMatches.length+'</span></div>'+(searchMatches.map(p=>card(p,friendshipButton(p))).join('')||'<p class="small muted">No profiles found.</p>')))+'</div><div class="section-heading"><h2>Friend requests</h2><span>'+pending.filter(r=>r.recipient===user.id).length+' incoming</span></div>'+
(pending.filter(r=>r.recipient===user.id).map(r=>{const p=person(r.requester);return p?card(p,friendshipButton(p)):""}).join("")||'<div class="empty">No pending requests.</div>')+
'<div class="section-heading"><h2>My friends</h2><span>'+friends.length+'</span></div>'+
(friends.map(r=>{const p=person(r.requester===user.id?r.recipient:r.requester);return p?card(p,friendshipButton(p)):""}).join("")||'<div class="empty">Your real friendships will appear here.</div>')+
'<p class="fine-print">This is your live friends list. Demo friends and example TikToks are not verified accounts.</p></section>'}
function notReady(){return '<section class="page">'+
'<p class="eyebrow">ACCOUNT SETUP</p><h1 class="page-title">Real accounts are being connected.</h1>'+
'<p class="subhead">The app now supports individual accounts and friends. The database connection must be configured before you or Mary can sign up.</p>'+
'<div class="notice">Your existing restaurant and video demo is still available in Explore and My Content.</div></section>'}
const api={
 get enabled(){return true},
 renderFriends:discover,
 renderProfile:account,
 async initialize(){try{const conf=await fetch("/api/social/config",{cache:"no-store"}).then(r=>r.json());configured=!!conf.configured;
 if(configured){const mod=await import("https://esm.sh/@supabase/supabase-js@2.49.10");client=mod.createClient(conf.url,conf.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});const {data}=await client.auth.getSession();user=data.session?.user||null;if(user)await load();client.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;setTimeout(async()=>{if(user)await load();else{profile=null;friends=[];pending=[];results=[]}redraw()},0)})}}catch(e){notice="Account service unavailable: "+e.message}redraw()
 }
};
window.FuseSocial=api;
document.addEventListener("submit",e=>{const form=e.target.closest("[data-social-form]");if(!form)return;e.preventDefault();const d=new FormData(form),type=form.dataset.socialForm;
run(async()=>{
 if(!client)throw Error("Account service isn't configured.");
 if(type==="signup"){const email=String(d.get("email")||"").trim(),password=String(d.get("password")||"");if(password.length<8)throw Error("Use at least eight characters.");const {data,error}=await client.auth.signUp({email,password});if(error)throw error;notice=data.session?"Account created — complete your profile.":"Check your email to confirm your account, then sign in."}
 if(type==="signin"){const {error}=await client.auth.signInWithPassword({email:String(d.get("login-email")||"").trim(),password:String(d.get("login-password")||"")});if(error)throw error;notice="Signed in."}
 if(type==="profile"||type==="edit"){const name=String(d.get("name")||"").trim(),school=String(d.get("school")||"").trim(),bio=String(d.get("bio")||"").trim();if(!name||name.length>80)throw Error("Enter a name.");let query=client.from("profiles");let result;if(type==="profile"){const username=String(d.get("username")||"").trim().toLowerCase();if(!/^[a-z0-9_]{3,24}$/.test(username))throw Error("Username must be 3–24 lowercase letters, numbers or underscores.");result=await query.insert({id:user.id,username,display_name:name,school,bio})}else result=await query.update({display_name:name,school,bio}).eq("id",user.id);if(result.error)throw result.error;await load();notice="Profile saved."}
 if(type==="search"){const q=String(d.get("query")||"").trim().replace(/^@/,"").slice(0,40);if(q.length<2)throw Error("Enter at least two characters.");const {data,error}=await client.from("profiles").select("id,username,display_name,school,bio").or("username.ilike.%"+q.replace(/[%_,.()]/g,"") + "%,display_name.ilike.%"+q.replace(/[%_,.()]/g,"")+"%").limit(20);if(error)throw error;const matches=(data||[]).filter(p=>p.id!==user.id);searchMatches=matches;const el=document.getElementById("social-results");if(el)el.innerHTML='<div class="section-heading"><h2>Search results</h2><span>'+matches.length+'</span></div>'+(matches.map(p=>card(p,friendshipButton(p))).join("")||'<p class="small muted">No profiles found.</p>');return}
 })});
document.addEventListener("click",e=>{const btn=e.target.closest("[data-social-action]");if(!btn)return;const action=btn.dataset.socialAction,id=btn.dataset.id;
if(action==="friends"){state.tab="friends";state.detail=null;redraw();return}
run(async()=>{
 if(action==="signout"){const {error}=await client.auth.signOut();if(error)throw error;user=null;profile=null;friends=[];pending=[];results=[];return}
 if(action==="request"){const {error}=await client.from("friendships").insert({requester:user.id,recipient:id,status:"pending"});if(error)throw error;notice="Friend request sent."}
 if(action==="accept"){const {error}=await client.from("friendships").update({status:"accepted"}).eq("id",id).eq("recipient",user.id);if(error)throw error;notice="Friend request accepted."}
 if(action==="remove"){const {error}=await client.from("friendships").delete().eq("id",id);if(error)throw error;notice="Connection removed."}
 await load()
})});
api.initialize();
})();
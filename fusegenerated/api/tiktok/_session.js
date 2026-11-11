const crypto=require("node:crypto");
const COOKIE="fuse_tiktok_session",STATE="fuse_tiktok_state";
const configured=()=>!!(process.env.TIKTOK_CLIENT_KEY&&process.env.TIKTOK_CLIENT_SECRET&&process.env.TIKTOK_REDIRECT_URI&&process.env.TIKTOK_SESSION_SECRET&&process.env.TIKTOK_SESSION_SECRET.length>=32);
function cookies(req){return Object.fromEntries(String(req.headers.cookie||"").split(";").map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf("=");return [x.slice(0,i),x.slice(i+1)]}));}
function key(){return crypto.createHash("sha256").update(process.env.TIKTOK_SESSION_SECRET||"").digest();}
function seal(data){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",key(),iv),ct=Buffer.concat([cipher.update(JSON.stringify(data),"utf8"),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),ct]).toString("base64url");}
function unseal(input){try{const b=Buffer.from(input,"base64url");const d=crypto.createDecipheriv("aes-256-gcm",key(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString("utf8"));}catch{return null;}}
function readSession(req){if(!configured())return null;const session=unseal(cookies(req)[COOKIE]||"");return session&&session.access_token&&session.expires_at>Date.now()?session:null;}
function setSession(res,token){const ttl=Math.min(86400,Math.max(60,Math.floor((token.expires_in||86400))));const data={access_token:token.access_token,open_id:token.open_id,expires_at:Date.now()+ttl*1000,scope:token.scope};res.setHeader("Set-Cookie",COOKIE+"="+seal(data)+"; Path=/api/tiktok; HttpOnly; Secure; SameSite=Lax; Max-Age="+ttl);}
module.exports={COOKIE,STATE,configured,cookies,readSession,setSession};
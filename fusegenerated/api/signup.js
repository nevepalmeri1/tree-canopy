"use strict";
const {randomUUID,createHash}=require("node:crypto");
const {put}=require("@vercel/blob");
module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 try{
  const origin=req.headers.origin||"";
  if(origin){let host;try{host=new URL(origin).hostname}catch{return res.status(403).json({error:"Invalid origin"})}
    if(!(host==="fusegenerated.vercel.app"||host.endsWith(".vercel.app")||host==="localhost"))return res.status(403).json({error:"Invalid origin"});
  }
  if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(503).json({error:"Signup service unavailable."});
  const obj=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
  if(obj.website)return res.status(200).json({ok:true});
  const name=String(obj.name||"").trim().replace(/\\s+/g," "),email=String(obj.email||"").trim().toLowerCase(),
  school=String(obj.school||"").trim(),interest=String(obj.interest||""),consent=obj.consent==="yes";
  if(name.length<2||name.length>80||school.length>100||email.length>180||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)||!["creator","discover","business"].includes(interest)||!consent)
    return res.status(400).json({error:"Please complete your name, email, and interest and check the consent box."});
  const id=createHash("sha256").update(email).digest("hex"); // Don't expose email in storage filenames.
  const record={name,email,school,interest,consent:true,createdAt:new Date().toISOString(),source:"presentation-qr"};
  await put("early-access/"+id+".json",JSON.stringify(record),{access:"private",allowOverwrite:true,contentType:"application/json"});
  return res.status(201).json({ok:true});
 }catch(err){console.error("Fuse signup error",err?.message);return res.status(500).json({error:"Could not save your signup. Please try again."});}
};

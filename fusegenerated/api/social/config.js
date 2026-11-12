// Public browser-safe configuration only. Never expose a service_role key here.
export default function handler(req,res) {
 res.setHeader("Cache-Control","no-store");
 const url=process.env.SUPABASE_URL || "";
 const key=process.env.SUPABASE_ANON_KEY || "";
 res.status(200).json({configured:Boolean(url&&key),url,key});
}

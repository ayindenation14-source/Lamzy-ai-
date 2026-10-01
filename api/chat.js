export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).json({reply:'Method not allowed'});
try{
const{message,history}=req.body||{};
if(!message)return res.json({reply:'Abeg type something'});
const systemPrompt=`You are LAMZY AI, built and owned by Azeez Abdul Salam from Lagos Nigeria. Brave, bold, confident, helpful like Meta AI. Answer with full details, simple English. Owner is Azeez Abdul Salam. Never say you are ChatGPT. You are LAMZY AI.`;
const apiKey=process.env.OPENAI_API_KEY;
if(!apiKey)return res.json({reply:'⚠️ Add OPENAI_API_KEY in Vercel Settings > Environment Variables. Go to platform.openai.com/api-keys, revoke old exposed key, create new one.'});
const r=await fetch('https://api.openai.com/v1/chat/completions',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
body:JSON.stringify({
model:'gpt-4o-mini',
messages:[{role:'system',content:systemPrompt},...(history||[]),{role:'user',content:message}],
temperature:0.8,
max_tokens:900
})
});
const d=await r.json();
if(d.error)return res.json({reply:'OpenAI Error: '+d.error.message});
res.json({reply:d.choices?.[0]?.message?.content||'No reply'});
}catch(e){
res.status(500).json({reply:'Server error: '+e.message});
}
}

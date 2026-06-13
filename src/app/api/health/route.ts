import { NextResponse } from "next/server";

export async function GET() {
  // #region agent log
  fetch('http://127.0.0.1:7493/ingest/e5d215f0-1ce8-484d-9bde-d15e54771def',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cef2d7'},body:JSON.stringify({sessionId:'cef2d7',location:'api/health/route.ts',message:'health hit',data:{},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  return NextResponse.json({ ok: true, service: "kitch" });
}

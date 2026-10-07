import { NextResponse } from 'next/server';
import { getPrivateKeyJwk, extractPublicKey } from '@/lib/key';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const privateKeyJwk = getPrivateKeyJwk();
    const publicKeyJwk = extractPublicKey(privateKeyJwk);
    
    return NextResponse.json(publicKeyJwk);
  } catch (err) {
    console.error("Internal PARP Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

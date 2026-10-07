import { NextResponse } from 'next/server';
import { getPrivateKeyJwk } from '@/lib/key';
import { signParp } from '@/lib/signer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const privateKeyJwk = getPrivateKeyJwk();
    
    // In a real app, this manifest might be dynamically generated
    const manifest = {
      version: "0.1",
      subject: "https://example.com/llms.txt",
      publisher: "Example Store",
      publishedAt: new Date().toISOString(),
      // The sha256 should match the exact bytes of the /llms.txt response
      contentSha256: "cbc1a7e9717550ce780c5cf6ecd75c80aadf53c817715a72f310b2f777d13511",
      license: "https://example.com/",
      use: {
        retrieval: "allow",
        training: "unspecified",
        commercial: "unspecified",
        attribution: "required"
      },
      expiresAt: "2099-01-01T00:00:00Z"
    };

    const token = await signParp(manifest, privateKeyJwk);

    return new NextResponse(token, {
      headers: {
        'Content-Type': 'application/vnd.piruz.agent-rights',
        'Cache-Control': 'private, no-store'
      }
    });
  } catch (err) {
    console.error("Internal PARP Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

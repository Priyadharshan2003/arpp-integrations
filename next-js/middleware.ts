import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // We add the Link header to the llms.txt route
  if (request.nextUrl.pathname === '/llms.txt') {
    response.headers.set('Link', '</parp>; rel="https://github.com/bruce-afruz/piruz-agent-receipt/blob/main/SPEC.md#transport"; type="application/vnd.piruz.agent-rights"');
  }
  return response;
}

export const config = {
  matcher: ['/llms.txt']
};
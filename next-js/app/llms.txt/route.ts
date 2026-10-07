import { NextResponse } from 'next/server';

export async function GET() {
  const content = "# Example Store\n\n> Café crème, 250 g — €9.50\n";
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
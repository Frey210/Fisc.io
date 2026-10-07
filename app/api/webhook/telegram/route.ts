import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Placeholder: Process Telegram Bot webhook updates (Phase 2 & Phase 3)
    return NextResponse.json({ ok: true, received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active', endpoint: 'telegram_webhook' });
}

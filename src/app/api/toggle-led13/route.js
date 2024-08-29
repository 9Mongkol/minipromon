import { NextResponse } from 'next/server';

export async function POST(request) {
  const { status } = await request.json();

  // ดำเนินการควบคุม LED ที่นี่ เช่น ส่งคำสั่งไปยัง Raspberry Pi Pico W

  return NextResponse.json({ success: true });
}

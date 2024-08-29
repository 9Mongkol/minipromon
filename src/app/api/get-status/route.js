import { NextResponse } from 'next/server';

export async function GET() {
  // ดึงข้อมูลสถานะจากเซิร์ฟเวอร์หรือฐานข้อมูล
  const status = {
    flame: false,  // ตัวอย่างข้อมูล
    vibration: false,  // ตัวอย่างข้อมูล
  };

  return NextResponse.json(status);
}

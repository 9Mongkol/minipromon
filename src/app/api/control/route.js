// pages/api/control.js

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // ส่งคำสั่งไปที่เซิร์ฟเวอร์
    const response = await fetch('https://your-device-api-url/control', { method: 'POST' });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error('Failed to control devices');
    }
  } catch (error) {
    console.error('Error controlling devices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

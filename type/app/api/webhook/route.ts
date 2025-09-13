import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { wpm, accuracy, time } = await request.json();
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // ✅ Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // ✅ Fetch user from DB
    const user = await User.findById(decoded.userId).select('username email');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const embed = {
      title: 'New Typing Test Result',
      color: 0x00ff00,
      fields: [
        { name: 'User', value: user.username, inline: true },
        { name: 'WPM', value: wpm.toString(), inline: true },
        { name: 'Accuracy', value: `${accuracy}%`, inline: true },
        { name: 'Time', value: `${time} seconds`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    // Send webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) throw new Error('Failed to send webhook');

    return NextResponse.json({ message: 'Webhook sent successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

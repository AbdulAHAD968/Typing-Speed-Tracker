import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, wpm, accuracy, time } = await request.json();
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const embed = {
      title: 'New Typing Test Result',
      color: 0x00ff00,
      fields: [
        {
          name: 'User',
          value: username,
          inline: true,
        },
        {
          name: 'WPM',
          value: wpm.toString(),
          inline: true,
        },
        {
          name: 'Accuracy',
          value: `${accuracy}%`,
          inline: true,
        },
        {
          name: 'Time',
          value: `${time} seconds`,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) {
      throw new Error('Failed to send webhook');
    }

    return NextResponse.json(
      { message: 'Webhook sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
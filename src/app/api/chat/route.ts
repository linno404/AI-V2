import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Call Cerebras API through ZAI SDK
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Respond in a friendly and helpful manner.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'cerebras/llama3.1-8b'
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process your message.';

    // Save chat to database
    await db.chat.create({
      data: {
        userId,
        message,
        response: aiResponse
      }
    });

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
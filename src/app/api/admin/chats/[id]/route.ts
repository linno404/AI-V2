// src/app/api/admin/chats/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: {
    id: string;
  };
}

// Handler GET: SUDAH BENAR
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const chatId = params.id; 

    if (!chatId) {
      return NextResponse.json({ message: 'ID tidak ditemukan' }, { status: 400 });
    }

    // Kembalikan respons sukses
    return NextResponse.json({
      message: `Data untuk Chat ID: ${chatId} berhasil diambil.`,
      id: chatId,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in GET Handler:', error);
    return NextResponse.json(
      { message: 'Kesalahan Internal Server (GET)' },
      { status: 500 }
    );
  }
}

// --- FUNGSI DELETE YANG HILANG/SALAH ---
// Handler DELETE: HARUS DITAMBAHKAN DENGAN SIGNATURE YANG SAMA
export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const chatId = params.id;

    if (!chatId) {
      return NextResponse.json({ message: 'ID Chat tidak disediakan' }, { status: 400 });
    }

    // Lakukan logika penghapusan chat di database di sini
    // ... 

    // Asumsi penghapusan berhasil
    return NextResponse.json(
      { message: `Chat ID ${chatId} berhasil dihapus.` }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in DELETE Handler:', error);
    return NextResponse.json(
      { message: 'Kesalahan Internal Server (DELETE)' },
      { status: 500 }
    );
  }
}

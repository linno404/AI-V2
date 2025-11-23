// src/app/api/admin/chats/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Definisikan tipe Context untuk argumen kedua (tempat params berada)
interface Context {
  params: {
    id: string; // Tipe ini diambil dari folder [id]
  };
}

// Fungsi handler GET harus menerima NextRequest sebagai argumen pertama
// dan Context (yang berisi params) sebagai argumen kedua.
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const chatId = params.id; // Ini cara yang benar untuk mengakses 'id'

    // --- Logika API Anda di sini ---
    // Misalnya, ambil data dari database menggunakan chatId

    if (!chatId) {
      return NextResponse.json({ message: 'ID tidak ditemukan' }, { status: 400 });
    }

    // Kembalikan respons sukses
    return NextResponse.json({
      message: `Data untuk Chat ID: ${chatId} berhasil diambil.`,
      id: chatId,
      // Tambahkan data aktual Anda di sini
    }, { status: 200 });

  } catch (error) {
    console.error('Error in API Handler:', error);
    return NextResponse.json(
      { message: 'Kesalahan Internal Server' },
      { status: 500 }
    );
  }
}
// Ulangi pola ini jika Anda memiliki handler POST, PUT, atau DELETE.

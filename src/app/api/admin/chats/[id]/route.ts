import { NextRequest, NextResponse } from "next/server";

// Dummy function for decoding token
function verifyToken(token: string) {
  try {
    // Buat sesuai kebutuhan kamu
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
  } catch {
    return null;
  }
}

function isAdmin(decoded: any) {
  return decoded && decoded.role === "ADMIN";
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !isAdmin(decoded)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // TODO: logic hapus chat di database
    // await prisma.chat.delete({ where: { id } });

    return NextResponse.json({
      message: "Chat deleted successfully",
      id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

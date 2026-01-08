import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function toIsoString(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toDate" in (value as object)) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString();
  }
  return "";
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const docSnap = await adminDb.collection("orders").doc(params.orderId).get();

  if (!docSnap.exists) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const data = docSnap.data();
  if (userId && data?.userId !== userId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return NextResponse.json({
    id: docSnap.id,
    ...data,
    createdAt: toIsoString(data?.createdAt),
  });
}

import { NextResponse } from "next/server";
import { convertQuotationToOrder } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json();
  const quotationId = body?.quotationId as string | undefined;
  if (!quotationId) {
    return NextResponse.json({ error: "quotationId required" }, { status: 400 });
  }
  const order = convertQuotationToOrder(quotationId);
  if (!order) {
    return NextResponse.json(
      { error: "Quote not found or already converted" },
      { status: 400 },
    );
  }
  return NextResponse.json({ orderId: order.id, number: order.number });
}

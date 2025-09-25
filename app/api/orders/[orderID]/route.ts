import { NextResponse } from "next/server";
import { db } from "@/lib/orders-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, context: { params: Promise<{ orderID: string }> }) {
    const { orderID } = await context.params;
    const idx = db.orders.findIndex(o => o.id === orderID);
    if (idx === -1) {
        return NextResponse.json(
            { code: "NOT_FOUND", message: "Zamówienie nie istnieje." },
            { status: 404 }
        );
    }
    const [removed] = db.orders.splice(idx, 1);
    return NextResponse.json({ deleted: true, id: removed.id }, { status: 200 });
}

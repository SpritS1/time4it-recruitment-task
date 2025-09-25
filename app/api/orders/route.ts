import { NextResponse } from "next/server";
import { db, validateOrder } from "@/lib/orders-data";
import type { Order } from "@/lib/orders-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"

function parseIntSafe(v: string | null, def: number) {
    const n = v ? parseInt(v, 10) : def;
    return Number.isFinite(n) ? n : def;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const pageQ = parseIntSafe(searchParams.get("page"), 1);
    const perQ  = parseIntSafe(searchParams.get("perPage"), 7);

    const total = db.orders.length;
    const perPage = clamp(perQ, 1, 100);
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const page = clamp(pageQ, 1, totalPages);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const items = db.orders.slice(start, end);

    const body = { items, page, perPage, total, totalPages, hasPrev: page > 1, hasNext: page < totalPages };

    const base = req.url.split("?")[0];
    const mk = (p: number) => `${base}?page=${p}&perPage=${perPage}`;
    const links: string[] = [
        `<${mk(1)}>; rel="first"`,
        `<${mk(totalPages)}>; rel="last"`,
    ];
    if (page > 1) links.push(`<${mk(page - 1)}>; rel="prev"`);
    if (page < totalPages) links.push(`<${mk(page + 1)}>; rel="next"`);

    return new NextResponse(JSON.stringify(body), {
        status: 200,
        headers: {
            "content-type": "application/json",
            "Link": links.join(", ")
        }
    });
}

export async function POST(req: Request) {
    const body = await req.json();
    const errors = validateOrder(body);
    if (Object.keys(errors).length) {
        return NextResponse.json(
            { code: "VALIDATION_ERROR", fieldErrors: Object.entries(errors).map(([field, message]) => ({ field, message })) },
            { status: 422 }
        );
    }
    const newOrder: Order = {
        id: crypto.randomUUID(),
        orderNumber: String(body.orderNumber),
        customer: String(body.customer),
        status: body.status,
        dueDate: body.dueDate,
        totalGross: Number(body.totalGross),
    };
    db.orders.unshift(newOrder);
    return NextResponse.json(newOrder, { status: 201 });
}
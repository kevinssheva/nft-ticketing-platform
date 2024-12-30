import { db } from "@/db/drizzle";
import { seat } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const ticket = await db
      .select()
      .from(seat)
      .where(sql`${seat.eventId} = ${id} AND ${seat.is_selling} = TRUE`);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Change owner address & change status to selling
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const seatId = url.searchParams.get("seatId");

  const { ownerAddress, isSelling } = await req.json();

  if ((!ownerAddress && isSelling === undefined) || !seatId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  if (ownerAddress) {
    try {
      const seatRecord = await db.select().from(seat).where(sql`${seat.id} = ${seatId}`).limit(1).execute();

      if (seatRecord.length === 0) {
        return NextResponse.json({ error: "Seat not found" }, { status: 404 });
      }

      const updatedSeat = await db
        .update(seat)
        .set({
          ownerAddress,
          is_selling: false,
        })
        .where(sql`${seat.id} = ${seatId}`)
        .returning();

      return NextResponse.json(updatedSeat[0], { status: 200 });
    } catch (error) {
      console.error("Error updating seat owner:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  } else {
    try {
      const seatRecord = await db.select().from(seat).where(sql`${seat.id} = ${seatId}`).limit(1).execute();

      if (seatRecord.length === 0) {
        return NextResponse.json({ error: "Seat not found" }, { status: 404 });
      }

      await db.update(seat).set({ is_selling: true }).where(sql`${seat.id} = ${seatId}`)

      return NextResponse.json({ response: "ok" }, { status: 200 });
    } catch (error) {
      console.error("Error updating seat owner:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}

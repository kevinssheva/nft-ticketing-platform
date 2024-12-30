import { db } from "@/db/drizzle";
import { seat } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const ownedTicket = await db.query.seat.findMany({
      with: {
        event: true,
      },
      where: eq(seat.ownerAddress, id),
    });

    const listedTicket = await db.query.seat.findMany({
      with: {
        event: true,
      },
      where: eq(seat.creatorAddress, id),
    });

    return NextResponse.json(
      {
        ownedTicket,
        listedTicket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

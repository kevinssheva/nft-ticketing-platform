import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { event } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required." },
        { status: 400 }
      );
    }

    const selectedEvent = await db
      .select()
      .from(event)
      .where(sql`${event.id} = id`)
      .limit(1)

    if (selectedEvent.length === 0) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(selectedEvent[0], { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

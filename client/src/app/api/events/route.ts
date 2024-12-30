import { db } from "@/db/drizzle";
import { event, seat } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { eventName, eventDetail, eventDate, sellDate, venue, owner, purchaseLimit, tickets, posterImage, seatImage } = body;

  if (!eventName || !eventDetail || !eventDate || !sellDate || !venue || !owner || !purchaseLimit || !tickets || !posterImage || !seatImage) {
    return NextResponse.json(
      { error: "invalid body request" },
      { status: 400 }
    );
  }

  // TODO: implement IPFS
  // const imagePosterUrl = posterImage;
  // const imageSeatsUrl = seatImage;
  const imagePosterUrl = "ABCDE";
  const imageSeatsUrl = "ABCDE";

  try {
    const newEvent = await db.insert(event).values({
      creatorAddress: owner,
      dateEvent: new Date(eventDate),
      dateSell: new Date(sellDate),
      title: eventName,
      description: eventDetail,
      imagePoster: imagePosterUrl,
      imageSeats: imageSeatsUrl,
      venue: venue,
      purchaseLimit: purchaseLimit
    }).returning();

    const eventId = newEvent[0].id;

    const tempTickets: { price: string, row: string, zone: string, creator: string, owner: string }[][] = tickets.map((ticket: { zone: string, row: number, seat: number, price: number }) => {
      let seats: { price: string, row: string, zone: string, creator: string, owner: string }[] = [];

      for (let i = 0; i < ticket.row; i++) {
        const rowCode = String.fromCharCode(65 + i);
        for (let j = 0; j < ticket.seat; j++) {
          seats.push({
            price: ticket.price.toString(),
            row: rowCode,
            zone: ticket.zone,
            creator: owner,
            owner: owner,
          })
        }
      }

      return seats;
    })

    const newTickets = tempTickets.flat();

    // TODO: integrate with blockchain
    await db.insert(seat).values(newTickets.map((newTicket) => {
      return {
        eventId: eventId,
        price: newTicket.price,
        seatRow: newTicket.row,
        zone: newTicket.zone,
        creatorAddress: newTicket.creator,
        ownerAddress: newTicket.owner
      }
    }))

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const events = await db.select().from(event);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

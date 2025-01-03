import { db } from "@/db/drizzle";
import { event, seat } from "@/db/schema";
import { getPinataUrl, pinata } from "@/lib/pinata";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    eventName,
    eventDetail,
    eventDate,
    sellDate,
    venue,
    owner,
    purchaseLimit,
    tickets,
    posterImage,
    seatImage,
  } = body;

  if (
    !eventName ||
    !eventDetail ||
    !eventDate ||
    !sellDate ||
    !venue ||
    !owner ||
    !purchaseLimit ||
    !tickets ||
    !posterImage ||
    !seatImage
  ) {
    return NextResponse.json(
      { error: "invalid body request" },
      { status: 400 }
    );
  }

  const base64ToFile = (
    base64: string,
    filename: string,
    mimeType: string
  ): File =>
    new File(
      [
        new Blob(
          [
            new Uint8Array(
              atob(base64.split(",")[1])
                .split("")
                .map((c) => c.charCodeAt(0))
            ),
          ],
          { type: mimeType }
        ),
      ],
      filename,
      { type: mimeType }
    );

  const posterUpload = await pinata.upload.file(
    base64ToFile(posterImage, "poster.png", "image/png")
  );
  const posterIPFSCid = await pinata.gateways.convert(posterUpload.IpfsHash);
  const imagePosterUrl = getPinataUrl(posterIPFSCid);

  const seatsUpload = await pinata.upload.file(
    base64ToFile(seatImage, "poster.png", "image/png")
  );
  const seatsIPFSCid = await pinata.gateways.convert(seatsUpload.IpfsHash);
  const imageSeatsUrl = getPinataUrl(seatsIPFSCid);

  try {
    const newEvent = await db
      .insert(event)
      .values({
        creatorAddress: owner.address,
        dateEvent: new Date(eventDate),
        dateSell: new Date(sellDate),
        title: eventName,
        description: eventDetail,
        imagePoster: imagePosterUrl,
        imageSeats: imageSeatsUrl,
        venue: venue,
        purchaseLimit: purchaseLimit,
      })
      .returning();

    const eventId = newEvent[0].id;

    const tempTickets: {
      price: string;
      row: string;
      zone: string;
      creator: string;
      owner: string;
    }[][] = tickets.map(
      (ticket: { zone: string; row: number; seat: number; price: number }) => {
        let seats: {
          price: string;
          row: string;
          zone: string;
          creator: string;
          owner: string;
        }[] = [];

        for (let i = 0; i < ticket.row; i++) {
          const rowCode = String.fromCharCode(65 + i);
          for (let j = 0; j < ticket.seat; j++) {
            seats.push({
              price: ticket.price.toString(),
              row: rowCode,
              zone: ticket.zone,
              creator: owner.address,
              owner: owner.address,
            });
          }
        }

        return seats;
      }
    );

    const newTickets = tempTickets.flat();

    // TODO: integrate with blockchain (create ticket)
    const ticketData = await db
      .insert(seat)
      .values(
        newTickets.map((newTicket) => {
          return {
            eventId: eventId,
            price: newTicket.price,
            seatRow: newTicket.row,
            zone: newTicket.zone,
            creatorAddress: newTicket.creator,
            ownerAddress: newTicket.owner,
            is_selling: false,
          };
        })
      )
      .returning();

    return NextResponse.json(newEvent, { status: 201 });
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

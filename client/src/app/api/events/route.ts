import { db } from "@/db/drizzle";
import { event, seat } from "@/db/schema";
import { mintTickets } from "@/eth/app";
import { getPinataUrl, pinata } from "@/lib/pinata";
import { NextResponse } from "next/server";
import { Web3 } from "web3";

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
        creatorAddress: owner,
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
              creator: owner,
              owner: owner,
            });
          }
        }

        return seats;
      }
    );

    const newTickets = tempTickets.flat().map((newTicket) => {
      return {
        eventId: eventId,
        price: newTicket.price,
        transactionHash: "",
        seatRow: newTicket.row,
        zone: newTicket.zone,
        creatorAddress: newTicket.creator,
        ownerAddress: newTicket.owner,
        is_selling: false,
      };
    });

    // TODO: integrate with blockchain (create ticket)
    const ticketData = await db.insert(seat).values(newTickets).returning();

    const web3 = new Web3("http://127.0.0.1:8545/");

    const ticketToBlockchain = ticketData.map((ticketDatum) => {
      const priceInWei = web3.utils.toWei(ticketDatum.price, "ether");

      return {
        ticketId: ticketDatum.id,
        eventId: ticketDatum.eventId,
        eventName: eventName,
        dates: [new Date(eventDate), new Date(eventDate), new Date(eventDate)],
        zone: ticketDatum.zone,
        seat: ticketDatum.seatRow,
        priceInWei: priceInWei,
        limit: purchaseLimit,
        sellerAddress: owner,
        isHold: true
      }
    })

    const web3object = new Web3(window.ethereum);

    await mintTickets(web3object, ticketToBlockchain);

    console.log("insert blockchain");

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

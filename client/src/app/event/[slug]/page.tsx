"use client";

import PurchaseTicketContainer from "@/components/PurchaseTicketContainer";
import {
  Calendar,
  CalendarPlus2,
  CircleDollarSign,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const EventDetail = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [event, setEvent] = useState<{
    eventName: string;
    eventDetail: string;
    eventDate: string;
    sellDate: string;
    venue: string;
    purchaseLimit: 3;
    tickets: [
      {
        zone: string;
        row: string;
        seat: number;
        price: number;
      }
    ];
    posterImage: string;
    seatImage: string;
  } | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const slug = (await params).slug;
      setSlug(slug);
      try {
        const response = await fetch(`/api/events/${slug}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);

          console.log(event);
        } else {
          console.error("Event not found");
        }
      } catch (err) {
        console.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const eventDateTimeUTC = new Date(event ? event.eventDate : "");
  const sellDateTimeUTC = new Date(event ? event.sellDate : "");

  return (
    <div className="flex flex-col min-h-screen items-start m-0 px-8 lg:px-32 gap-16 justify-center bg-gray-50">
      {loading || event === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-row w-full gap-16">
            <div className="flex flex-col w-full gap-8">
              <p className="text-bold text-4xl">{event.eventName}</p>
              <p className="text-lg">{event.eventDetail}</p>
              <Card className="w-full h-full shadow-lg">
                <CardContent className="grid grid-cols-2 gap-4 p-8">
                  <div className="flex flex-row gap-8 items-center">
                    <Calendar />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Event Date</p>
                      <p className="text-lg">
                        {eventDateTimeUTC.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-center">
                    <CalendarPlus2 />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Sell Date</p>
                      <p className="text-lg">
                        {sellDateTimeUTC.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-center">
                    <MapPin />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Event Venue</p>
                      <p className="text-lg">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-center">
                    <CircleDollarSign />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Ticket Price</p>
                      <p className="text-lg">
                        {Math.min(
                          ...event.tickets.map((ticket) => ticket.price)
                        )}
                        {" - "}
                        {Math.max(
                          ...event.tickets.map((ticket) => ticket.price)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-center">
                    <Clock />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Event Time</p>
                      <p className="text-lg">
                        {eventDateTimeUTC.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-center">
                    <Ticket />
                    <div className="flex flex-col gap-4">
                      <p className="text-lg text-gray-500">Purchase Limit</p>
                      <p className="text-lg">{event.purchaseLimit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="relative w-1/3 min-h-fit">
              <Image
                src={event.posterImage}
                alt={event.eventName}
                className="object-contain rounded-xl"
                fill
              />
            </div>
          </div>
          <Card className="w-full h-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Purchase Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseTicketContainer slug={slug} image={event.seatImage} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EventDetail;

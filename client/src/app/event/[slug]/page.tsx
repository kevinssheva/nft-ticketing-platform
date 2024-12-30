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
    title: string;
    description: string;
    dateEvent: string;
    dateSell: string;
    venue: string;
    purchaseLimit: 3;
    imagePoster: string;
    imageSeats: string;
  } | null>(null);
  const [tickets, setTicket] = useState<
    {
      id: string;
      price: string;
      seatRow: string;
      zone: string;
    }[]
  >([]);
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
        } else {
          alert("Event not found");
        }
      } catch (err) {
        alert("Failed to fetch event details");
      } finally {
        setLoading(false);
      }

      try {
        const response = await fetch(`/api/tickets?id=${slug}`);

        if (response.ok) {
          const data = await response.json();
          setTicket(data);
        } else {
          alert("Event not found");
        }
      } catch (err) {
        alert("Failed to fetch ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const eventDateTimeUTC = new Date(event ? event.dateEvent : "");
  const sellDateTimeUTC = new Date(event ? event.dateSell : "");

  return (
    <div className="flex flex-col min-h-screen items-start m-0 px-8 lg:px-32 gap-16 justify-center bg-gray-50">
      {loading || event === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-row w-full gap-16">
            <div className="flex flex-col w-full gap-8">
              <p className="text-bold text-4xl">{event.title}</p>
              <p className="text-lg">{event.description}</p>
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
                          ...tickets.map((ticket) => parseInt(ticket.price, 10))
                        )}
                        {" - "}
                        {Math.max(
                          ...tickets.map((ticket) => parseInt(ticket.price, 10))
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
                src={event.imagePoster}
                alt={event.title}
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
              <PurchaseTicketContainer
                tickets={tickets}
                imageSeats={event.imageSeats}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EventDetail;

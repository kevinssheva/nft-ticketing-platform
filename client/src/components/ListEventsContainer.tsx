"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useState, useEffect } from "react";

const ListEventsContainer = () => {
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      dateEvent: string;
      imagePoster: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events`);
        if (response.ok) {
          const eventData = await response.json();
          setEvents(eventData);
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

  return (
    <div className="flex flex-col gap-16">
      {loading || events.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-end p-4">
            <div className="relative max-w-lg w-full">
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 text-sm w-full rounded-md border border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full justify-items-center gap-4">
            {events.map((event, index) => (
              <Link
                key={index}
                href={`/event/${event.id}`}
                passHref
                className="relative w-full"
              >
                <Card className="flex flex-col shadow-md">
                  <CardHeader className="relative min-h-96">
                    <Image
                      src={event.imagePoster}
                      alt={event.title}
                      className="object-cover rounded-xl"
                      fill
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col py-4 gap-2">
                    <p className="text-xl font-bold text-justify">
                      {event.title}
                    </p>
                    <p className="text-lg">
                      Event Date:{" "}
                      {Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(event.dateEvent))}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListEventsContainer;

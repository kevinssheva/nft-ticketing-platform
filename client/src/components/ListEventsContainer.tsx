"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";

const ListEventsContainer = () => {
  const events = [
    {
      id: 1,
      eventName: "TWICE 5th World Tour Ready To Be",
      eventDetail: "Event Detail",
      eventDate: "2023-04-15",
      sellDate: "2023-03-01",
      venue: "Olympic Park KSPO Dome",
      purchaseLimit: 3,
      tickets: [
        {
          zone: "A",
          row: 5,
          seat: 20,
          price: 10000,
        },
      ],
      posterImage:
        "https://upload.wikimedia.org/wikipedia/id/4/4b/20230419_075953.jpg",
      seatImage: "https://pbs.twimg.com/media/F50i7VXX0AAwUvO.jpg:large",
    },
    {
      id: 1,
      eventName: "TWICE 5th World Tour Ready To Be",
      eventDetail: "Event Detail",
      eventDate: "2023-04-15",
      sellDate: "2023-03-01",
      venue: "Olympic Park KSPO Dome",
      purchaseLimit: 3,
      tickets: [
        {
          zone: "A",
          row: 5,
          seat: 20,
          price: 10000,
        },
      ],
      posterImage:
        "https://upload.wikimedia.org/wikipedia/id/4/4b/20230419_075953.jpg",
      seatImage: "https://pbs.twimg.com/media/F50i7VXX0AAwUvO.jpg:large",
    },
    {
      id: 1,
      eventName: "TWICE 5th World Tour Ready To Be",
      eventDetail: "Event Detail",
      eventDate: "2023-04-15",
      sellDate: "2023-03-01",
      venue: "Olympic Park KSPO Dome",
      purchaseLimit: 3,
      tickets: [
        {
          zone: "A",
          row: 5,
          seat: 20,
          price: 10000,
        },
      ],
      posterImage:
        "https://upload.wikimedia.org/wikipedia/id/4/4b/20230419_075953.jpg",
      seatImage: "https://pbs.twimg.com/media/F50i7VXX0AAwUvO.jpg:large",
    },
  ];

  return (
    <div className="flex flex-col gap-16">
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
                  src={event.posterImage}
                  alt={event.eventName}
                  className="object-cover rounded-xl"
                  fill
                />
              </CardHeader>
              <CardContent className="flex flex-col py-4 gap-2">
                <p className="text-xl font-bold text-justify">
                  {event.eventName}
                </p>
                <p className="text-lg">
                  Event Date:{" "}
                  {Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(event.eventDate))}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListEventsContainer;

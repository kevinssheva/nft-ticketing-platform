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

const EventDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  // TODO: call backend api to get the event associated with slug id

  const event = {
    eventName: "TWICE 5th World Tour Ready To Be",
    eventDetail: "Event Detail",
    eventDate: "2023-04-15T10:00",
    sellDate: "2023-03-01T00:00",
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
  };

  const eventDateTimeUTC = new Date(event.eventDate);
  const sellDateTimeUTC = new Date(event.sellDate);

  return (
    <div className="flex flex-col min-h-screen items-start m-0 px-8 lg:px-32 gap-16 justify-center bg-gray-50">
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
                    {Math.min(...event.tickets.map((ticket) => ticket.price))}
                    {" - "}
                    {Math.max(...event.tickets.map((ticket) => ticket.price))}
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
    </div>
  );
};

export default EventDetail;

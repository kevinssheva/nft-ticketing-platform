import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const PurchaseTicketContainer = ({
  slug,
  image,
}: {
  slug: string;
  image: string;
}) => {
  const tickets = [
    {
      seatId: 1,
      price: 10,
      row: "Red",
      zone: "A",
    },
    {
      seatId: 1,
      price: 10,
      row: "Red",
      zone: "A",
    },
    {
      seatId: 1,
      price: 10,
      row: "Red",
      zone: "A",
    },
    {
      seatId: 1,
      price: 10,
      row: "Red",
      zone: "A",
    },
  ];

  return (
    <div className="grid grid-cols-[auto_auto] gap-16">
      <div className="grid grid-cols-3 gap-8">
        {tickets.map((ticket, index) => (
          <Card className="flex flex-col shadow-md p-8 gap-4" key={index}>
            <div className="grid grid-cols-2">
              <p className="text-lg">Seat ID</p>
              <p className="text-lg">: {ticket.seatId}</p>
              <p className="text-lg">Zone</p>
              <p className="text-lg">: {ticket.zone}</p>
              <p className="text-lg">Row</p>
              <p className="text-lg">: {ticket.row}</p>
            </div>
            <Button
              type="button"
              className="text-white max-w-24 self-end text-lg bg-sky-500 hover:bg-green-500"
            >
              Buy
            </Button>
          </Card>
        ))}
      </div>
      <div className="flex flex-col h-full relative min-h-fit">
        <p className="text-xl font-bold text-center">Seating Arrangement</p>
        <Image
          src={image}
          alt="seat-image"
          className="object-contain pt-0 self-start rounded-xl"
          fill
        />
      </div>
    </div>
  );
};

export default PurchaseTicketContainer;

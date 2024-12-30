import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useWallet } from "@/contexts/WalletContext";

const PurchaseTicketContainer = ({
  tickets,
  imageSeats,
}: {
  tickets: {
    id: string;
    price: string;
    seatRow: string;
    zone: string;
  }[];
  imageSeats: string;
}) => {
  const wallet = useWallet();

  const buyTicket = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets?seatId=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerAddress: wallet.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully bought ticket.");
      } else {
        alert(data.error || "Failed to update seat");
      }
    } catch (error) {
      alert("Internal server error");
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-rows-2 w-full h-full relative min-w-fit min-h-fit">
        <p className="text-xl font-bold text-center row-start-1">
          Seating Arrangement
        </p>
        <div className="relative row-start-2 w-full h-full min-h-64">
          <Image
            src={imageSeats}
            alt="seat-image"
            className="object-contain w-full h-full"
            fill
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8">
        {tickets.map((ticket, index) => (
          <Card className="flex flex-col shadow-md p-8 gap-4" key={index}>
            <div className="grid grid-cols-[auto_auto]">
              <p className="text-lg">Seat ID</p>
              <p className="text-lg">: {ticket.id}</p>
              <p className="text-lg">Zone</p>
              <p className="text-lg">: {ticket.zone}</p>
              <p className="text-lg">Row</p>
              <p className="text-lg">: {ticket.seatRow}</p>
            </div>
            <Button
              type="button"
              className="text-white max-w-24 self-end text-lg bg-sky-500 hover:bg-green-500"
              onClick={() => {
                buyTicket(ticket.id);
              }}
            >
              Buy
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchaseTicketContainer;

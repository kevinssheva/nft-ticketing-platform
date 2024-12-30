"use client";

import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { useEffect, useState } from "react";
import { Seat } from "@/db/schema";

const SellTicketContainer = () => {
  const wallet = useWallet();
  const [ownedTickets, setOwnedTickets] = useState<Seat[]>();

  useEffect(() => {
    const fetchProfileTickets = async () => {
      const response = await fetch(`/api/users/${wallet.address}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setOwnedTickets(data.ownedTicket);

        console.log("Account registered successfully.");
        console.log(data);
      }
    };

    fetchProfileTickets();
  }, [wallet]);

  const sellTicket = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets?seatId=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isSelling: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully sold ticket.");
      } else {
        alert(data.error || "Failed to update ticket");
      }
    } catch (error) {
      alert("Internal server error");
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800">
          Sell Tickets
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ownedTickets && ownedTickets.length > 0 ? (
          ownedTickets.map((ticket) =>
            !ticket.is_selling ? (
              <Card
                className="flex flex-col shadow-md p-8 gap-4"
                key={ticket.id}
              >
                <div className="grid grid-cols-[auto_auto] gap-2">
                  <p className="text-lg font-medium">Seat ID</p>
                  <p className="text-lg">{ticket.id}</p>
                  <p className="text-lg font-medium">Zone</p>
                  <p className="text-lg">{ticket.zone}</p>
                  <p className="text-lg font-medium">Row</p>
                  <p className="text-lg">{ticket.seatRow}</p>
                </div>
                <Button
                  type="button"
                  className="self-end text-white text-lg bg-sky-500 hover:bg-red-500 w-full sm:max-w-xs"
                  onClick={() => {
                    sellTicket(ticket.id);
                  }}
                >
                  Sell
                </Button>
              </Card>
            ) : (
              <></>
            )
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SellTicketContainer;

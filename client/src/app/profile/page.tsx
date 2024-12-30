"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { Seat } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [ownedTickets, setOwnedTickets] = useState<Seat[]>();
  const [listingTickets, setListingTickets] = useState<Seat[]>();

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
        setListingTickets(data.listedTicket);

        console.log("Account registered successfully.");
        console.log(data);
      }
    };

    if (!wallet.provider || !wallet.account) router.push("/");
    else fetchProfileTickets();
  }, [router, wallet]);

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">My Tickets</h2>
      {ownedTickets && ownedTickets.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full justify-items-center gap-4">
          {ownedTickets.map((ticket, index) => (
            <Link
              key={index}
              href={`/event/${ticket.event?.id}`}
              passHref
              className="relative w-full"
            >
              <Card className="flex flex-col shadow-md">
                <CardHeader className="relative min-h-96">
                  <Image
                    src={ticket.event?.imagePoster as string}
                    alt={ticket.event?.title as string}
                    className="object-cover rounded-xl"
                    fill
                  />
                </CardHeader>
                <CardContent className="flex flex-col py-4 gap-2">
                  <p className="text-xl font-bold text-justify">
                    {ticket.event?.title}
                  </p>
                  <p className="text-sm">ID: {ticket.id}</p>
                  <p className="text-sm">
                    Event Date:{" "}
                    {Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(ticket.event?.dateEvent)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>You dont have any tickets!</p>
      )}

      <h2 className="font-bold text-xl mt-8">My Listings</h2>
      {listingTickets && listingTickets.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full justify-items-center gap-4">
          {listingTickets.map((ticket, index) => (
            <Link
              key={index}
              href={`/event/${ticket.event?.id}`}
              passHref
              className="relative w-full"
            >
              <Card className="flex flex-col shadow-md">
                <CardHeader className="relative min-h-96">
                  <Image
                    src={ticket.event?.imagePoster as string}
                    alt={ticket.event?.title as string}
                    className="object-cover rounded-xl"
                    fill
                  />
                </CardHeader>
                <CardContent className="flex flex-col py-4 gap-2">
                  <p className="text-xl font-bold text-justify">
                    {ticket.event?.title}
                  </p>
                  <p className="text-sm">ID: {ticket.id}</p>
                  <p className="text-sm">
                    Event Date:{" "}
                    {ticket.event?.dateEvent
                      ? Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(ticket.event.dateEvent))
                      : "Date not available"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>You dont have any tickets!</p>
      )}
    </div>
  );
};

export default ProfilePage;

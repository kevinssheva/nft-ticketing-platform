"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useWallet } from "@/contexts/WalletContext";

const CreateEventForm = () => {
  const wallet = useWallet();

  const validateFile = (file: FileList) => {
    if (file.length !== 1) {
      return false;
    }
    if (file[0].type !== "image/png" && file[0].type !== "image/jpg") {
      return false;
    }
    return true;
  };

  const formSchema = z.object({
    eventName: z
      .string({
        message: "Please specify the event name.",
      })
      .trim()
      .min(4, { message: "Event name too short." }),
    eventDetail: z.coerce
      .string({
        message: "Please describe the event.",
      })
      .trim()
      .min(4, { message: "Event detail too short." }),
    eventDate: z.coerce.date({
      message: "Please specify the event start time.",
    }),
    sellDate: z.coerce.date({
      message: "Please specify when the tickets can be purchased.",
    }),
    venue: z.coerce
      .string({
        message: "Please specify where the event will be held.",
      })
      .trim()
      .min(4, { message: "Venue name too short." })
      .max(4000),
    purchaseLimit: z.coerce
      .number({
        message: "Please specify the individual purchase limit.",
      })
      .positive({ message: "Purchase limit must be a positive number." }),
    tickets: z
      .array(
        z.object({
          zone: z
            .string({
              message: "Please specify the zone name.",
            })
            .min(1, { message: "The zone name must not be empty" })
            .max(10, {
              message: "The zone name must be under 10 characters long",
            }),
          row: z.coerce
            .number({
              message: "Please specify the amount of row.",
            })
            .positive({
              message: "Number of row must be a positive number.",
            }),
          seat: z.coerce
            .number({
              message: "Please specify the amount of seat.",
            })
            .positive({
              message: "Number of seat must be a positive number.",
            }),
          price: z.coerce
            .number({
              message: "Please specify the seat price.",
            })
            .positive({
              message: "Seat price must be a positive number.",
            }),
        })
      )
      .min(1, { message: "Please add at least one zone." }),
    posterImage: z
      .instanceof(FileList, { message: "Please upload a valid file." })
      .refine((file: FileList | null) => file !== null, {
        message: "Please upload a valid file.",
      })
      .refine(validateFile, { message: "Invalid file format." }),
    seatImage: z
      .instanceof(FileList, { message: "Please upload a valid file." })
      .refine((file: FileList | null) => file !== null, {
        message: "Please upload a valid file.",
      })
      .refine(validateFile, { message: "Invalid file format." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDetail: "",
      eventDate: new Date(),
      sellDate: new Date(),
      venue: "",
      purchaseLimit: 0,
      tickets: [{ zone: "", row: 0, seat: 0, price: 0 }],
      posterImage: undefined,
      seatImage: undefined,
    },
  });

  const eventDateRef = form.register("eventDate");
  const sellDateRef = form.register("sellDate");
  const posterImageRef = form.register("posterImage");
  const seatImageRef = form.register("seatImage");

  const { fields, append, remove } = useFieldArray({
    name: "tickets",
    control: form.control,
  });

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const posterImageBase64 = await convertFileToBase64(values.posterImage[0]);
    const seatImageBase64 = await convertFileToBase64(values.seatImage[0]);

    const requestData = {
      ...values,
      owner: wallet.address,
      posterImage: posterImageBase64,
      seatImage: seatImageBase64,
    };

    console.log(wallet.address);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Event created succesfully");
      } else {
        alert("Error creating event");
      }
    } catch (error) {
      console.error("Unknown error occured:", error);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            {/* Event Name Field */}
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Name" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Enter the event name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Venue Field */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Venue" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter where the event will be held.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Description Field */}
            <FormField
              control={form.control}
              name="eventDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event here"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the event description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Date Field */}
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event Date"
                        type="datetime-local"
                        {...eventDateRef}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the event start time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sell Date Field */}
              <FormField
                control={form.control}
                name="sellDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sell Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sell Date"
                        type="datetime-local"
                        {...sellDateRef}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter when the tickets can be purchased.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Purchase Limit Field */}
            <FormField
              control={form.control}
              name="purchaseLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the individual purchase limit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            {/* Tickets Section */}
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_auto] gap-4">
                    {/* Zone Field */}
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.zone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Zone" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the zone name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Row Field */}
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.row`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Row</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Row" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the amount of row in this zone.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove Button */}
                    {fields.length !== 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                        className="self-start mb-4"
                      >
                        <Trash2 />
                      </Button>
                    )}

                    {/* Seat Field */}
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.seat`}
                      render={({ field }) => (
                        <FormItem className=" col-start-1">
                          <FormLabel>Seats</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Seats"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the number of seats in each row.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Field */}
                    <FormField
                      control={form.control}
                      name={`tickets.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Price"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the price of a single ticket.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index !== fields.length - 1 && (
                    <div className="border-t border-gray-300 my-4" />
                  )}
                </div>
              ))}
            </div>

            {/* Append Button */}
            <Button
              type="button"
              onClick={() =>
                append({
                  zone: "",
                  row: 0,
                  seat: 0,
                  price: 0,
                })
              }
              className="mt-4"
            >
              Add Zoning
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-300 my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Poster Image Field */}
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="posterImage"
              render={() => (
                <FormItem>
                  <FormLabel>Poster Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg"
                      {...posterImageRef}
                    />
                  </FormControl>
                  <FormDescription>
                    Please upload the event poster image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col">
            {/* Seat Image Field */}
            <FormField
              control={form.control}
              name="seatImage"
              render={() => (
                <FormItem>
                  <FormLabel>Seat Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg"
                      {...seatImageRef}
                    />
                  </FormControl>
                  <FormDescription>
                    Please upload the event seating image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Create Event</Button>
      </form>
    </FormProvider>
  );
};

export default CreateEventForm;

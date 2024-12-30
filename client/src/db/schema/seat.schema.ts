import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { Event, account, event } from ".";
import { InferSelectModel, relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const seat = pgTable("seat", {
  id: text("id").primaryKey().$defaultFn(createId),
  eventId: text("event_id")
    .notNull()
    .references(() => event.id),
  price: text("gas").notNull(),
  transactionHash: text("transaction_hash"),
  seatRow: text("seat_row").notNull(),
  zone: text("zone").notNull(),
  creatorAddress: text("creator_id")
    .notNull()
    .references(() => account.address),
  ownerAddress: text("owner_id").references(() => account.address),
  is_selling: boolean("is_selling"),
});

export const seatRelation = relations(seat, ({ one }) => ({
  event: one(event, {
    fields: [seat.eventId],
    references: [event.id],
  }),
  creator: one(account, {
    fields: [seat.creatorAddress],
    references: [account.address],
    relationName: "creator",
  }),
  owner: one(account, {
    fields: [seat.ownerAddress],
    references: [account.address],
    relationName: "owned_ticket",
  }),
}));

export type Seat = InferSelectModel<typeof seat> & { event?: Event };

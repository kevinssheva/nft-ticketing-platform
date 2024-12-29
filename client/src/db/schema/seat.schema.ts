import { pgTable, text } from "drizzle-orm/pg-core";
import { account, event } from ".";
import { relations } from "drizzle-orm";

export const seat = pgTable("seat", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => event.id),
  gas: text("gas").notNull(),
  price: text("gas").notNull(),
  transactionHash: text("transaction_hash"),
  seatId: text("seat_id").notNull(),
  seatRow: text("seat_row").notNull(),
  zone: text("zone").notNull(),
  creatorAddress: text("creator_id")
    .notNull()
    .references(() => account.address),
  ownerAddress: text("owner_id")
    .notNull()
    .references(() => account.address),
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

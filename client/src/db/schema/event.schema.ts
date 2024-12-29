import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "../utils";
import { account } from "./account.schema";
import { relations } from "drizzle-orm";
import { seat } from ".";

export const event = pgTable("event", {
  id: text("id").primaryKey().$defaultFn(createId),
  creatorAddress: text("creator_address")
    .notNull()
    .references(() => account.address),
  dateEvent: timestamp("date_event").notNull(),
  dateSell: timestamp("date_sell").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),

  imagePoster: text("image_poster").notNull(),
  imageSeats: text("image_seats").notNull(),

  venue: text("venue").notNull(),
  purchaseLimit: integer("purchase_limit").notNull(),
});

export const eventRelation = relations(event, ({ one, many }) => ({
  creator: one(account, {
    fields: [event.creatorAddress],
    references: [account.address],
  }),
  ticket: many(seat),
}));

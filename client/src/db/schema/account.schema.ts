import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { event } from ".";

export const account = pgTable("account", {
  address: text("address").primaryKey(),
  username: text("username").notNull(),
  fullName: text("full_name").notNull(),
  idCard: text("id_card").notNull(),
});

export const accountRelation = relations(account, ({ many }) => ({
  event: many(event),
}));

export type Account = InferSelectModel<typeof account>;

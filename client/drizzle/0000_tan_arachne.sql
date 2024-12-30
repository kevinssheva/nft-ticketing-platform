CREATE TABLE "account" (
	"address" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"full_name" text NOT NULL,
	"id_card" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_address" text NOT NULL,
	"date_event" timestamp NOT NULL,
	"date_sell" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_poster" text NOT NULL,
	"image_seats" text NOT NULL,
	"venue" text NOT NULL,
	"purchase_limit" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"gas" text NOT NULL,
	"transaction_hash" text,
	"seat_row" text NOT NULL,
	"zone" text NOT NULL,
	"creator_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"is_selling" boolean
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_creator_address_account_address_fk" FOREIGN KEY ("creator_address") REFERENCES "public"."account"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat" ADD CONSTRAINT "seat_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat" ADD CONSTRAINT "seat_creator_id_account_address_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."account"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat" ADD CONSTRAINT "seat_owner_id_account_address_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("address") ON DELETE no action ON UPDATE no action;
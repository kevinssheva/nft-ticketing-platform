-- Add is_selling to the seat table --
ALTER TABLE "seat" ADD COLUMN "price" TEXT NOT NULL;
ALTER TABLE "seat" ADD COLUMN "is_selling" boolean DEFAULT TRUE;
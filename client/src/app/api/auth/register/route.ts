import { db } from "@/db/drizzle";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Please enter a longer username.",
    })
    .nonempty({ message: "Please enter a username." }),
  fullName: z.string().nonempty({
    message: "Please enter your full name.",
  }),
  idCard: z.instanceof(File).refine((file) => file?.size > 0, {
    message: "Please upload your ID card.",
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { address, username, fullName, idCard } = body;

  if (!address || !username || !fullName || !idCard) {
    return NextResponse.json(
      { error: "Address, username, full name and ID card are required." },
      { status: 400 }
    );
  }

  try {
    const existingUser = await db
      .select()
      .from(account)
      .where(eq(account.address, address))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const newUser = db
      .insert(account)
      .values({ address, username, fullName, idCard: "" }) // TODO: INI NANTI MINTA URL LINK!
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

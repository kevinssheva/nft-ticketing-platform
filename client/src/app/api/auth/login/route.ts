import { account } from "@/db/schema";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UserRequestSchema = z.object({
  address: z.string().nonempty("Address is required."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validation = UserRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    const { address } = validation.data;

    console.log(address);

    const user = await db
      .select()
      .from(account)
      .where(eq(account.address, address))
      .limit(1);

    if (user.length == 0)
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

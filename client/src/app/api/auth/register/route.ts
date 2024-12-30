import { db } from "@/db/drizzle";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    console.log(existingUser);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const newUser = await db
      .insert(account)
      .values({ address, username, fullName, idCard })
      .returning();

    console.log(newUser);

    const plainNewUser = newUser.map((user) => ({
      address: user.address,
      username: user.username,
      fullName: user.fullName,
      idCard: user.idCard,
    }));

    return NextResponse.json(plainNewUser, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

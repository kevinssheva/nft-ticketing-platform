import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_PORT: z.coerce.number().default(5000),
  NEXT_PUBLIC_DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_PINATA_JWT: z.string(),
  NEXT_PUBLIC_PINATA_GATEWAY_URL: z.string(),
});

const result = EnvSchema.safeParse(process.env);

console.log(result.success);

if (!result.success) {
  console.error("Invalid environment variables: ");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;

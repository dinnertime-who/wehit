import {
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  plugins: [organizationClient(), inferAdditionalFields<typeof auth>()],
});

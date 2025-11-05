import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { auth } from "../auth/auth";

export const buildAbility = (user: (typeof auth.$Infer.Session)["user"]) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  return build();
};

import { parseAsString, useQueryState } from "nuqs";

export const useQState = () => {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );
  return { q, setQ };
};

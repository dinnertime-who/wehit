import { cn } from "@/lib/utils";
import { useFormContext } from "../app-form";

type Props = React.ComponentProps<"fieldset">;

export const Fieldset = ({ className, ...props }: Props) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <fieldset
          className={cn("grid gap-3 mb-3", className)}
          {...props}
          disabled={isSubmitting}
        />
      )}
    </form.Subscribe>
  );
};

"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../app-form";

type Props = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange" | "id"
> & {
  label?: string;
};

export const CheckboxField = ({ className, ...props }: Props) => {
  const id = useId();
  const field = useFieldContext<boolean>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 text-start data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      <Checkbox
        id={id}
        checked={field.state.value}
        onCheckedChange={(checked) =>
          field.handleChange(checked === true)
        }
        {...props}
        aria-invalid={isInvalid}
      />
      {props.label && (
        <Label
          htmlFor={id}
          className="text-sm font-normal cursor-pointer"
        >
          {props.label}
        </Label>
      )}

      {isInvalid && (
        <ul className="text-xs">
          {field.state.meta.errors
            .map((error) => error?.message)
            .map((error) => (
              <li key={error}>{error}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

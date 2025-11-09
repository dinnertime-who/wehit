"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../app-form";

type Props = Omit<
  React.ComponentProps<"input">,
  "value" | "onBlur" | "onChange" | "id" | "type"
> & {
  label?: string;
};

export const NumberField = ({ className, ...props }: Props) => {
  const id = useId();
  const field = useFieldContext<number>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  return (
    <div
      className={cn(
        "group grid w-full gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <Input
        type="number"
        className="text-sm"
        id={id}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        {...props}
        aria-invalid={isInvalid}
      />

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

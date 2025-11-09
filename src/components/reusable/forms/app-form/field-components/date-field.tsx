"use client";

import { useId } from "react";
import { format } from "date-fns";
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

export const DateField = ({ className, ...props }: Props) => {
  const id = useId();
  const field = useFieldContext<Date | null>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    if (!dateString) {
      field.handleChange(null);
      return;
    }
    // HTML5 date input은 YYYY-MM-DD 형식
    const date = new Date(dateString);
    field.handleChange(date);
  };

  const displayValue = field.state.value
    ? format(field.state.value, "yyyy-MM-dd")
    : "";

  return (
    <div
      className={cn(
        "group grid w-full text-start gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <Input
        type="date"
        className="text-sm"
        id={id}
        value={displayValue}
        onBlur={field.handleBlur}
        onChange={handleChange}
        {...props}
        aria-invalid={isInvalid}
      />

      {isInvalid && (
        <ul className="text-xs space-y-1">
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

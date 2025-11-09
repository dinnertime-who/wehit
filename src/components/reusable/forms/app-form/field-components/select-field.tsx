"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../app-form";

type Props = {
  className?: string;
  label?: string;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  disabled?: boolean;
};

export const SelectField = ({
  className,
  label,
  placeholder,
  options,
  disabled,
}: Props) => {
  const id = useId();
  const field = useFieldContext<string>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  return (
    <div
      className={cn(
        "group grid w-full text-start gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        value={field.state.value || ""}
        onValueChange={field.handleChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

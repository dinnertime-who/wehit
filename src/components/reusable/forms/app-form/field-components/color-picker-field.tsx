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
  defaultValue?: string;
};

export const ColorPickerField = ({
  className,
  defaultValue = "#ffffff",
  ...props
}: Props) => {
  const id = useId();
  const field = useFieldContext<string>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  const colorValue = field.state.value || defaultValue;

  return (
    <div
      className={cn(
        "group grid w-full text-start gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <div className="flex items-center gap-2">
        <Input
          type="color"
          className="h-10 w-20 cursor-pointer"
          id={id}
          value={colorValue}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
          aria-invalid={isInvalid}
        />
        <Input
          type="text"
          className="text-sm flex-1"
          value={colorValue}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const value = e.target.value;
            // hex color 형식 검증 (선택적)
            if (value === "" || /^#[0-9A-Fa-f]{6}$/.test(value)) {
              field.handleChange(value || defaultValue);
            }
          }}
          placeholder="#ffffff"
          aria-invalid={isInvalid}
        />
      </div>

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


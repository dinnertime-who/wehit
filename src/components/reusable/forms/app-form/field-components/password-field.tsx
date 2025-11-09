"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../app-form";

type Props = Omit<
  React.ComponentProps<"input">,
  "value" | "onBlur" | "onChange" | "id" | "type"
> & {
  label?: string;
};

export const PasswordField = ({ className, ...props }: Props) => {
  const id = useId();
  const field = useFieldContext<string>();
  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={cn(
        "group grid w-full text-start gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <InputGroup aria-invalid={isInvalid}>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          className="text-sm"
          id={id}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
          aria-invalid={isInvalid}
        />
        <InputGroupAddon
          align="inline-end"
          className="group cursor-pointer group-data-[invalid=true]:text-destructive"
          onClick={() => setShowPassword(!showPassword)}
          data-show-password={showPassword}
        >
          <EyeOff className="group-data-[show-password=false]:hidden" />
          <Eye className="group-data-[show-password=true]:hidden" />
        </InputGroupAddon>
      </InputGroup>

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

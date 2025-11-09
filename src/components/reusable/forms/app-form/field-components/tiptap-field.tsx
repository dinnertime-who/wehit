"use client";

import { Label } from "@/components/ui/label";
import { TiptapEditor } from "./tiptap-editor";
import { useFieldContext } from "../app-form";

type Props = {
  label?: string;
  required?: boolean;
};

export const TiptapField = ({ label, required = false }: Props) => {
  const { state, handleChange } = useFieldContext<string>();

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <TiptapEditor
        value={state.value || ""}
        onChange={(html) => handleChange(html)}
        placeholder="내용을 입력해주세요..."
      />
    </div>
  );
};

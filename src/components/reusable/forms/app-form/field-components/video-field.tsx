"use client";

import { useId, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../app-form";
import { Upload, X } from "lucide-react";

type Props = Omit<
  React.ComponentProps<"input">,
  "value" | "onBlur" | "onChange" | "id" | "type"
> & {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
};

export const VideoField = ({
  className,
  accept = "video/mp4,video/webm,video/quicktime",
  maxSizeMB = 100,
  ...props
}: Props) => {
  const id = useId();
  const field = useFieldContext<File | null>();
  const [preview, setPreview] = useState<string | null>(null);

  const isInvalid =
    field.state.meta.isTouched &&
    field.state.meta.isBlurred &&
    field.state.meta.isValid === false &&
    field.state.meta.isValidating === false;

  // 프리뷰 생성
  useEffect(() => {
    if (field.state.value) {
      const url = URL.createObjectURL(field.state.value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [field.state.value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      field.handleChange(null);
      return;
    }

    // 파일 크기 검증
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      field.handleChange(null);
      e.target.value = "";
      return;
    }

    field.handleChange(file);
  };

  const handleRemoveVideo = () => {
    field.handleChange(null);
  };

  return (
    <div
      className={cn(
        "group grid w-full text-start gap-2 data-[invalid=true]:text-destructive",
        className,
      )}
      data-invalid={isInvalid}
    >
      {props.label && <Label htmlFor={id}>{props.label}</Label>}

      {preview ? (
        // 영상 선택 후
        <div className="space-y-3">
          <div className="relative w-full max-w-md rounded-lg border border-input overflow-hidden bg-black">
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-80"
            />
          </div>
          <div className="flex gap-2">
            <Label
              htmlFor={id}
              className="px-3 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              다시 선택
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveVideo}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              제거
            </Button>
          </div>
        </div>
      ) : (
        // 영상 선택 전
        <Label
          htmlFor={id}
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-input rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">영상을 선택해주세요</p>
            <p className="text-xs text-muted-foreground">
              {accept
                .split(",")
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}{" "}
              • 최대 {maxSizeMB}MB
            </p>
          </div>
        </Label>
      )}

      <Input
        type="file"
        id={id}
        accept={accept}
        onChange={handleFileChange}
        onBlur={field.handleBlur}
        className="hidden"
        aria-invalid={isInvalid}
        {...props}
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

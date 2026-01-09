"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type TiptapEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export const TiptapEditor = ({
  value,
  onChange,
  placeholder = "내용을 입력해주세요...",
}: TiptapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
    ],
    content: value || `<p>${placeholder}</p>`,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const data = await response.json();
      editor?.commands.setImage({ src: data.imageUrl });
      toast.success("이미지가 삽입되었습니다");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "이미지 업로드 실패",
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* 툴바 */}
      <div className="border-b bg-muted p-2 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.commands.toggleBold()}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "bg-accent" : ""}
        >
          B
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.commands.toggleItalic()}
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "bg-accent" : ""}
        >
          I
        </Button>
        <div className="w-px bg-border" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.commands.toggleHeading({ level: 2 })}
          className={
            editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""
          }
        >
          H2
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.commands.toggleBulletList()}
          className={editor?.isActive("bulletList") ? "bg-accent" : ""}
        >
          • 목록
        </Button>
        <div className="w-px bg-border" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-4 h-4" />
          이미지
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* 에디터 */}
      <div className="p-4 min-h-80 h-[60vh] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

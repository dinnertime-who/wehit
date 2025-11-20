import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { publicEnv } from "@/config/env/public";
import { serverEnv } from "@/config/env/server";
import { s3 } from "@/infrastructure/storage";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // 파일 검증
    if (!file) {
      return NextResponse.json(
        { error: "파일을 선택해주세요" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 100MB 이하여야 합니다" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "JPEG, PNG, WEBP 또는 MP4, WEBM 형식만 지원됩니다" },
        { status: 400 },
      );
    }

    // 파일명 생성
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${timestamp}-${originalName}`;

    // S3 업로드
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(
      new PutObjectCommand({
        Bucket: serverEnv.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    // 업로드된 파일 URL 반환
    const fileUrl = `${publicEnv.NEXT_PUBLIC_IMAGE_HOST}/${key}`;

    return NextResponse.json({ imageUrl: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "파일 업로드 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

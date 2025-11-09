import { useMutation } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export interface UploadVideoResponse {
  videoUrl: string;
}

export const useUploadVideo = () => {
  return useMutation<UploadVideoResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await kyClient
        .post("upload", { body: formData })
        .json<{ imageUrl: string }>();

      return { videoUrl: response.imageUrl };
    },
  });
};

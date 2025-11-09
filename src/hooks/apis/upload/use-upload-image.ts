import { useMutation } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export interface UploadImageResponse {
  imageUrl: string;
}

export const useUploadImage = () => {
  return useMutation<UploadImageResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      return kyClient
        .post("upload", { body: formData })
        .json<UploadImageResponse>();
    },
  });
};

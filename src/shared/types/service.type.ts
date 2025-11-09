export type Service = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  tutorInfo: string;
  coverImageUrl: string;
  coverVideoUrl: string | null;
  description: string; // HTML content from Tiptap
  price: number;
  salePrice: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateServiceDTO = {
  title: string;
  subtitle?: string;
  category: string;
  tutorInfo: string;
  coverImageUrl: string;
  coverVideoUrl?: string;
  description: string;
  price: number;
  salePrice?: number;
};

export type UpdateServiceDTO = Partial<CreateServiceDTO>;

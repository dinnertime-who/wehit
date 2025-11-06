import type {
  Banner,
  BannerItem,
  BannerWithItems,
  CreateBannerInput,
  CreateBannerItemInput,
  UpdateBannerInput,
  UpdateBannerItemInput,
} from "@/shared/types/banner.type";

export interface IBannerRepository {
  // Banner CRUD
  createBanner(data: CreateBannerInput): Promise<Banner>;
  getBanner(id: string): Promise<Banner | null>;
  getBannerBySlug(slug: string): Promise<Banner | null>;
  getAllBanners(): Promise<Banner[]>;
  updateBanner(id: string, data: UpdateBannerInput): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;

  // Banner Item CRUD
  createBannerItem(data: CreateBannerItemInput): Promise<BannerItem>;
  getBannerItem(id: string): Promise<BannerItem | null>;
  getBannerItems(bannerId: string): Promise<BannerItem[]>;
  updateBannerItem(
    id: string,
    data: UpdateBannerItemInput,
  ): Promise<BannerItem>;
  deleteBannerItem(id: string): Promise<void>;
}

export interface IBannerService {
  // Banner operations
  createBanner(data: CreateBannerInput): Promise<Banner>;
  getBanner(id: string): Promise<Banner | null>;
  getBannerBySlug(slug: string): Promise<Banner | null>;
  getAllBanners(): Promise<Banner[]>;
  updateBanner(id: string, data: UpdateBannerInput): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;

  // Banner with items
  getBannerWithItems(slug: string): Promise<BannerWithItems | null>;
  getActiveBannerItems(bannerId: string): Promise<BannerItem[]>;

  // Banner item operations
  createBannerItem(data: CreateBannerItemInput): Promise<BannerItem>;
  getBannerItem(id: string): Promise<BannerItem | null>;
  updateBannerItem(
    id: string,
    data: UpdateBannerItemInput,
  ): Promise<BannerItem>;
  deleteBannerItem(id: string): Promise<void>;
}

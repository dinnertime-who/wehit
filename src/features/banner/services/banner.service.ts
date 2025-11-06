import "server-only";

import type {
  Banner,
  BannerItem,
  BannerWithItems,
  CreateBannerInput,
  CreateBannerItemInput,
  UpdateBannerInput,
  UpdateBannerItemInput,
} from "@/shared/types/banner.type";
import type {
  IBannerRepository,
  IBannerService,
} from "../interfaces/banner.interface";
import { BannerRepository } from "../repositories/banner.repository";

export class BannerService implements IBannerService {
  private repository: IBannerRepository;

  constructor(repository?: IBannerRepository) {
    this.repository = repository ?? new BannerRepository();
  }

  async createBanner(data: CreateBannerInput): Promise<Banner> {
    return this.repository.createBanner(data);
  }

  async getBanner(id: string): Promise<Banner | null> {
    return this.repository.getBanner(id);
  }

  async getBannerBySlug(slug: string): Promise<Banner | null> {
    return this.repository.getBannerBySlug(slug);
  }

  async getAllBanners(): Promise<Banner[]> {
    return this.repository.getAllBanners();
  }

  async updateBanner(id: string, data: UpdateBannerInput): Promise<Banner> {
    return this.repository.updateBanner(id, data);
  }

  async deleteBanner(id: string): Promise<void> {
    return this.repository.deleteBanner(id);
  }

  async getBannerWithItems(slug: string): Promise<BannerWithItems | null> {
    const bannerData = await this.repository.getBannerBySlug(slug);
    if (!bannerData) return null;

    const items = await this.repository.getBannerItems(bannerData.id);
    return {
      ...bannerData,
      items,
    };
  }

  async getActiveBannerItems(bannerId: string): Promise<BannerItem[]> {
    const items = await this.repository.getBannerItems(bannerId);
    const now = new Date();

    return items.filter((item) => {
      const isAfterStart = !item.viewStartDate || item.viewStartDate <= now;
      const isBeforeEnd = !item.viewEndDate || item.viewEndDate >= now;
      return isAfterStart && isBeforeEnd;
    });
  }

  async createBannerItem(data: CreateBannerItemInput): Promise<BannerItem> {
    return this.repository.createBannerItem(data);
  }

  async getBannerItem(id: string): Promise<BannerItem | null> {
    return this.repository.getBannerItem(id);
  }

  async updateBannerItem(
    id: string,
    data: UpdateBannerItemInput,
  ): Promise<BannerItem> {
    return this.repository.updateBannerItem(id, data);
  }

  async deleteBannerItem(id: string): Promise<void> {
    return this.repository.deleteBannerItem(id);
  }
}

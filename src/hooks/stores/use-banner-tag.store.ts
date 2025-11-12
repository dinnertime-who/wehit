import { create } from "zustand";

type BannerTagState = {
  bannerTag: string | null;
  setBannerTag: (bannerTag: string | null) => void;
};

export const useBannerTagStore = create<BannerTagState>((set) => ({
  bannerTag: null,
  setBannerTag: (bannerTag) => set({ bannerTag }),
}));

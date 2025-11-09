"use client";

import { createContext, useContext } from "react";

const BannerIdContext = createContext<string | null>(null);

export const useBannerId = () => {
  const context = useContext(BannerIdContext);
  if (!context) {
    throw new Error("useBannerId must be used within a BannerIdProvider");
  }
  return context;
};

export const BannerIdProvider = ({
  children,
  bannerId,
}: {
  children: React.ReactNode;
  bannerId: string;
}) => {
  return (
    <BannerIdContext.Provider value={bannerId}>
      {children}
    </BannerIdContext.Provider>
  );
};

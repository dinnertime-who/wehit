"use client";

import { createContext, useContext } from "react";

type ServiceIdContextType = string;

const ServiceIdContext = createContext<ServiceIdContextType | null>(null);

type Props = {
  serviceId: string;
  children: React.ReactNode;
};

export const ServiceIdProvider = ({ serviceId, children }: Props) => {
  return (
    <ServiceIdContext.Provider value={serviceId}>
      {children}
    </ServiceIdContext.Provider>
  );
};

export const useServiceId = () => {
  const context = useContext(ServiceIdContext);
  if (context === null) {
    throw new Error("useServiceId must be used within ServiceIdProvider");
  }
  return context;
};

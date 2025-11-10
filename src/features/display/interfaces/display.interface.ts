import type {
  Display,
  DisplayServiceRecord,
  DisplayWithServices,
  DisplayWithServiceDetails,
  CreateDisplayInput,
  UpdateDisplayInput,
  AddServiceToDisplayInput,
} from "@/shared/types/display.type";

export interface IDisplayRepository {
  // Display CRUD
  createDisplay(data: CreateDisplayInput): Promise<Display>;
  getDisplay(id: string): Promise<Display | null>;
  getDisplayBySlug(slug: string): Promise<Display | null>;
  getAllDisplays(): Promise<Display[]>;
  updateDisplay(id: string, data: UpdateDisplayInput): Promise<Display>;
  deleteDisplay(id: string): Promise<void>;

  // Display-Service relationship
  addServiceToDisplay(data: AddServiceToDisplayInput): Promise<DisplayServiceRecord>;
  getDisplayServices(displayId: string): Promise<DisplayServiceRecord[]>;
  removeServiceFromDisplay(displayId: string, serviceId: string): Promise<void>;
  getDisplayServiceByOrder(
    displayId: string,
    order: number,
  ): Promise<DisplayServiceRecord | null>;
  getDisplayWithServiceDetailsBySlug(
    slug: string,
  ): Promise<DisplayWithServiceDetails | null>;
}

export interface IDisplayService {
  // Display CRUD
  createDisplay(data: CreateDisplayInput): Promise<Display>;
  getDisplay(id: string): Promise<Display | null>;
  getDisplayBySlug(slug: string): Promise<Display | null>;
  getAllDisplays(): Promise<Display[]>;
  updateDisplay(id: string, data: UpdateDisplayInput): Promise<Display>;
  deleteDisplay(id: string): Promise<void>;

  // Display with services
  getDisplayWithServices(displayId: string): Promise<DisplayWithServices | null>;
  getDisplayWithServiceDetailsBySlug(
    slug: string,
  ): Promise<DisplayWithServiceDetails | null>;

  // Display-Service operations
  addServiceToDisplay(data: AddServiceToDisplayInput): Promise<DisplayServiceRecord>;
  removeServiceFromDisplay(displayId: string, serviceId: string): Promise<void>;
  getDisplayServices(displayId: string): Promise<DisplayServiceRecord[]>;
}

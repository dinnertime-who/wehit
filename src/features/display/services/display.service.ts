import "server-only";

import type {
  Display,
  DisplayServiceRecord,
  DisplayWithServices,
  DisplayWithServiceDetails,
  CreateDisplayInput,
  UpdateDisplayInput,
  AddServiceToDisplayInput,
} from "@/shared/types/display.type";
import type {
  IDisplayRepository,
  IDisplayService,
} from "../interfaces/display.interface";
import { DisplayRepository } from "../repositories/display.repository";

export class DisplayService implements IDisplayService {
  private repository: IDisplayRepository;

  constructor(repository?: IDisplayRepository) {
    this.repository = repository ?? new DisplayRepository();
  }

  async createDisplay(data: CreateDisplayInput): Promise<Display> {
    return this.repository.createDisplay(data);
  }

  async getDisplay(id: string): Promise<Display | null> {
    return this.repository.getDisplay(id);
  }

  async getDisplayBySlug(slug: string): Promise<Display | null> {
    return this.repository.getDisplayBySlug(slug);
  }

  async getAllDisplays(): Promise<Display[]> {
    return this.repository.getAllDisplays();
  }

  async updateDisplay(
    id: string,
    data: UpdateDisplayInput,
  ): Promise<Display> {
    return this.repository.updateDisplay(id, data);
  }

  async deleteDisplay(id: string): Promise<void> {
    return this.repository.deleteDisplay(id);
  }

  async getDisplayWithServices(
    displayId: string,
  ): Promise<DisplayWithServices | null> {
    const displayData = await this.repository.getDisplay(displayId);
    if (!displayData) return null;

    const services = await this.repository.getDisplayServices(displayId);
    return {
      ...displayData,
      services,
    };
  }

  async addServiceToDisplay(
    data: AddServiceToDisplayInput,
  ): Promise<DisplayServiceRecord> {
    return this.repository.addServiceToDisplay(data);
  }

  async removeServiceFromDisplay(
    displayId: string,
    serviceId: string,
  ): Promise<void> {
    return this.repository.removeServiceFromDisplay(displayId, serviceId);
  }

  async getDisplayServices(displayId: string): Promise<DisplayServiceRecord[]> {
    return this.repository.getDisplayServices(displayId);
  }

  async getDisplayWithServiceDetailsBySlug(
    slug: string,
  ): Promise<DisplayWithServiceDetails | null> {
    return this.repository.getDisplayWithServiceDetailsBySlug(slug);
  }
}

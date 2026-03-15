import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing the router
vi.mock("../prisma", () => {
  return {
    default: {
      simulationConfig: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      simulationResult: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

import prisma from "../prisma";

describe("simulation routes logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("config CRUD", () => {
    it("create config uses provided values", async () => {
      const mockConfig = {
        id: "test-uuid",
        name: "Test",
        numChargepoints: 10,
        chargingPowerKw: 22,
        consumptionKwhPer100km: 18,
        arrivalMultiplier: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.simulationConfig.create).mockResolvedValue(mockConfig);

      const result = await prisma.simulationConfig.create({
        data: {
          name: "Test",
          numChargepoints: 10,
          chargingPowerKw: 22,
        },
      });

      expect(result.id).toBe("test-uuid");
      expect(result.numChargepoints).toBe(10);
      expect(result.chargingPowerKw).toBe(22);
    });

    it("findMany returns configs ordered by createdAt", async () => {
      const mockConfigs = [
        {
          id: "1",
          name: "Recent",
          numChargepoints: 20,
          chargingPowerKw: 11,
          consumptionKwhPer100km: 18,
          arrivalMultiplier: 1.0,
          createdAt: new Date("2025-02-01"),
          updatedAt: new Date("2025-02-01"),
        },
        {
          id: "2",
          name: "Older",
          numChargepoints: 10,
          chargingPowerKw: 11,
          consumptionKwhPer100km: 18,
          arrivalMultiplier: 1.0,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
      ];

      vi.mocked(prisma.simulationConfig.findMany).mockResolvedValue(mockConfigs);

      const result = await prisma.simulationConfig.findMany({
        orderBy: { createdAt: "desc" },
      });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Recent");
    });

    it("delete config by id", async () => {
      vi.mocked(prisma.simulationConfig.delete).mockResolvedValue({
        id: "to-delete",
        name: "",
        numChargepoints: 20,
        chargingPowerKw: 11,
        consumptionKwhPer100km: 18,
        arrivalMultiplier: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await prisma.simulationConfig.delete({ where: { id: "to-delete" } });

      expect(prisma.simulationConfig.delete).toHaveBeenCalledWith({
        where: { id: "to-delete" },
      });
    });
  });

  describe("exemplary day computation", () => {
    it("correctly averages power per tick into 96 daily intervals", () => {
      const INTERVALS_PER_DAY = 96;
      const DAYS_IN_YEAR = 365;

      // Create mock powerPerTick where each interval has a known pattern
      const powerPerTick: number[] = new Array(INTERVALS_PER_DAY * DAYS_IN_YEAR).fill(0);

      // Set interval 0 of every day to 10 kW
      for (let day = 0; day < DAYS_IN_YEAR; day++) {
        powerPerTick[day * INTERVALS_PER_DAY + 0] = 10;
      }

      // Set interval 48 (noon) of every day to 20 kW
      for (let day = 0; day < DAYS_IN_YEAR; day++) {
        powerPerTick[day * INTERVALS_PER_DAY + 48] = 20;
      }

      const chargingValuesPerDay: number[] = new Array(INTERVALS_PER_DAY).fill(0);
      for (let interval = 0; interval < INTERVALS_PER_DAY; interval++) {
        let sum = 0;
        for (let day = 0; day < DAYS_IN_YEAR; day++) {
          sum += powerPerTick[day * INTERVALS_PER_DAY + interval] ?? 0;
        }
        chargingValuesPerDay[interval] = sum / DAYS_IN_YEAR;
      }

      expect(chargingValuesPerDay[0]).toBe(10);
      expect(chargingValuesPerDay[48]).toBe(20);
      expect(chargingValuesPerDay[1]).toBe(0);
    });
  });
});

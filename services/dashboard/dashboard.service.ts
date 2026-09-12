import prisma from "@/db/prisma";

function todayUtc(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function daysAgoUtc(offset: number): Date {
  const d = todayUtc();
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

export class DashboardService {
  async getDailyNutrition(userId: string) {
    const record = await prisma.dailyNutrition.findUnique({
      where: { userId_loggedFor: { userId, loggedFor: todayUtc() } },
    });
    return record;
  }

  async getUpcomingGoals(userId: string) {
    return prisma.nutritionGoal.findMany({
      where: {
        userId,
        effectiveFrom: {
          gt: todayUtc(),
        },
      },
      orderBy: {
        effectiveFrom: "asc",
      },
    });
  }

  async getCurrentGoal(userId: string) {
    return prisma.nutritionGoal.findFirst({
      where: {
        userId,
        effectiveFrom: { lte: todayUtc() },
      },
      orderBy: { effectiveFrom: "desc" },
    });
  }

  async getTodaysMeals(userId: string) {
    const meals = await prisma.meal.findMany({
      where: { userId, loggedFor: todayUtc() },
      include: {
        entries: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { type: "asc" },
    });
    return meals;
  }

  async getWeeklyNutrition(userId: string) {
    const sevenDaysAgo = daysAgoUtc(6);
    console.log("sevendaysAgo", sevenDaysAgo);
    const records = await prisma.dailyNutrition.findMany({
      where: {
        userId,
        loggedFor: { gte: sevenDaysAgo },
      },
      orderBy: { loggedFor: "asc" },
    });
    return records;
  }
}

export const dashboardService = new DashboardService();

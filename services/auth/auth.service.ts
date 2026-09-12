import bcrypt from "bcryptjs";

import { Errors } from "@/lib/errors";
import type { LoginInput } from "@/schemas/auth";
import prisma from "@/db/prisma";

export class AuthService {
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw Errors.unauthorized("Invalid email or password.", "AUTH");
    }
    return { id: user.id, name: user.name, email: user.email };
  }
  async createSession(userId: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, expiresAt },
      select: { id: true, expiresAt: true },
    });
  }
  async getActiveSession(sessionId: string, userId: string) {
    return prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: { select: { goal: true, timezone: true } },
          },
        },
      },
    });
  }

  async revokeSession(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}

export const authService = new AuthService();

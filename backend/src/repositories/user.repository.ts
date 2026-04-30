import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "@/schema/userSchema";



export const userRepository = {
    findById: (id: string) =>
        prisma.user.findUnique({ where: { id } }),

    findByEmail: (email: string) =>
        prisma.user.findUnique({ where: { email } }),

    findByNickname: (nickname: string) =>
        prisma.user.findUnique({ where: { nickname } }),

    create: (data: CreateUserInput) =>
        prisma.user.create({ data }),

    searchByQuery: (query: string, currentUserId: string) =>
        prisma.user.findMany({
            where: {
                OR: [
                    { nickname: { contains: query } },
                    { email: { contains: query } },
                ],
                NOT: { id: currentUserId },
            },
            take: 10,
            select: {
                id: true,
                nickname: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
            }
        }),


    searchUserByEmailorNickname: (email: string, nickname: string) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { nickname },
                    { email },
                ],
            },
        });
    },

    update: (id: string, data: Record<string, unknown>) => {
        return prisma.user.update({ where: { id }, data });
    },

    findByResetToken: (token: string) => {
        return prisma.user.findFirst({ where: { resetToken: token } });
    }

};

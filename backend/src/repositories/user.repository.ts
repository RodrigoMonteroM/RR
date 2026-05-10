import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "@/schema/userSchema";
import { Prisma } from "@prisma/client";

export const userRepository = {
    findById: function(id: string) {
        return prisma.user.findUnique({ where: { id } });
    },

    findByEmail: function(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    findByNickname: function(nickname: string) {
        return prisma.user.findUnique({ where: { nickname } });
    },

    create: function(data: CreateUserInput) {
        return prisma.user.create({ data });
    },

    searchByQuery: function(query: string, currentUserId: string) {
        return prisma.user.findMany({
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
            },
        });
    },

    searchUserByEmailOrNickname: function(email: string, nickname: string) {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { nickname },
                    { email },
                ],
            },
        });
    },

    update: function(id: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({ where: { id }, data });
    },

    findByResetToken: function(token: string) {
        return prisma.user.findFirst({ where: { resetToken: token } });
    },

    getCoupleIdByUserId: async function (id: string) {
        const user = await prisma.user.findUnique({
            where: {id},
            select: {coupleId: true},
        });
        return user?.coupleId ?? null;
    }
};

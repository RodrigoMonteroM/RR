import { prisma } from "@/lib/prisma";
import { CreateBoxInput, UpdateBoxInput } from "@/schema/boxSchema";

export const boxRepository = {
    findById: function(id: string) {
        return prisma.box.findUnique({
            where: { id },
            include: { items: { include: { createdBy: { select: { id: true, nickname: true } } } } },
        });
    },

    findByUserId: function(userId: string) {
        return prisma.box.findMany({
            where: { createdByUserId: userId },
            orderBy: { createdAt: "desc" },
        });
    },

    findPersonalBoxes: function(userId: string) {
        return prisma.box.findMany({
            where: { createdByUserId: userId, coupleId: null },
        });
    },

    findSharedBoxes: function(coupleId: string) {
        return prisma.box.findMany({
            where: { coupleId },
        });
    },

    create: function(data: CreateBoxInput & { coupleId: string | null; createdByUserId: string }) {
        return prisma.box.create({ data });
    },

    update: function(id: string, data: UpdateBoxInput) {
        return prisma.box.update({ where: { id }, data });
    },

    updateCoupleId: function(id: string, coupleId: string | null) {
        return prisma.box.update({ where: { id }, data: { coupleId } });
    },

    delete: function(id: string) {
        return prisma.box.delete({ where: { id } });
    },


};
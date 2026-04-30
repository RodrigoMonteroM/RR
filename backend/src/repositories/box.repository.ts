import { prisma } from "@/lib/prisma";
import { CreateBoxInput, UpdateBoxInput } from "@/schema/boxSchema";

export const boxRepository = {
    findById: (id: string) =>
        prisma.box.findUnique({
            where: { id },
            include: { items: true }
        }),

    findByUserId: (userId: string) =>
        prisma.box.findMany({
            where: { createdByUserId: userId },
            orderBy: { createdAt: "desc" }
        }),

    findPersonalBoxes: (userId: string) =>
        prisma.box.findMany({
            where: { createdByUserId: userId, coupleId: null }
        }),

    findSharedBoxes: (coupleId: string) =>
        prisma.box.findMany({
            where: { coupleId }
        }),

    create: (data: CreateBoxInput & { coupleId: string | null; createdByUserId: string }) =>
        prisma.box.create({ data }),

    update: (id: string, data: UpdateBoxInput) =>
        prisma.box.update({ where: { id }, data }),

    updateCoupleId: (id: string, coupleId: string | null) =>
        prisma.box.update({ where: { id }, data: { coupleId } }),

    delete: (id: string) =>
        prisma.box.delete({ where: { id } })
}
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { boxRepository } from "@/repositories/box.repository";
import { CreateBoxInput, UpdateBoxInput } from "@/schema/boxSchema";

export class BoxService {
    private static async getCoupleId(userId: string): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { coupleId: true }
        });
        return user?.coupleId ?? null;
    }

    static async getBoxes(userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);

            if (!coupleId) {
                return await boxRepository.findPersonalBoxes(userId);
            }

            const [personal, shared] = await Promise.all([
                boxRepository.findPersonalBoxes(userId),
                boxRepository.findSharedBoxes(coupleId)
            ]);

            return [...personal, ...shared];
        } catch (error) {
            logger.error("getBoxes failed", error);
            throw error;
        }
    }

    static async getBoxById(boxId: string, userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);
            const box = await boxRepository.findById(boxId);

            if (!box) throw new Error("Box not found");

            const isOwner = box.createdByUserId === userId;
            const isShared = coupleId && box.coupleId === coupleId;

            if (!isOwner && !isShared) throw new Error("Box not found or not authorized");

            return box;
        } catch (error) {
            logger.error("getBoxById failed", error);
            throw error;
        }
    }

    static async create(data: CreateBoxInput, userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);

            return await boxRepository.create({
                name: data.name,
                description: data.description,
                coupleId,
                createdByUserId: userId
            });
        } catch (error) {
            logger.error("create box failed", error);
            throw error;
        }
    }

    static async update(boxId: string, data: UpdateBoxInput, userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);
            const box = await boxRepository.findById(boxId);

            if (!box) throw new Error("Box not found");

            const isOwner = box.createdByUserId === userId;
            const isShared = coupleId && box.coupleId === coupleId;

            if (!isOwner && !isShared) throw new Error("Box not found or not authorized");

            return await boxRepository.update(boxId, data);
        } catch (error) {
            logger.error("update box failed", error);
            throw error;
        }
    }

    static async delete(boxId: string, userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);
            const box = await boxRepository.findById(boxId);

            if (!box) throw new Error("Box not found");

            const isOwner = box.createdByUserId === userId;

            if (!isOwner) throw new Error("Box not found or not authorized");

            return await boxRepository.delete(boxId);
        } catch (error) {
            logger.error("delete box failed", error);
            throw error;
        }
    }

    static async changeVisibility(boxId: string, userId: string) {
        try {
            const coupleId = await this.getCoupleId(userId);
            const box = await boxRepository.findById(boxId);

            if (!box) throw new Error("Box not found");
            if (box.createdByUserId !== userId) throw new Error("Not authorized");

            if (box.coupleId && coupleId && box.coupleId !== coupleId) {
                throw new Error("Cannot change visibility of a box from another couple");
            }

            const newCoupleId = box.coupleId ? null : coupleId;
            // se non hai una coppia non puoi condividere una box
            if (!box.coupleId && !coupleId) {
                throw new Error("You need a couple first to share a box");
            }

            return await boxRepository.updateCoupleId(boxId, newCoupleId);
        } catch (error) {
            logger.error("changeVisibility failed", error);
            throw error;
        }
    }
}
import { boxRepository } from "@/repositories/box.repository";
import { CreateBoxInput, UpdateBoxInput } from "@/schema/boxSchema";
import { userRepository } from "@/repositories/user.repository";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export class BoxService {

    private static authorizeBoxAccess(
        box: { createdByUserId: string; coupleId: string | null },
        userId: string,
        coupleId: string | null
    ) {
        const isOwner = box.createdByUserId === userId;
        const isShared = coupleId && box.coupleId === coupleId;

        if (!isOwner && !isShared) {
            throw new ForbiddenError();
        }
    }

    private static authorizeBoxOwner(box: { createdByUserId: string }, userId: string) {
        if (box.createdByUserId !== userId) {
            throw new ForbiddenError();
        }
    }

    static async getBoxes(userId: string) {
        const coupleId = await userRepository.getCoupleIdByUserId(userId);

        if (!coupleId) {
            return await boxRepository.findPersonalBoxes(userId);
        }

        const [personal, shared] = await Promise.all([
            boxRepository.findPersonalBoxes(userId),
            boxRepository.findSharedBoxes(coupleId)
        ]);

        return [...personal, ...shared];
    }

    static async getBoxById(boxId: string, userId: string) {
        const coupleId = await userRepository.getCoupleIdByUserId(userId);
        const box = await boxRepository.findById(boxId);

        if (!box) throw new NotFoundError("Box not found");
        await this.authorizeBoxAccess(box, userId, coupleId);

        return box;
    }

    static async create(data: CreateBoxInput, userId: string) {
        const coupleId = await userRepository.getCoupleIdByUserId(userId);

        return await boxRepository.create({
            name: data.name,
            description: data.description,
            coupleId,
            createdByUserId: userId
        });
    }

    static async update(boxId: string, data: UpdateBoxInput, userId: string) {
        const coupleId = await userRepository.getCoupleIdByUserId(userId);
        const box = await boxRepository.findById(boxId);

        if (!box) throw new NotFoundError("Box not found");
        await this.authorizeBoxAccess(box, userId, coupleId);

        return await boxRepository.update(boxId, data);
    }

    static async delete(boxId: string, userId: string) {
        const box = await boxRepository.findById(boxId);

        if (!box) throw new NotFoundError("Box not found");
        await this.authorizeBoxOwner(box, userId);

        return await boxRepository.delete(boxId);
    }

    static async changeVisibility(boxId: string, userId: string) {
        const coupleId = await userRepository.getCoupleIdByUserId(userId);
        const box = await boxRepository.findById(boxId);

        if (!box) throw new NotFoundError("Box not found");
        if (box.createdByUserId !== userId) throw new ForbiddenError();

        if (box.coupleId && coupleId && box.coupleId !== coupleId) {
            throw new ForbiddenError("Cannot change visibility of a box from another couple");
        }

        const newCoupleId = box.coupleId ? null : coupleId;
        if (!box.coupleId && !coupleId) {
            throw new ForbiddenError("You need a couple first to share a box");
        }

        return await boxRepository.updateCoupleId(boxId, newCoupleId);
    }
}

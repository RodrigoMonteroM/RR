import { logger } from "@/lib/logger";
import { userRepository } from "@/repositories/user.repository";
import { CreateUserInput } from "@/schema/userSchema";

export default class UserService {
    static async getUserById(id: string) {
        try {
            return await userRepository.findById(id);
        } catch (error: unknown) {
            logger.error("getUserById failed", error);
            throw error;
        }
    }

    static async getUserByEmail(email: string) {
        try {
            return await userRepository.findByEmail(email);
        } catch (error: unknown) {
            logger.error("getUserByEmail failed", error);
            throw error;
        }
    }

    static async getUserByNickname(nickname: string) {
        try {
            return await userRepository.findByNickname(nickname);
        } catch (error: unknown) {
            logger.error("getUserByNickname failed", error);
            throw error;
        }
    }

    static async createUser(data: CreateUserInput) {
        try {
            return await userRepository.create(data);
        } catch (error: unknown) {
            logger.error("createUser failed", error);
            throw error;
        }
    }

    static async searchUsers(query: string, currentUserId: string) {
        try {
            return await userRepository.searchByQuery(query, currentUserId);
        } catch (error: unknown) {
            logger.error("searchUsers failed", error);
            throw error;
        }
    }

    static async getUserByEmailOrNickname(email: string, nickname: string) {
        try {
            return await userRepository.searchUserByEmailorNickname(email, nickname);
        } catch (error: unknown) {
            logger.error("getUserByEmailOrNickname faild: ", error)
        }
    }

    static async updateUser(id: string, data: Record<string, unknown>) {
        try {
            return await userRepository.update(id, data);
        } catch (error: unknown) {
            logger.error("updateUser failed", error);
            throw error;
        }
    }

    static async getUserByResetToken(token: string) {
        try {
            return await userRepository.findByResetToken(token);
        } catch (error: unknown) {
            logger.error("getUserByResetToken failed", error);
            throw error;
        }
    }
}

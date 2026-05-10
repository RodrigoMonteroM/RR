import {userRepository} from "@/repositories/user.repository";
import {CreateUserInput, UpdateUserInput} from "@/schema/userSchema";

export default class UserService {
    static async getUserById(id: string) {
        return await userRepository.findById(id);
    }

    static async getUserByEmail(email: string) {
        return await userRepository.findByEmail(email);
    }

    static async getUserByNickname(nickname: string) {
        return await userRepository.findByNickname(nickname);
    }

    static async createUser(data: CreateUserInput) {
        return await userRepository.create(data);
    }

    static async searchUsers(query: string, currentUserId: string) {
        return await userRepository.searchByQuery(query, currentUserId);
    }

    static async getUserByEmailOrNickname(email: string, nickname: string) {
        return await userRepository.searchUserByEmailOrNickname(email, nickname);
    }

    static async updateUser(id: string, data: UpdateUserInput) {
        return await userRepository.update(id, data);
    }

    static async getUserByResetToken(token: string) {
        return await userRepository.findByResetToken(token);
    }

    static async updatePassword(id: string, password: string) {
        return await userRepository.update(id, {
            password
        });
    }


    static async setResetToken(id: string, token: string, expiry: Date) {
        return await userRepository.update(id, {
            resetToken: token,
            resetTokenExpirity: expiry,
        })
    }

    static async clearResetToken(id: string) {
        return await userRepository.update(id, {
            resetTokenExpirity: null,
            resetToken: null
        })
    }
}

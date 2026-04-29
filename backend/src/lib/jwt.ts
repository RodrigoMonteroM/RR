// bun add jose
import { SignJWT, jwtVerify } from "jose";

export interface JwtPayload {
    userId: string;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const signToken = async (payload: JwtPayload): Promise<string> => {
    return await new SignJWT({ userId: payload.userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
};

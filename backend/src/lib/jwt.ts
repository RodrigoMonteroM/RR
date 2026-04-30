// bun add jose
import { SignJWT, jwtVerify } from "jose";

export interface JwtPayload {
    userId: string;
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
}
const secret = new TextEncoder().encode(jwtSecret);

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

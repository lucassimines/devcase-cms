import type { AuthUser } from "@src/types/auth.js";
import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const accessTokenTTL = 60 * 60; // 1 hour
const refreshTokenTTL = 60 * 60 * 24; // 24 hours

class TokenHelper {
    // Create an access token for the user
    createAccessToken(user: AuthUser): string {
        return jwt.sign(user, ACCESS_TOKEN_SECRET ?? "", { expiresIn: accessTokenTTL });
    }

    // Create a refresh token
    createRefreshToken(user: AuthUser): string {
        return jwt.sign(user, REFRESH_TOKEN_SECRET ?? "", { expiresIn: refreshTokenTTL });
    }

    // Verify the refresh token and return the user data
    verifyRefreshToken(refreshToken: string): AuthUser {
        return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET ?? "") as AuthUser;
    }
}

export default new TokenHelper();

import * as jwt from "jsonwebtoken";

export class AuthenticationUtility {
	public static jwtVerify(secret: string, token: string): boolean {
		return jwt.verify(token, secret) != null;
	}

	public static jwtVerifyAndDecode(secret: string, token: string): any {
		return jwt.verify(token, secret) as any;
	}
}

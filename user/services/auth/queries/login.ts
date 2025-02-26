import { Context } from "moleculer";
import { IUser, IUserLogin } from "../../../models/user.model";
import { AuthenticationUtility } from "../../../util/auth.util";

module.exports = {
	async handler(ctx: Context<IUserLogin>) {
		const user = ctx.params;
		const res: IUser = await ctx.broker.call("users.queries.find", {
			email: user.email,
			password: user.password,
		});

		if (!res._id) {
			throw new Error("Invalid email or password");
		}

		const secret: string = process.env.JWT_SECRET as string;
		const token: string = AuthenticationUtility.jwtSign(secret, {
			userId: res._id,
			userEmail: res.email,
			role: res.role,
			name: res.name,
		});
		return token;
	},
};

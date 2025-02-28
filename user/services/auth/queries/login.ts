import { Context } from "moleculer";
import { IUser, IUserLogin } from "../../../models/user.model";
import { AuthenticationUtility } from "../../../util/auth.util";

module.exports = {
	params: {
		email: { type: "string" },
		password: { type: "string" },
		$$strict: "remove",
	},
	saga: true,
	async handler(ctx: Context<IUserLogin>) {
		const user = ctx.params;
		const res: IUser = await ctx.call("users.queries.find", {
			email: user.email,
			password: user.password,
		});

		await ctx.call("reviews.query.findByUser", { id: res?._id });
		await ctx.call("users.command.failed");

		if (!res?._id) {
			throw new Error("Invalid email or password");
		}

		ctx.broker.logger.info("Login query completed");
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

import { Context } from "moleculer";
import { IUserBase, UserRole } from "../../../models/user.model";

module.exports = {
	params: {
		name: { type: "string", optional: true },
		email: { type: "string" },
		password: { type: "string" },
		role: {
			type: "enum",
			values: [UserRole.ADMIN, UserRole.AUDIENCE, UserRole.CRITIC],
			default: UserRole.AUDIENCE,
		},
		$$strict: "remove",
	},
	async handler(ctx: Context<IUserBase>) {
		const user = ctx.params;
		const res = await this.adapter.insert(user);
		ctx.emit("user.created", res);
		return res;
	},
};

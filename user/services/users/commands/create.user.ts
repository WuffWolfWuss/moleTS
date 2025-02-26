import { Context } from "moleculer";
import { IUserBase } from "../../../models/user.model";

module.exports = {
	async handler(ctx: Context<IUserBase>) {
		const user = ctx.params;
		const res = await this.adapter.insert(user);
		ctx.emit("user.created", res);
		return res;
	},
};

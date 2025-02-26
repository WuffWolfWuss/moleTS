import { Context } from "moleculer";
import { IMovieBase } from "../../../models/movie";

module.exports = {
	name: "movie.create",
	async handler(ctx: Context<IMovieBase, { userId: string }>) {
		const user = ctx.params;
		const res = await this.adapter.insert({
			...user,
			createdById: ctx.meta.userId,
		});
		ctx.emit("movie.created", res);
		return res;
	},
};

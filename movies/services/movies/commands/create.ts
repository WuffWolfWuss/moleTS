import { Context } from "moleculer";
import { IMovieBase } from "../../../models/movie";
import { MovieThis } from "../../../models/common";

module.exports = {
	params: {
		title: { type: "string" },
		runtime: { type: "number" },
		releaseDate: { type: "date" },
		poster: { type: "string", optional: true },
		$$strict: "remove",
	},
	async handler(this: MovieThis, ctx: Context<IMovieBase, { user: any }>) {
		const movies = ctx.params;
		const res = await this.adapter.insert({
			...movies,
			createdById: ctx.meta.user.userId,
		});
		//ctx.emit("movie.created", res);
		return res;
	},
};

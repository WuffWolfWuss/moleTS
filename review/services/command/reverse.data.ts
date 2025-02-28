import { Context } from "moleculer";
import { ReviewThis } from "../../models/common";
import { IReview } from "../../models/review";

interface ISagaPayload {
	oldData: any;
}

module.exports = {
	async handler(
		this: ReviewThis,
		ctx: Context<ISagaPayload, { userId: string }>
	) {
		if (!ctx.params.oldData) return ctx;

		const movie = ctx.params.oldData;

		const res = await this.adapter.updateById(movie.movieId, {
			rating: movie.rating,
		});
		return res;
	},
};

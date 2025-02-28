import { Context } from "moleculer";
import { MovieThis } from "../../../models/common";

interface IRatingPayload {
	movieId: string;
	audience: { rating: number; number_of_reviews: number };
	critic: { rating: number; number_of_reviews: number };
}

module.exports = {
	params: {
		movieId: { type: "string" },
		audience: {
			type: "object",
			props: { rating: "number", numReviews: "number" },
		},
		critic: {
			type: "object",
			props: { rating: "number", numReviews: "number" },
		},
		$$strict: "remove",
	},
	async handler(
		this: MovieThis,
		ctx: Context<IRatingPayload, { userId: string }>
	) {
		const movie = ctx.params;
		const res = await this.adapter.updateById(movie.movieId, {
			$set: {
				audience: movie.audience,
				critics: movie.critic,
			},
		});
		this.logger.info(`Movie ${movie.movieId} rating updated`);
		return res;
	},
};

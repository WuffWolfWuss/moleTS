import { Context } from "moleculer";

module.exports = {
	async handler(ctx: Context<any>) {
		const { movieId } = ctx.params;

		const stats: { _id: String; avgRating: number; reviewCount: number }[] =
			await this.adapter.model.aggregate([
				{ $match: { movieId } },
				{
					$group: {
						_id: "$userRole",
						avgRating: { $avg: "$rating" },
						reviewCount: { $sum: 1 },
					},
				},
			]);

		const result = {
			movieId,
			audience: { rating: 0, numReviews: 0 },
			critic: { rating: 0, numReviews: 0 },
		};

		stats.forEach((stat) => {
			if (stat._id === "AUDIENCE") {
				result.audience.rating = Number(stat.avgRating.toFixed(2));
				result.audience.numReviews = stat.reviewCount;
			} else if (stat._id === "CRITIC") {
				result.critic.rating = Number(stat.avgRating.toFixed(2));
				result.critic.numReviews = stat.reviewCount;
			}
		});

		// Call MovieService to update the movie's ratings
		await ctx.call("movie.command.updateRating", result);
		return result;
	},
};

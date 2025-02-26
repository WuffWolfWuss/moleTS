module.exports = {
	async handler(this: any, ctx: Context<any>) {
		const { movie_id } = ctx.params;

		const stats: { _id: String; avgRating: number; reviewCount: number }[] =
			await this.adapter.model.aggregate([
				{ $match: { movie_id } },
				{
					$group: {
						_id: "$userRole",
						avgRating: { $avg: "$rating" },
						reviewCount: { $sum: 1 },
					},
				},
			]);

		const result = {
			movie_id,
			audience: { rating: 0, number_of_reviews: 0 },
			critic: { rating: 0, number_of_reviews: 0 },
		};

		stats.forEach((stat) => {
			if (stat._id === "Audience") {
				result.audience.rating = Number(stat.avgRating.toFixed(2));
				result.audience.number_of_reviews = stat.reviewCount;
			} else if (stat._id === "Critic") {
				result.critic.rating = Number(stat.avgRating.toFixed(2));
				result.critic.number_of_reviews = stat.reviewCount;
			}
		});

		// Call MovieService to update the movie's ratings
		await ctx.call("movie.updateRatings", result);

		return result;
	},
};

import { Context } from "moleculer";
import { ReviewThis } from "../../models/common";
import { IReview } from "../../models/review";

module.exports = {
	params: {
		rating: { type: "number", optional: true },
		reviewText: { type: "string", optional: true },
		$$strict: "remove",
	},
	saga: true,
	async handler(
		this: ReviewThis,
		ctx: Context<IReview & { id: string }, { user: { userId: string } }>
	) {
		const { id, ...review } = ctx.params;
		const before: IReview = await ctx.call("reviews.query.findById", { id });
		if (!before) {
			throw new Error("Review not found");
		}

		if (before.createdById !== ctx.meta.user.userId) {
			throw new Error("You are not allowed to update this review");
		}

		const obj = { ...before, ...review };
		const entity = await this.adapter.updateById(id, obj);

		// Emit event to trigger rating calculation
		//this.broker.emit("review.updated", { movieId: before.movieId });
		ctx.call("rating.calcRating", { movieId: before.movieId });
		ctx.call("reviews.query.fake");
		return entity;
	},
};

import { Context } from "moleculer";
import { ReviewThis } from "../../models/common";
import { EUserRole, IReview } from "../../models/review";

module.exports = {
	params: {
		movieId: { type: "string", required: true },
		rating: { type: "number", required: true },
		reviewText: { type: "string", optional: true },
		$$strict: "remove",
	},
	async handler(
		this: ReviewThis,
		ctx: Context<
			IReview & { id: string },
			{ user: { userId: string; role: EUserRole } }
		>
	) {
		const review: IReview = {
			...ctx.params,
			createdById: ctx.meta.user.userId,
			userRole: ctx.meta.user.role,
		};
		const entity = await this.adapter.insert(review);
		// Emit event to trigger rating calculation
		this.broker.emit("review.created", { movieId: ctx.params.movieId });
		return entity;
	},
};

import { Context } from "moleculer";
import { ReviewThis } from "../../models/common";
import { IReview } from "../../models/review";

module.exports = {
	async handler(this: ReviewThis, ctx: Context<{ id: string }>) {
		const { id } = ctx.params;
		const res = await this.adapter.model.findById(id).lean();
		return res;
	},
};

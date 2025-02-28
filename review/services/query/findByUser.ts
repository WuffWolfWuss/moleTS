import { Context } from "moleculer";
import { ReviewThis } from "../../models/common";

module.exports = {
	saga: {
		reverse: {
			action: "reviews.query.findByUser",
			compensation: "reviews.query.fake",
		},
	},
	async handler(this: ReviewThis, ctx: Context<{ id: string }>) {
		const { id } = ctx.params;
		const res = await this.adapter.model.find({ createdById: id }).lean();
		//throw new Error("find user failed");
		return res;
	},
};

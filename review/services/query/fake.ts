import { Context } from "moleculer";

module.exports = {
	saga: true,
	async handler(ctx: Context<any>) {
		ctx.broker.logger.info("fake query executed");
		//throw new Error("ERRRR");
	},
};

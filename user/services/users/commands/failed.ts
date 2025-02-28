import { Context } from "moleculer";

module.exports = {
	async handler(ctx: Context<any>) {
		ctx.broker.logger.info("FAILED COMMAND executed!!!");
		throw new Error("ERRRR");
	},
};

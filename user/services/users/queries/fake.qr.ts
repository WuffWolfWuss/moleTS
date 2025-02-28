import { Context } from "moleculer";

module.exports = {
	async handler(ctx: Context<any>) {
		ctx.broker.logger.info(
			`Fake query executed with params: ${JSON.stringify(ctx.params)}`
		);
	},
};

import { ActionHandler, ActionSchema, Middleware } from "moleculer";

const middleware1 = (): Middleware => {
	return {
		localAction(handler: ActionHandler, action: ActionSchema) {
			return function mw1(ctx) {
				ctx.broker.logger.info("      mw1 before", ctx.action.name);

				return handler(ctx).then((res) => {
					ctx.broker.logger.info("      mw1 after", ctx.action.name);
					return res;
				});
			};
		},
	};
};

export default middleware1;

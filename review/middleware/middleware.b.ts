import {
	ActionHandler,
	ActionSchema,
	CallingOptions,
	Context,
	Middleware,
} from "moleculer";

interface SagaStep {
	action: string;
	compensation?: string;
}

interface SagaOptions {
	steps: SagaStep[];
	timeout?: number;
}

const middleware2 = (): Middleware => {
	return {
		localAction(handler: ActionHandler, action: ActionSchema) {
			if (!action.saga) return handler;
			const sagaOptions: SagaOptions = action.saga;
			//console.log(sagaOptions);

			return async function mw2(ctx) {
				//ctx.broker.logger.info("      mw2 before", ctx.action?.name);
				// const executedSteps: {
				// 	action: string;
				// 	params: any;
				// 	result: any;
				// 	compensation?: string;
				// }[] = [];
				const originalCall = ctx.call;
				const logger = ctx.broker.logger;

				if (!ctx.meta.$saga) {
					ctx.meta.$saga = {
						executedSteps: [],
					};
				}

				try {
					logger.info(`Starting Saga for ${ctx.action?.name}`);
					const result = await handler(ctx);
					if (sagaOptions.steps.length > 0) {
						ctx.meta.$saga.executedSteps.push({
							action: ctx.action.name,
							params: ctx.params,
							success: true,
							compensation: sagaOptions.steps.find(
								(v) => v.action === ctx.action.name
							)?.compensation,
						});
					}
					logger.info(`Saga completed for ${ctx.action?.name}`);
					return result;
				} catch (error) {
					console.log(ctx.meta.$saga.executedSteps);
					logger.error(`Saga failed: ${error.message}`);

					// Roll back all executed steps
					const executedSteps = ctx.meta.$saga.executedSteps;
					for (let i = executedSteps.length - 1; i >= 0; i--) {
						const step = executedSteps[i];
						if (step.compensation) {
							try {
								await originalCall.call(ctx, step.compensation, {
									...step.params,
								});
								logger.info(
									`Compensated ${step.compensation} for ${step.action}`
								);

								//FINISH COMPENSATED ACTION, REMOVE IT FROM THE EXECUTEDSTEPS
								ctx.meta.$saga.executedSteps.pop();
							} catch (compError) {
								logger.error(
									`Compensation ${step.compensation} failed: ${compError.message}`
								);
							}
						}
					}
					throw error;
				}
			};
		},
	};
};

export default middleware2;

import {
	Middleware,
	Context,
	ServiceBroker,
	Errors,
	CallingOptions,
} from "moleculer";

interface SagaStep {
	action: string;
	compensation?: string;
}

interface SagaOptions {
	steps: SagaStep[];
	timeout?: number;
}

const SagaMiddleware = (): Middleware => {
	return {
		localAction(next, action) {
			if (!action.saga) return next;
			const sagaOptions: SagaOptions = action.saga;

			return async (ctx: Context<any>) => {
				const executedSteps: {
					action: string;
					params: any;
					result: any;
					compensation?: string;
				}[] = [];
				const originalCall = ctx.call;
				const logger = ctx.broker.logger;

				// Override ctx.call with proper type signature
				ctx.call = async <TResult, TParams = any>(
					actionName: string,
					params?: TParams,
					opts?: CallingOptions
				): Promise<TResult> => {
					const step = sagaOptions.steps.find(
						(s) => s.action === actionName
					) || { action: actionName };
					const callParams = params || {}; // Handle case where params is undefined
					try {
						const result = await originalCall.call(
							ctx,
							actionName,
							callParams,
							opts
						);
						executedSteps.push({
							action: actionName,
							params: callParams,
							result,
							compensation: step.compensation,
						});
						logger.info(`Step ${actionName} executed successfully`);
						return result as TResult;
					} catch (error) {
						logger.error(`Step ${actionName} failed: ${error.message}`);
						throw error; // Let the Saga catch it
					}
				};

				try {
					logger.info(`Starting Saga for ${ctx.action?.name}`);
					const result = await next(ctx);
					logger.info(`Saga completed for ${ctx.action?.name}`);
					return result;
				} catch (error) {
					logger.error(`Saga failed: ${error.message}`);
					// Roll back all executed steps
					for (let i = executedSteps.length - 1; i >= 0; i--) {
						const step = executedSteps[i];
						if (step.compensation) {
							try {
								await originalCall.call(ctx, step.compensation, {
									userId: step.result.userId,
								});
								logger.info(`Compensated ${step.compensation}`);
							} catch (compError) {
								logger.error(
									`Compensation ${step.compensation} failed: ${compError.message}`
								);
							}
						}
					}
					throw error;
				} finally {
					ctx.call = originalCall; // Restore original ctx.call
				}
			};
		},
	};
};

export default SagaMiddleware;

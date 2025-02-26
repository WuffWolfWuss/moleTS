import type {
	Context,
	Service,
	ServiceSchema,
	ServiceSettingSchema,
} from "moleculer";
import type {
	ApiSettingsSchema,
	GatewayResponse,
	IncomingRequest,
	Route,
} from "moleculer-web";
import ApiGateway from "moleculer-web";
import { AuthenticationUtility } from "../util/auth.util";

interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

interface GatewaySettings extends ServiceSettingSchema {}

type GatewayThis = Service<GatewaySettings>;

const ApiService: ServiceSchema<ApiSettingsSchema> = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT != null ? Number(process.env.PORT) : 3000,

		// Exposed IP
		ip: "0.0.0.0",
		path: "/api",

		routes: [
			{
				path: "/admin",

				whitelist: ["**"],

				mergeParams: true,
				authentication: true,
				authorization: false,

				aliases: {
					"POST /movie": "movie.command.create",
				},
				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},
			},
			{
				path: "/review",

				whitelist: ["**"],

				mergeParams: true,
				authentication: true,
				authorization: false,

				aliases: {
					"POST /reviews": {}, //Submit a review (requires authentication via UserService).
					"GET /movies/{movie_id}/reviews": {}, //Fetch all reviews for a movie.
					"GET /users/{user_id}/reviews": {}, //Fetch all reviews by a user.
					"PUT /reviews/{review_id}": {}, //Edit a review (only by the original user).
					"DELETE /reviews/{review_id}": {}, //Delete a review (optional, with authorization checks).
				},
				bodyParsers: {
					json: true,
					urlencoded: true,
				},
			},
			{
				name: "need-auth",
				path: "/",

				whitelist: ["**"],

				mergeParams: true,
				authentication: true,
				authorization: true,
				autoAliases: true,

				aliases: {
					"GET /view": async function (req, res) {
						res.end(`Caculator called.`);
					},
				},
				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},
			},
			{
				name: "public",
				path: "/",

				whitelist: ["**"],

				mergeParams: true,
				authentication: false,
				authorization: false,
				autoAliases: true,

				aliases: {
					"GET /hello": "echo.test",
					"GET /hi": async function (req, res) {
						const result: number = await req.$service.broker.call(
							"caculator.sum",
							{ a: 7, b: 3 }
						);
						res.end(`Caculator called. Result is ${result}`);
					},
					"POST /data": "greeter.hello",
					"POST /register": "users.command.create",
					"POST /login": "auth.queries.login",
				},

				/**
				 * Before call hook. You can check the request.
				 *
				onBeforeCall(
					ctx: Context<unknown, Meta>,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
				): void {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 *
				onAfterCall(
					ctx: Context,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
					data: unknown,
				): unknown {
					// Async function which return with Promise
					// return this.doSomething(ctx, res, data);
					return data;
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		authenticate(
			ctx: Context,
			route: Route,
			req: IncomingRequest
		): Record<string, unknown> | null {
			// Read the token from header
			const auth = req.headers.authorization;

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				const secretKey = "thisisasecretkey";
				const result = AuthenticationUtility.jwtVerifyAndDecode(
					secretKey,
					token
				);

				if (result) {
					return result;
				}
				// Invalid token
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					null
				);
			} else {
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					null
				);
			}
		},

		authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			// Get the authenticated user.
			const user = ctx.meta.user;
			console.log("USER", user);

			// It check the `auth` property in action schema.
			if (!user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
			}
		},

		adminAuth(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			const user = ctx.meta.user;
		},
	},
};

export default ApiService;

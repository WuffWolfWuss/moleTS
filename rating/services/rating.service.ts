import type {
	Context,
	Service,
	ServiceSchema,
	ServiceSettingSchema,
} from "moleculer";
import DbConnectionMixin from "../mixins/db.mixin";
const calcRating = require("./query/calc.rating");

interface RatingSettings extends ServiceSettingSchema {}

type RatingThis = Service<RatingSettings>;

const RatingService: ServiceSchema<RatingSettings> = {
	name: "rating",
	mixins: [DbConnectionMixin({ model: "reviews" })],

	events: {
		"review.created"(ctx: Context<{ movieId: string }>) {
			this.logger.info(`Rating calc: ${ctx.params.movieId}`);
			this.calcRating(ctx);
		},
		"review.updated"(ctx: Context<{ movieId: number }>) {
			this.logger.info(`Rating updated: ${ctx.params.movieId}`);
			this.calcRating(ctx);
		},
		"rating.removed"(ctx: Context<{ rating: number }>) {
			this.logger.info(`Rating removed: ${ctx.params.rating}`);
		},
	},

	/**
	 * Methods
	 */
	methods: {
		calcRating,
	},
};

export default RatingService;

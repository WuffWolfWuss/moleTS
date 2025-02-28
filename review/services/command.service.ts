import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";
import DbConnectionMixin from "../mixins/db.mixin";
const reviewModel = require("../schema/review");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

interface ReviewSettings extends DbServiceSettings {}

const createReview = require("./command/create");
const updateReview = require("./command/update");

const ReviewCommandService: ServiceSchema<ReviewSettings> = {
	name: "reviews.command",
	mixins: [
		DbConnectionMixin({
			mongoUri: process.env.MONGO_URI as string,
			model: reviewModel,
		}),
	],

	actions: {
		create: createReview,
		update: updateReview,
	},
};

export default ReviewCommandService;

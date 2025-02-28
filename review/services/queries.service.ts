const reviewModel = require("../schema/review");
import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";
import DbConnectionMixin from "../mixins/db.mixin";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

interface ReviewSettings extends DbServiceSettings {}

const findById = require("./query/findById");
const findByUser = require("./query/findByUser");
const fake = require("./query/fake");

const ReviewQueryService: ServiceSchema<ReviewSettings> = {
	name: "reviews.query",
	mixins: [
		DbConnectionMixin({
			mongoUri: process.env.MONGO_URI as string,
			model: reviewModel,
		}),
	],

	actions: {
		findById,
		findByUser,
		fake,
	},
};

export default ReviewQueryService;

import type { Context, Service, ServiceSchema } from "moleculer";
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("moleculer-db");
require("dotenv").config();

const reviewModel = require("../schema/review");

export interface DbMixinSettings {
	model: any;
	readPreference?:
		| "primary"
		| "secondary"
		| "primaryPreferred"
		| "secondaryPreferred"
		| "nearest"; // MongoDB read preferences
}

const DbConnectionMixin = (settings: DbMixinSettings): ServiceSchema => ({
	name: "dbmixin",
	mixins: [DbMixin],
	adapter: new MongooseAdapter(process.env.MONGO_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		readPreference: "secondaryPreferred",
	}),
	model: reviewModel,

	async started() {
		await this.adapter.connect();
	},
});

export default DbConnectionMixin;

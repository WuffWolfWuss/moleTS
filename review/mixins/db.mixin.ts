import type { Context, Service, ServiceSchema } from "moleculer";
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("moleculer-db");
require("dotenv").config();

export interface DbMixinSettings {
	mongoUri: string;
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
	adapter: new MongooseAdapter(settings.mongoUri, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		readPreference: settings.readPreference || "primary",
	}),
	model: settings.model,
	async started() {
		await this.adapter.connect();
		this.logger.info(
			`Connected to MongoDB with readPreference: ${
				settings.readPreference || "primary"
			}`
		);
	},
});

export default DbConnectionMixin;

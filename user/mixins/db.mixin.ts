import fs from "fs";
import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, MoleculerDB } from "moleculer-db";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
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

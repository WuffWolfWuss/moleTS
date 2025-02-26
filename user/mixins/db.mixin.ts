import fs from "fs";
import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, MoleculerDB } from "moleculer-db";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
require("dotenv").config();

export type DbServiceMethods = {
	seedDb?(): Promise<void>;
};

type DbServiceSchema = Partial<ServiceSchema> &
	Partial<MoleculerDB<DbAdapter>> & {
		collection?: string;
	};

export type DbServiceThis = Service & DbServiceMethods;

export default function createDbServiceMixin(
	collection: string
): DbServiceSchema {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema: DbServiceSchema = {
		mixins: [DbService],

		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 */
			async [cacheCleanEventName](this: DbServiceThis) {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			},
		},

		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 */
			async entityChanged(
				type: string,
				json: unknown,
				ctx: Context
			): Promise<void> {
				await ctx.broadcast(cacheCleanEventName);
			},
		},

		async started(this: DbServiceThis) {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const count = await this.adapter.count();
				if (count === 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info(
						"Seeding is done. Number of records:",
						await this.adapter.count()
					);
				}
			}
		},
	};

	console.log(process.env.MONGO_URI);
	if (process.env.MONGO_URI) {
		// Mongo adapter
		//schema.adapter = new MongoDbAdapter(process.env.MONGO_URI);
		schema.adapter = new MongooseAdapter(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		});
		schema.collection = collection;
	} else if (process.env.NODE_ENV === "test") {
		// NeDB memory adapter for testing
		schema.adapter = new DbService.MemoryAdapter();
	} else {
		// NeDB file DB adapter

		// Create data folder
		if (!fs.existsSync("./data")) {
			fs.mkdirSync("./data");
		}

		schema.adapter = new DbService.MemoryAdapter({
			filename: `./data/${collection}.db`,
		});
	}

	return schema;
}

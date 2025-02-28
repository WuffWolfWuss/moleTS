const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("moleculer-db");
const userModel = require("../../schema/user");
import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";
import DbConnectionMixin from "../../mixins/db.mixin";

require("dotenv").config();

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

interface UserSettings extends DbServiceSettings {}

const findUser = require("./queries/find");
const fake = require("./queries/fake.qr");

const UserQueryService: ServiceSchema<UserSettings> = {
	name: "users.queries",
	mixins: [
		DbConnectionMixin({
			mongoUri: process.env.MONGO_URI as string,
			model: userModel,
		}),
	],

	actions: {
		find: findUser,
		fake,
	},
};

export default UserQueryService;

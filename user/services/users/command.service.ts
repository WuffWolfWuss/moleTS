const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("moleculer-db");
const userModel = require("../../schema/user");
import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";

require("dotenv").config();

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

interface UserSettings extends DbServiceSettings {}

const createUser = require("./commands/create.user");
const failed = require("./commands/failed");

const UserCommandService: ServiceSchema<UserSettings> = {
	name: "users.command",
	mixins: [DbMixin],
	adapter: new MongooseAdapter(process.env.MONGO_URI),
	model: userModel,

	actions: {
		create: createUser,
		failed,
	},
};

export default UserCommandService;

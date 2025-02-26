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

const findUser = require("./queries/find");

const UserQueryService: ServiceSchema<UserSettings> = {
	name: "users.queries",
	mixins: [DbMixin],
	adapter: new MongooseAdapter(process.env.MONGO_URI),
	model: userModel,

	actions: {
		find: findUser,
	},
};

export default UserQueryService;

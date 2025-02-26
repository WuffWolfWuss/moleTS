const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const DbMixin = require("moleculer-db");
const userModel = require("../../schema/movie");
import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

interface UserSettings extends DbServiceSettings {}

const create = require("./commands/create");

const UserCommandService: ServiceSchema<UserSettings> = {
	name: "movie.command",
	mixins: [DbMixin],
	adapter: new MongooseAdapter(process.env.MONGO_URI),
	model: userModel,

	actions: {
		create,
	},
};

export default UserCommandService;

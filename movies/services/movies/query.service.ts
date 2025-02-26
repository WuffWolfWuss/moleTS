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

const findOne = require("./queries/findOne");

const UserQueryService: ServiceSchema<UserSettings> = {
	name: "movie.query",
	mixins: [DbMixin],
	adapter: new MongooseAdapter(process.env.MONGO_URI),
	model: userModel,

	actions: {
		findOne,
	},
};

export default UserQueryService;

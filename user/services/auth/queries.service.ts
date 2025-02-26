import { ServiceSchema } from "moleculer";
import { DbServiceSettings } from "moleculer-db";

interface UserSettings extends DbServiceSettings {}

const login = require("./queries/login");

const AuthQueryService: ServiceSchema<UserSettings> = {
	name: "auth.queries",

	actions: {
		login,
	},
};

export default AuthQueryService;

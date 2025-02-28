import { Context, Service, ServiceSettingSchema } from "moleculer";
import { IUser, IUserBase } from "../../../models/user.model";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import { DbAdapter, MoleculerDbMethods } from "moleculer-db";
import { Document } from "mongoose";

interface UserDocument extends IUserBase, Document {}

interface UserSettings extends ServiceSettingSchema {}

interface UserThis extends Service<UserSettings>, MoleculerDbMethods {
	adapter: MongooseDbAdapter<UserDocument>;
}

module.exports = {
	params: {
		email: { type: "string" },
		password: { type: "string" },
		$$strict: "remove",
	},
	saga: {
		reverse: {
			action: "users.queries.find",
			compensation: "users.queries.fake",
		},
	},
	async handler(this: UserThis, ctx: Context<IUserBase>) {
		if (ctx.action?.saga) {
			ctx.action.saga.params = { rating: 0.6 };
		}
		const { email, password } = ctx.params;
		const res = await this.adapter.findOne({ email, password });
		return res;
	},
};

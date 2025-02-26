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
	async handler(this: UserThis, ctx: Context<IUserBase>) {
		const { email, password } = ctx.params;
		const res = await this.adapter.findOne({ query: { email, password } });
		return res;
	},
};

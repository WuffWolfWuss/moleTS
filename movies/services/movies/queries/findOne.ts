import { Context, Service, ServiceSettingSchema } from "moleculer";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import { DbAdapter, MoleculerDbMethods } from "moleculer-db";
import { Document } from "mongoose";
import { IMovieBase } from "../../../models/movie";

interface MovieDocument extends IMovieBase, Document {}

interface MovieSettings extends ServiceSettingSchema {}

interface MovieThis extends Service<MovieSettings>, MoleculerDbMethods {
	adapter: MongooseDbAdapter<MovieDocument>;
}

module.exports = {
	async handler(this: MovieThis, ctx: Context<IMovieBase>) {
		const res = await this.adapter.findOne({ query: ctx.params });
		return res;
	},
};

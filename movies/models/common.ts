import { Context, Service, ServiceSettingSchema } from "moleculer";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import { DbAdapter, MoleculerDbMethods } from "moleculer-db";
import { Document } from "mongoose";
import { IMovieBase } from "./movie";

interface MovieDocument extends IMovieBase, Document {}

interface MovieSettings extends ServiceSettingSchema {}

export interface MovieThis extends Service<MovieSettings>, MoleculerDbMethods {
	adapter: MongooseDbAdapter<MovieDocument>;
}

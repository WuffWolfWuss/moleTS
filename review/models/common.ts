import { Context, Service, ServiceSettingSchema } from "moleculer";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import { DbAdapter, MoleculerDbMethods } from "moleculer-db";
import { Document } from "mongoose";
import { IReviewBase } from "./review";

interface ReviewDocument extends IReviewBase, Document {}

interface ReviewSettings extends ServiceSettingSchema {}

export interface ReviewThis
	extends Service<ReviewSettings>,
		MoleculerDbMethods {
	adapter: MongooseDbAdapter<ReviewDocument>;
}

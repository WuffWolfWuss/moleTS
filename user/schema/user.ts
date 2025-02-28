import mongoose from "mongoose";
import { v7 as uuid } from "uuid";

const userSchema = new mongoose.Schema({
	_id: { type: String, default: uuid },
	name: String,
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String },
	status: { type: String, default: "pending" },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

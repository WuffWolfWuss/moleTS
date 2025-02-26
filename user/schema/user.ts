import mongoose from "mongoose";
import { randomUUID } from "crypto";

const userSchema = new mongoose.Schema({
	_id: { type: String, default: randomUUID() },
	name: String,
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "USER" },
	status: { type: String, default: "pending" },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

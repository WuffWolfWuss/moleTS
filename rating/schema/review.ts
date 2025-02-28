import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
	_id: { type: String },
	movieId: { type: String, require: true },
	rating: { type: Number, require: true },
	reviewText: String,
	userRole: { type: String, require: true },

	createdById: { type: String, require: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reviews", reviewSchema);

import mongoose from "mongoose";
import { randomUUID } from "crypto";

const movieRatingSchema = new mongoose.Schema({
	rating: Number,
	numReviews: { type: Number, default: 0 },
});

const movieSchema = new mongoose.Schema({
	_id: { type: String, default: randomUUID() },
	title: { type: String, require: true },
	runtime: Number,
	releaseDate: Date,
	poster: String,

	critics: { type: movieRatingSchema },

	audience: { type: movieRatingSchema },

	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movies", movieSchema);

import mongoose from "mongoose";
import { v7 as uuid } from "uuid";

const movieRatingSchema = new mongoose.Schema(
	{
		rating: Number,
		numReviews: { type: Number, default: 0 },
	},
	{ _id: false }
);

const movieSchema = new mongoose.Schema({
	_id: { type: String, default: uuid() },
	title: { type: String, require: true },
	runtime: Number,
	releaseDate: Date,
	poster: String,

	critics: { type: movieRatingSchema },

	audience: { type: movieRatingSchema },

	createdById: String,
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movies", movieSchema);

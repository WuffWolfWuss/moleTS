import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
	_id: { type: String, default: randomUUID() }, //use uuid.v7()
	movieId: { type: String, require: true },
	rating: { type: Number, require: true },
	reviewText: String,
	userRole: { type: String, require: true },

	createdById: { type: String, require: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movies", movieSchema);

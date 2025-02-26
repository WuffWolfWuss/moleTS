export interface IReviewBase {
	movieId: string;
	rating: number;
	reviewText: string;
	userRole: string;

	createdAt: Date;
	createdById: string;
}

export interface IReview extends IReviewBase {
	_id: string;
}

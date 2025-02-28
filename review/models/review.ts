export enum EUserRole {
	CRITIC = "CRITIC",
	AUDIENCE = "AUDIENCE",
	ADMIN = "ADMIN",
}

export interface IReviewBase {
	movieId: string;
	rating: number;
	reviewText: string;
	userRole: EUserRole;

	createdAt: Date;
	createdById: string;
}

export interface IReview extends IReviewBase {
	_id: string;
}

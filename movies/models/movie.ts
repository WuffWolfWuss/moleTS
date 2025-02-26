export interface IMovieRating {
	rating: number;
	numReviews: number;
}

export interface IMovieBase {
	title: string;
	runtime: number;
	releaseDate: Date;
	poster: string;

	critics: IMovieRating;
	audience: IMovieRating;

	createdAt: Date;
	createdById: string;
}

export interface IMovie extends IMovieBase {
	_id: string;
}

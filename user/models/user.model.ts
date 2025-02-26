export enum UserRole {
	USER = "USER",
	ADMIN = "ADMIN",
}

export interface IUserBase {
	name: String;
	email: String;
	password: String;
	role: UserRole;
	status: String;
	createdAt: Date;
}

export interface IUser extends IUserBase {
	_id: string;
}

export interface IUserLogin {
	email: string;
	password: string;
}

export interface PostUserDto {
  email: string;
  password: string;
  name: string;
}

export interface GetUserDto {
  id: number;
  email: string;
  name: string;
  is_email_verified: boolean;
}

export interface PutUserDto {
  email: string;
  password: string;
  name: string;
}

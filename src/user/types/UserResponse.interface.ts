export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export type JwtToken = Pick<UserResponse, 'accessToken' | 'refreshToken'>;

export type RefreshToken = Pick<UserResponse, 'refreshToken'>;

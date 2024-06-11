export interface ApiResponse {
  message: string;
  status: number;
  redirect?: string;
  data?: {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date;
    emailToken?: string;
    image?: string;
    password?: string;
    passwordToken?: string;
  };
}

export interface ApiRequest {
  email: string;
  token?: string;
  password?: string;
}

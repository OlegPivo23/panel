export interface User {
  id?: number;
  email: string;
  password: string;
}

export interface ErrorType {
  message: string;
  statusCode?: number;
}

export interface State {
  user: User | null;
  token: string | null;
  error: ErrorType | null;
  successRes: boolean;
  isAuthenticated: boolean;
}

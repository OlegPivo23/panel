import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import axiosR from 'src/api/http';
import cookie from 'cookiejs';

interface User {
  id?: number;
  email: string;
  password: string;
}

interface ErrorType {
  message: string;
  statusCode?: number;
}

interface State {
  user: User | null;
  token: string | null;
  error: ErrorType | null;
  successRes: boolean;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore('userStore', {
  state: (): State => ({
    user: null,
    token: '',
    error: null,
    successRes: false,
    isAuthenticated: false,
  }),

  getters: {
    getUser(state): User | null {
      return state.user;
    },
    getToken(state): string | null {
      return state.token;
    },
    getError(state): ErrorType | null {
      return state.error;
    },
    getRes(state): boolean {
      return state.successRes;
    },
    isAuthenticated(state): boolean {
      return !!state.token;
    },
  },

  actions: {
    async fetchUser(): Promise<void> {
      if (this.isAuthenticated) {
        try {
          const { data } = await axiosR('/users');
          this.user = data;
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    },

    async login(data: User): Promise<void> {
      try {
        const res = await axiosR.post('/auth', data);
        this.token = res.data.token;
        this.user = { ...res.data };
        cookie.set('token', res.data.token, 1);
        this.error = null;
      } catch (err: unknown) {
        const error = err as AxiosError;
        this.error = {
          message:
            typeof error.response?.data === 'string'
              ? error.response.data
              : 'Ошибка входа',
          statusCode: error.response?.status,
        };
      }
    },

    async autoLogin(): Promise<void> {
      const token = cookie.get('token');
      if (typeof token === 'string' && token.trim() !== '') {
        this.token = token;
        this.isAuthenticated = true;
        try {
          const res = await axiosR.post('/auth', { token });
          this.user = { ...res.data };
        } catch (err) {
          console.error('Ошибка при автологине:', err);
          this.token = null;
          this.isAuthenticated = false;
        }
      } else {
        console.warn('Некорректное значение токена:', token);
        this.token = null;
        this.isAuthenticated = false;
      }
    },

    async registerUser(
      data: User,
      result: (statusCode: number) => void
    ): Promise<void> {
      try {
        const res = await axiosR.post('/register', data);
        console.log('Ответ сервера при регистрации:', res);

        if (res.status === 201) {
          this.token = res.data.token;
          this.user = { ...res.data };
          this.error = null;
          cookie.set('token', res.data.token, 1);
          result(201);
        } else {
          result(res.status);
        }
      } catch (err: unknown) {
        const error = err as AxiosError;
        this.error = {
          message:
            typeof error.response?.data === 'string'
              ? error.response.data
              : 'Ошибка регистрации',
          statusCode: error.response?.status || 500,
        };
        console.error('Ошибка при регистрации:', this.error);
        result(error.response?.status || 500);
      }
    },
  },
});

import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './base.api';
import { AuthApi } from './auth.api';
import { UsersApi } from './users.api';
import { TodosApi } from './todos.api';

export interface IApiFactory {
  auth: AuthApi;
  users: UsersApi;
  todos: TodosApi;
  base: BaseApi;
}

export class ApiFactory {
  private baseApi: BaseApi;

  constructor(request: APIRequestContext, baseURL: string) {
    this.baseApi = new BaseApi(request, baseURL);
  }

  get auth(): AuthApi {
    return new AuthApi(this.baseApi.request, this.baseApi.baseURL);
  }

  get users(): UsersApi {
    return new UsersApi(this.baseApi.request, this.baseApi.baseURL);
  }

  get todos(): TodosApi {
    return new TodosApi(this.baseApi.request, this.baseApi.baseURL);
  }

  get base(): BaseApi {
    return this.baseApi;
  }
}

export const createApiFactory = (request: APIRequestContext, baseURL: string): IApiFactory => {
  const factory = new ApiFactory(request, baseURL);
  return {
    auth: factory.auth,
    users: factory.users,
    todos: factory.todos,
    base: factory.base,
  };
};

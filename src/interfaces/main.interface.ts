import { AxiosInstance, AxiosRequestConfig as ModifiedAxiosRequestConfig } from 'axios';

import { ReactNode } from 'react';

declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Options> {
    handled?: boolean;
  }
}

type HandleErrorsBy = string;
type HandleErrorsWith = Record<string | number, string>;
export type ErrorHandler = ((errorMessage: string) => void) | null;
export interface Options {
  isLoadingBlocked: boolean;
  isErrorHandlerBlocked: boolean;
  handleErrorsBy: HandleErrorsBy;
  handleErrorsWith: HandleErrorsWith;
}

export type Service = {
  [key: string]: (axios: AxiosInstance, ...params: any) => any;
};

export interface Services {
  [key: string]: Service;
}

export type OptionsOfServices<T extends string | number | symbol> = Record<
  T,
  Options & ModifiedAxiosRequestConfig
>;

export interface State {
  services: Services;
  options: OptionsOfServices<string>;
  isLoading: boolean;
  errorHandler: ErrorHandler;
}
export interface ContextProps<T extends State['services']> {
  services: T;
  options: OptionsOfServices<keyof T>;
  errorHandler: State['errorHandler'];
  children: ReactNode;
}

type Tail<K extends unknown[]> = K extends [AxiosInstance, ...infer Rest] ? Rest : K;

export type HookProps = Partial<ModifiedAxiosRequestConfig>;
export interface HookReturn<T extends Services> {
  services: {
    [firstKey in keyof T]: {
      [secondKey in keyof T[firstKey]]: (
        ...params: Tail<Parameters<T[firstKey][secondKey]>>
      ) => ReturnType<T[firstKey][secondKey]>;
    };
  };
}

export type Action =
  | {
      type: 'SET_IS_LOADING';
      payload: boolean;
    }
  | {
      type: 'SET_ERROR_HANDLER';
      payload: State['errorHandler'];
    };

export interface AxiosContextValue extends State {
  setAxiosIsLoading: (isLoading: State['isLoading']) => void;
}

export type SetAxiosIsLoadingByCounter = (
  requestNumber: number,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
) => void;

export type ConfigureInterceptors = (
  axiosInstance: AxiosInstance,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
  errorHandlerParams: {
    errorHandler: ErrorHandler;
    errorHandlerOptions: ModifiedAxiosRequestConfig;
  },
) => void;

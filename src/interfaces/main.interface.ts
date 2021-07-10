import { AxiosInstance } from 'axios';

type HandleErrorsBy = string;
type HandleErrorsWith = Record<string, string>;
export type ErrorHandler = ((errorMessage: string) => void) | null;

export interface Options {
  isLoadingBlocked: boolean;
  isErrorHandlerBlocked: boolean;
  handleErrorsBy: HandleErrorsBy;
  handleErrorsWith: HandleErrorsWith;
  headers?: any;
}

export type Service = {
  [key: string]: (axios: AxiosInstance, ...params: any) => any;
};

export interface Services {
  [key: string]: Service;
}

declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Options> {
    handled?: boolean;
  }
}

export interface State {
  services: Services;
  isLoading: boolean;
  defaultOptions: Options;
  errorHandler: ErrorHandler;
}
export interface ContextProps {
  services: State['services'];
  errorHandler: State['errorHandler'];
  defaultOptions: State['defaultOptions'];
}

type Tail<K extends unknown[]> = K extends [AxiosInstance, ...infer Rest] ? Rest : K;

export type HookProps = Partial<State['defaultOptions']>;
export interface HookReturn<T extends Services> {
  axios: AxiosInstance;
  services: {
    [firstKey in keyof T]: {
      [secondKey in keyof T[keyof T]]: (
        ...params: Tail<Parameters<T[keyof T][keyof T[keyof T]]>>
      ) => ReturnType<T[keyof T][keyof T[keyof T]]>;
    };
  };
}

export type Action =
  | {
      type: 'SET_IS_LOADING';
      payload: boolean;
    }
  | {
      type: 'SET_DEFAULT_OPTIONS';
      payload: State['defaultOptions'];
    }
  | {
      type: 'SET_ERROR_HANDLER';
      payload: State['errorHandler'];
    }
  | {
      type: 'SET_HEADERS_OPTION';
      payload: State['defaultOptions']['headers'];
    };

export interface AxiosContextValue extends State {
  setAxiosIsLoading: (isLoading: State['isLoading']) => void;
  setAxiosDefaultOptions: (defaultOptions: State['defaultOptions']) => void;
  setErrorHandler: (errorHandler: State['errorHandler']) => void;
  setHeadersOption: (headers: State['defaultOptions']['headers']) => void;
}

export type SetAxiosIsLoadingByCounter = (
  requestNumber: number,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
) => void;

export type ConfigureInterceptors = (
  axiosInstance: AxiosInstance,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
  errorHandlerParams: {
    errorHandler: AxiosContextValue['errorHandler'];
    errorHandlerOptions: AxiosContextValue['defaultOptions'];
  },
) => void;

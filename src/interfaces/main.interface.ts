import { AxiosInstance } from 'axios';

type HandleErrorsBy = 'name' | 'status';
type HandleErrorsWith = Record<string, string>;
export type ErrorHandler = ((errorMessage: string) => void) | null;

export interface Options {
  isLoadingBlocked: boolean;
  isErrorHandlerBlocked: boolean;
  handleErrorsBy: HandleErrorsBy;
  handleErrorsWith: HandleErrorsWith;
  headers?: any;
}

declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Options> {
    handled?: boolean;
  }
}

export interface State {
  isLoading: boolean;
  defaultOptions: Options;
  errorHandler: ErrorHandler;
}
export interface ContextProps {
  errorHandler: State['errorHandler'];
  defaultOptions: State['defaultOptions'];
}

export type HookProps = Partial<State['defaultOptions']>;

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

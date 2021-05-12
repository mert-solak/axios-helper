import React from 'react';

import { AxiosInstance } from 'axios';

export interface Options {
  isLoadingBlocked: boolean;
}

declare module 'axios' {
  interface AxiosRequestConfig extends Options {}
}

export interface State {
  ProgressComponent: React.FunctionComponent;
  isLoading: boolean;
  defaultOptions: Options;
}
export interface ContextProps {
  ProgressComponent: State['ProgressComponent'];
  defaultOptions: State['defaultOptions'];
}

export interface HookProps {
  options?: State['defaultOptions'];
}

export type Action =
  | {
      type: 'SET_IS_LOADING';
      payload: boolean;
    }
  | {
      type: 'SET_AXIOS_PROGRESS_COMPONENT';
      payload: React.FunctionComponent;
    }
  | {
      type: 'SET_DEFAULT_OPTIONS';
      payload: State['defaultOptions'];
    };

export interface AxiosContextValue extends Omit<State, 'axiosConfigured'> {
  setProgressComponent: (ProgressComponentInstance: State['ProgressComponent']) => void;
  setAxiosIsLoading: (isLoading: State['isLoading']) => void;
  setAxiosDefaultOptions: (defaultOptions: State['defaultOptions']) => void;
}

export type SetAxiosIsLoadingByCounter = (
  requestNumber: number,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
) => void;

export type ConfigureInterceptors = (
  axiosInstance: AxiosInstance,
  setAxiosIsLoading: AxiosContextValue['setAxiosIsLoading'],
) => void;

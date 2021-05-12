import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { ConfigureInterceptors, SetAxiosIsLoadingByCounter } from '@interfaces/main.interface';

const setAxiosIsLoadingByCounter: SetAxiosIsLoadingByCounter = (requestNumber: number, setAxiosIsLoading) => {
  if (requestNumber < 1) {
    setAxiosIsLoading(false);
  } else {
    setAxiosIsLoading(true);
  }
};

export const configureInterceptors: ConfigureInterceptors = (axiosInstance, setAxiosIsLoading) => {
  let requestNumber = 0;
  let isLoadingBlocked = false;

  const requestOut = () => {
    if (!isLoadingBlocked) {
      requestNumber += 1;
      setAxiosIsLoadingByCounter(requestNumber, setAxiosIsLoading);
    }
  };
  const requestError = () => {
    if (!isLoadingBlocked) {
      requestNumber -= 1;
      setAxiosIsLoadingByCounter(requestNumber, setAxiosIsLoading);
    }
  };
  const responseSuccess = () => {
    if (!isLoadingBlocked) {
      requestNumber -= 1;
      setAxiosIsLoadingByCounter(requestNumber, setAxiosIsLoading);
    }
  };
  const responseError = () => {
    if (!isLoadingBlocked) {
      requestNumber -= 1;
      setAxiosIsLoadingByCounter(requestNumber, setAxiosIsLoading);
    }
  };

  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      isLoadingBlocked = config.isLoadingBlocked;

      requestOut();

      return config;
    },
    (error: AxiosError) => {
      requestError();

      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      responseSuccess();

      return response;
    },
    (error: AxiosError) => {
      responseError();

      return Promise.reject(error);
    },
  );
};

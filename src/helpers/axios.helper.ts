import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isDefined } from 'class-validator';

import { ConfigureInterceptors, SetAxiosIsLoadingByCounter } from '../interfaces/main.interface';

const setAxiosIsLoadingByCounter: SetAxiosIsLoadingByCounter = (requestNumber: number, setAxiosIsLoading) => {
  if (requestNumber < 1) {
    setAxiosIsLoading(false);
  } else {
    setAxiosIsLoading(true);
  }
};

export const configureInterceptors: ConfigureInterceptors = (
  axiosInstance,
  setAxiosIsLoading,
  errorHandlerParams,
) => {
  let requestNumber = 0;
  let isLoadingBlocked = false;

  const options = errorHandlerParams.errorHandlerOptions;
  const { errorHandler } = errorHandlerParams;

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
  const responseError = (error: AxiosError): AxiosError => {
    if (!isLoadingBlocked) {
      requestNumber -= 1;
      setAxiosIsLoadingByCounter(requestNumber, setAxiosIsLoading);
    }

    if (!options.isErrorHandlerBlocked && isDefined(errorHandler)) {
      const handleErrorsBy =
        error.response.data[options.handleErrorsBy] || error.response[options.handleErrorsBy];

      if (!isDefined(handleErrorsBy)) {
        return error;
      }

      const errorMessage = options.handleErrorsWith[handleErrorsBy];

      if (!isDefined(errorMessage)) {
        return error;
      }

      errorHandler(errorMessage);

      const newError = { ...error };
      newError.config.handled = true;

      return newError;
    }

    return error;
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
      const handledError = responseError(error);

      return Promise.reject(handledError);
    },
  );
};

import originalAxios from 'axios';

import { isDefined } from 'class-validator';
import { useContext } from 'react';

import { AxiosContext } from '../contexts/axios.context';
import { HookProps } from '../interfaces/main.interface';
import { configureInterceptors } from '../helpers/axios.helper';

export const useAxios = (options?: HookProps) => {
  const { setAxiosIsLoading, defaultOptions, errorHandler } = useContext(AxiosContext);

  let combinedOptions = { ...defaultOptions };
  if (isDefined(options)) {
    combinedOptions = { ...combinedOptions, ...options };
  }

  const axios = originalAxios.create({ ...combinedOptions, handled: false });
  configureInterceptors(axios, setAxiosIsLoading, {
    errorHandler,
    errorHandlerOptions: combinedOptions,
  });

  return axios;
};

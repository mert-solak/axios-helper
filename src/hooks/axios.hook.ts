import originalAxios from 'axios';

import { isDefined } from 'class-validator';
import { useContext } from 'react';

import { AxiosContext } from '@contexts/axios.context';
import { HookProps } from '@interfaces/main.interface';
import { configureInterceptors } from '@helpers/axios.helper';

export const useAxios = (props?: HookProps) => {
  const { setAxiosIsLoading, defaultOptions } = useContext(AxiosContext);

  let combinedOptions = { ...defaultOptions };
  if (isDefined(props) && isDefined(props.options)) {
    combinedOptions = { ...combinedOptions, ...props.options };
  }

  const axios = originalAxios.create(combinedOptions);
  configureInterceptors(axios, setAxiosIsLoading);

  return axios;
};

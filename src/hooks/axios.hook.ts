import originalAxios from 'axios';

import { isDefined } from 'class-validator';
import { useContext } from 'react';

import { AxiosContext } from '../contexts/axios.context';
import { HookProps, HookReturn, Services } from '../interfaces/main.interface';
import { configureInterceptors } from '../helpers/axios.helper';

export const useAxios = <T extends Services>(options?: HookProps): HookReturn<T> => {
  const { setAxiosIsLoading, defaultOptions, errorHandler, services } = useContext(AxiosContext);

  let combinedOptions = { ...defaultOptions };
  if (isDefined(options)) {
    combinedOptions = { ...combinedOptions, ...options };
  }

  const axios = originalAxios.create({ ...combinedOptions, handled: false });
  configureInterceptors(axios, setAxiosIsLoading, {
    errorHandler,
    errorHandlerOptions: combinedOptions,
  });

  const servicesWithAxios: HookReturn<T>['services'] = { ...services } as HookReturn<T>['services'];

  (Object.keys(services) as Array<keyof T>).forEach((service) => {
    (Object.keys(services[service as string]) as Array<keyof T[keyof T]>).forEach((serviceMethod) => {
      servicesWithAxios[service][serviceMethod] = services[service as string][serviceMethod as string].bind(
        null,
        axios,
      );
    });
  });

  return { axios, services: servicesWithAxios };
};

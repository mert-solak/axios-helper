import originalAxios from 'axios';
import { isNil, merge } from 'lodash';

import { useContext, useMemo } from 'react';

import { AxiosContext } from '../contexts/axios.context';
import { HookProps, HookReturn, Options, Services } from '../interfaces/main.interface';
import { configureInterceptors } from '../helpers/axios.helper';

export const useAxios = <T extends Services>(newOptions?: HookProps): HookReturn<T> => {
  const { setAxiosIsLoading, options, errorHandler, services } = useContext(AxiosContext);

  const servicesWithAxios = useMemo(() => {
    const newServicesWithAxios: HookReturn<T>['services'] = { ...services } as HookReturn<T>['services'];

    (Object.keys(services) as Array<keyof T>).forEach((service) => {
      (Object.keys(services[service as string]) as Array<keyof T[keyof T]>).forEach((serviceMethod) => {
        let combinedOptions: Options;

        if (!isNil(options[service as string])) {
          merge(combinedOptions, options[service as string]);
        }

        if (!isNil(options[service as string])) {
          merge(combinedOptions, newOptions);
        }

        const axios = originalAxios.create({ ...combinedOptions, handled: false });
        configureInterceptors(axios, setAxiosIsLoading, {
          errorHandler,
          errorHandlerOptions: combinedOptions,
        });

        newServicesWithAxios[service][serviceMethod] = services[service as string][
          serviceMethod as string
        ].bind(null, axios);
      });
    });

    return newServicesWithAxios;
  }, [newOptions]);

  return { services: servicesWithAxios };
};

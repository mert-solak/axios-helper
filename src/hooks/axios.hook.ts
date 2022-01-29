import originalAxios from 'axios';
import { isNil, merge } from 'lodash';

import { useContext, useMemo } from 'react';

import { AxiosContext } from '../contexts/axios.context';
import { HookProps, HookReturn, Options, Services } from '../interfaces/main.interface';
import { configureInterceptors } from '../helpers/axios.helper';

export const useAxios = <T extends Services>(newOptions?: HookProps): HookReturn<T> => {
  const { setAxiosIsLoading, options, errorHandler, services } = useContext(AxiosContext);

  const servicesWithAxios = useMemo(() => {
    const newServicesWithAxios = {};

    (Object.keys(services) as Array<keyof T>).forEach((service) => {
      newServicesWithAxios[service as string] = {};
      (Object.keys(services[service as string]) as Array<keyof T[keyof T]>).forEach((serviceMethod) => {
        const combinedOptions: Options = { ...options[service as string] };

        if (!isNil(newOptions)) {
          merge(combinedOptions, newOptions);
        }

        const axios = originalAxios.create({ ...combinedOptions, handled: false });
        configureInterceptors(axios, setAxiosIsLoading, {
          errorHandler,
          errorHandlerOptions: combinedOptions,
        });

        newServicesWithAxios[service as string][serviceMethod] = services[service as string][
          serviceMethod as string
        ].bind(null, axios);
      });
    });

    return newServicesWithAxios as HookReturn<T>['services'];
  }, [newOptions]);

  return { services: servicesWithAxios };
};

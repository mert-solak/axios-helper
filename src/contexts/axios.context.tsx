import React, { createContext, useCallback, useMemo, useReducer } from 'react';

import { ContextProps, Action, State, AxiosContextValue, Services } from '../interfaces/main.interface';

const initialState: State = {
  services: {},
  options: {},
  isLoading: false,
  errorHandler: null,
};

const axiosContextValue: AxiosContextValue = {
  ...initialState,
  setAxiosIsLoading: () => {},
};

export const AxiosContext = createContext(axiosContextValue);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

export const AxiosProvider = <T extends Services>({
  children,
  errorHandler,
  services,
  options,
}: ContextProps<T>) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    errorHandler,
    services,
    options,
  });

  const setAxiosIsLoading = useCallback((isLoading?: State['isLoading']) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  }, []);

  const { isLoading } = state;

  const provider = useMemo(
    () => <AxiosContext.Provider value={{ ...state, setAxiosIsLoading }}>{children}</AxiosContext.Provider>,
    [isLoading],
  );

  return <>{provider}</>;
};

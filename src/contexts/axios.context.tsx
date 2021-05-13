import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import { ContextProps, Action, State, AxiosContextValue } from '../interfaces/main.interface';

const initialState: State = {
  isLoading: false,
  defaultOptions: {
    isLoadingBlocked: true,
  },
};

const axiosContextValue: AxiosContextValue = {
  ...initialState,
  setAxiosIsLoading: () => {},
  setAxiosDefaultOptions: () => {},
};

export const AxiosContext = createContext(axiosContextValue);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_DEFAULT_OPTIONS':
      return { ...state, defaultOptions: { ...action.payload } };

    default:
      return state;
  }
};

export const AxiosProvider: React.FC<ContextProps> = ({ children, defaultOptions }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    defaultOptions,
  });

  const setAxiosIsLoading = useCallback((isLoading?: State['isLoading']) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  }, []);
  const setAxiosDefaultOptions = useCallback((newDefaultOptions?: State['defaultOptions']) => {
    dispatch({ type: 'SET_DEFAULT_OPTIONS', payload: newDefaultOptions });
  }, []);

  useEffect(() => {
    setAxiosDefaultOptions(defaultOptions);
  }, [defaultOptions]);

  const { isLoading } = state;

  const provider = useMemo(
    () => (
      <AxiosContext.Provider value={{ ...state, setAxiosIsLoading, setAxiosDefaultOptions }}>
        {children}
      </AxiosContext.Provider>
    ),
    [isLoading],
  );

  return <>{provider}</>;
};

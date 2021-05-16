import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import { ContextProps, Action, State, AxiosContextValue } from '../interfaces/main.interface';

const initialState: State = {
  isLoading: false,
  errorHandler: null,
  defaultOptions: {
    isLoadingBlocked: true,
    isErrorHandlerBlocked: true,
    handleErrorsBy: 'status',
    handleErrorsWith: {},
  },
};

const axiosContextValue: AxiosContextValue = {
  ...initialState,
  setAxiosIsLoading: () => {},
  setAxiosDefaultOptions: () => {},
  setErrorHandler: () => {},
};

export const AxiosContext = createContext(axiosContextValue);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_DEFAULT_OPTIONS':
      return { ...state, defaultOptions: { ...action.payload } };

    case 'SET_ERROR_HANDLER':
      return { ...state, errorHandler: action.payload };

    default:
      return state;
  }
};

export const AxiosProvider: React.FC<ContextProps> = ({ children, defaultOptions, errorHandler }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    defaultOptions,
    errorHandler,
  });

  const setAxiosIsLoading = useCallback((isLoading?: State['isLoading']) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  }, []);
  const setAxiosDefaultOptions = useCallback((newDefaultOptions?: State['defaultOptions']) => {
    dispatch({ type: 'SET_DEFAULT_OPTIONS', payload: newDefaultOptions });
  }, []);
  const setErrorHandler = useCallback((newErrorHandler?: State['errorHandler']) => {
    dispatch({ type: 'SET_ERROR_HANDLER', payload: newErrorHandler });
  }, []);

  useEffect(() => {
    setAxiosDefaultOptions(defaultOptions);
  }, [defaultOptions]);
  useEffect(() => {
    setErrorHandler(errorHandler);
  }, [errorHandler]);

  const { isLoading } = state;

  const provider = useMemo(
    () => (
      <AxiosContext.Provider value={{ ...state, setAxiosIsLoading, setAxiosDefaultOptions, setErrorHandler }}>
        {children}
      </AxiosContext.Provider>
    ),
    [isLoading],
  );

  return <>{provider}</>;
};

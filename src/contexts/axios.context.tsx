import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import { ContextProps, Action, State, AxiosContextValue } from '@interfaces/main.interface';

const initialState: State = {
  ProgressComponent: null,
  isLoading: false,
  defaultOptions: {
    isLoadingBlocked: true,
  },
};

const axiosContextValue: AxiosContextValue = {
  ...initialState,
  setProgressComponent: () => {},
  setAxiosIsLoading: () => {},
  setAxiosDefaultOptions: () => {},
};

export const AxiosContext = createContext(axiosContextValue);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_AXIOS_PROGRESS_COMPONENT':
      return { ...state, ProgressComponent: action.payload };

    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_DEFAULT_OPTIONS':
      return { ...state, defaultOptions: { ...action.payload } };

    default:
      return state;
  }
};

export const AxiosProvider: React.FC<ContextProps> = ({ children, ProgressComponent, defaultOptions }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ProgressComponent,
    defaultOptions,
  });

  const setProgressComponent = useCallback((ProgressComponentInstance: State['ProgressComponent']) => {
    dispatch({ type: 'SET_AXIOS_PROGRESS_COMPONENT', payload: ProgressComponentInstance });
  }, []);
  const setAxiosIsLoading = useCallback((isLoading?: State['isLoading']) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  }, []);
  const setAxiosDefaultOptions = useCallback((newDefaultOptions?: State['defaultOptions']) => {
    dispatch({ type: 'SET_DEFAULT_OPTIONS', payload: newDefaultOptions });
  }, []);

  useEffect(() => {
    setProgressComponent(ProgressComponent);
  }, [ProgressComponent]);
  useEffect(() => {
    setAxiosDefaultOptions(defaultOptions);
  }, [defaultOptions]);

  const { ProgressComponent: CurrentProgressComponent, isLoading } = state;

  const provider = useMemo(
    () => (
      <AxiosContext.Provider
        value={{ ...state, setProgressComponent, setAxiosIsLoading, setAxiosDefaultOptions }}
      >
        {children}
        {state.isLoading && <CurrentProgressComponent />}
      </AxiosContext.Provider>
    ),
    [isLoading],
  );

  return <>{provider}</>;
};

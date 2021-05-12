import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import { ContextProps, Action, State, AxiosContextValue } from '@interfaces/main.interface';

const initialState: State = {
  AxiosProgressComponent: null,
  isLoading: false,
  defaultOptions: {
    isLoadingBlocked: true,
  },
};

const axiosContextValue: AxiosContextValue = {
  ...initialState,
  setAxiosProgressComponent: () => {},
  setAxiosIsLoading: () => {},
  setAxiosDefaultOptions: () => {},
};

export const AxiosContext = createContext(axiosContextValue);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_AXIOS_PROGRESS_COMPONENT':
      return { ...state, AxiosProgressComponent: action.payload };

    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_DEFAULT_OPTIONS':
      return { ...state, defaultOptions: { ...action.payload } };

    default:
      return state;
  }
};

export const AxiosProvider: React.FC<ContextProps> = ({
  children,
  AxiosProgressComponent,
  defaultOptions,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    AxiosProgressComponent,
    defaultOptions,
  });

  const setAxiosProgressComponent = useCallback(
    (AxiosProgressComponentInstance: State['AxiosProgressComponent']) => {
      dispatch({ type: 'SET_AXIOS_PROGRESS_COMPONENT', payload: AxiosProgressComponentInstance });
    },
    [],
  );
  const setAxiosIsLoading = useCallback((isLoading?: State['isLoading']) => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading });
  }, []);
  const setAxiosDefaultOptions = useCallback((newDefaultOptions?: State['defaultOptions']) => {
    dispatch({ type: 'SET_DEFAULT_OPTIONS', payload: newDefaultOptions });
  }, []);

  useEffect(() => {
    setAxiosProgressComponent(AxiosProgressComponent);
  }, [AxiosProgressComponent]);
  useEffect(() => {
    setAxiosDefaultOptions(defaultOptions);
  }, [defaultOptions]);

  const { AxiosProgressComponent: CurrentAxiosProgressComponent, isLoading } = state;

  const provider = useMemo(
    () => (
      <AxiosContext.Provider
        value={{ ...state, setAxiosProgressComponent, setAxiosIsLoading, setAxiosDefaultOptions }}
      >
        {children}
        {state.isLoading && <CurrentAxiosProgressComponent />}
      </AxiosContext.Provider>
    ),
    [isLoading],
  );

  return <>{provider}</>;
};

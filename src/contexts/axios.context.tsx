import axios from 'axios';
import { createContext } from 'react';

export const AxiosContext = createContext({ axios });

export const AxiosProvider: React.FC<Props> = () => {
  return <AxiosContext.Provider>{children}</AxiosContext.Provider>;
};

## Axios Helper

Developed for easy integration of progress spinner and error handler into axios.

![npm](https://img.shields.io/npm/v/@mertsolak/axios-helper)
![license](https://img.shields.io/npm/l/@mertsolak/axios-helper)
![size](https://img.shields.io/bundlephobia/min/@mertsolak/axios-helper)
![issue](https://img.shields.io/github/issues/mert-solak/axios-helper)

## Installation

Use node package manager to install @mertsolak/axios-helper.

```bash
npm i @mertsolak/axios-helper
```

## Basic Usage

```typescript
// dataService.ts

// First parameter must be axios for all services.
const getData = (axios, ...otherParams) => {
  return axios.get('url');
};

export default {
  getData,
};
```

Initialize it in the root component.

```typescript
// Root.tsx
import { AxiosProvider, OptionsOfServices } from '@mertsolak/axios-helper';

import dataService from './dataService';

import App from './App';

export const services = {
  dataService,
};

const options: OptionsOfServices<keyof typeof services> = {
  dataService: {
    headers: { Authorization: 'token' },
    isLoadingBlocked: false,
    isErrorHandlerBlocked: false,
    handleErrorsBy: 'status',
    handleErrorsWith: { '404': 'not found' }, // format must be {[status]: 'error message'} and depends on the handleErrorsBy option
  },
};

const errorHandler = (errorMessage) => {
  // Globally handle error message in here.
  // console.log(errorMessage);
  // alert(errorMessage);
};

const Root = () => {
  return (
    <AxiosProvider services={services} options={options} errorHandler={errorHandler}>
      <App />
    </AxiosProvider>
  );
};

export default Root;
```

Place your progress spinner in a suitable component.

```typescript
// App.tsx

import { useContext } from 'react';

import { AxiosContext } from '@mertsolak/axios-helper';

import HomePage from './HomePage';

const ProgressSpinner = () => <p>Progress Spinner</p>;

const App = () => {
  const { isLoading } = useContext(AxiosContext);

  return (
    <div>
      <HomePage />
      {isLoading && <ProgressSpinner />}
    </div>
  );
};

export default App;
```

Use axios everywhere.

```typescript
// HomePage.tsx

import { useEffect } from 'react';

import { useAxios } from '@mertsolak/axios-helper';

import services from './Root.tsx';

const HomePage = () => {
  const { axios: axios1 } = useAxios({ isLoadingBlocked: true, isErrorHandlerBlocked: true }); // progress spinner and global error handler blocked
  const { axios: axios2 } = useAxios({ isLoadingBlocked: false, isErrorHandlerBlocked: false }); // progress spinner and global error handler not blocked
  const { axios: axios3 } = useAxios({ headers: { Authorization: 'token' } }); // uses default options with additional headers
  const { axios: axios4 } = useAxios(); // uses default options in root.tsx, progress spinner and global error handler not blocked

  // or services can be imported with configured axios.
  const {
    services: { dataService },
  } = useAxios<typeof services>();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios1.get(url);
        const { data } = await axios2.get(url);
        const { data } = await axios3.get(url);
        const { data } = await axios4.get(url);

        const { data } = dataService.getData();
      } catch (error) {
        if (!error?.config?.handled) {
          // you can handle the errors that is not handled by the global error handler in here.
        }
      }
    };
    getData();
  }, []);

  return <p>Home Page</p>;
};

export default HomePage;
```

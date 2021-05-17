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

Initialize it in the root component.

```typescript
// Root.tsx

import { AxiosProvider } from '@mertsolak/axios-helper';

import App from './App';

const defaultOptions = {
  isLoadingBlocked: false,
  isErrorHandlerBlocked: false,
  handleErrorsBy: 'status', // can be 'status' or 'name'
  handleErrorsWith: { '404': 'not found' }, // format must be {[status]: 'error message'} or {[name]: 'error message'} depends on the handleErrorsBy option
};

const errorHandler = (errorMessage) => {
  // Globally handle error message in here.
  // console.log(errorMessage);
  // alert(errorMessage);
};

const Root = () => {
  return (
    <AxiosProvider defaultOptions={defaultOptions} errorHandler={errorHandler}>
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

const HomePage = () => {
  const axios1 = useAxios({ isLoadingBlocked: true, isErrorHandlerBlocked: true }); // progress spinner and global error handler blocked
  const axios2 = useAxios({ isLoadingBlocked: false, isErrorHandlerBlocked: false }); // progress spinner and global error handler not blocked
  const axios3 = useAxios(); // uses default options in root.tsx, progress spinner and global error handler not blocked

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios1.get(url);
        const { data } = await axios2.get(url);
        const { data } = await axios3.get(url);
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

## Additional

defaultOptions and errorHandler can be updated in everywhere.

```typescript
// SomeOtherComponent.tsx

import { useContext, useEffect } from 'react';

import { AxiosContext } from '@mertsolak/axios-helper';

const updatedDefaultOptions = {
  isLoadingBlocked: false,
  isErrorHandlerBlocked: false,
  handleErrorsBy: 'name',
  handleErrorsWith: { NOT_FOUND: 'not found' },
};

const updatedErrorHandler = (errorMessage) => {
  console.log(errorMessage);
};

const SomeOtherComponent = () => {
  const { setAxiosDefaultOptions, setErrorHandler } = useContext(AxiosContext);

  useEffect(() => {
    setAxiosDefaultOptions(updatedDefaultOptions);
    setErrorHandler(updatedErrorHandler);
  }, []);

  return <p>Some Other Component</p>;
};

export default SomeOtherComponent;
```

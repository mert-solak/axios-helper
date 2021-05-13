## Axios Helper

Developed for easy integration of progress spinners into axios.

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

export const defaultOptions = {
  isLoadingBlocked: false,
};

const Root = () => {
  return (
    <AxiosProvider defaultOptions={defaultOptions}>
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
  const axios1 = useAxios({ isLoadingBlocked: true }); // progress spinner blocked
  const axios2 = useAxios({ isLoadingBlocked: false }); // progress spinner not blocked
  const axios3 = useAxios(); // uses default options in root.tsx, progress spinner not blocked

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios1.get(url);
      const { data } = await axios2.get(url);
      const { data } = await axios3.get(url);
    };
    getData();
  }, []);

  return <p>Home Page</p>;
};

export default HomePage;
```

## Additional

defaultOptions can be updated in everywhere.

```typescript
// SomeOtherComponent.tsx

import { useContext, useEffect } from 'react';

import { AxiosContext } from '@mertsolak/axios-helper';

export const updatedDefaultOptions = {
  isLoadingBlocked: false,
};

const SomeOtherComponent = () => {
  const { setAxiosDefaultOptions } = useContext(AxiosContext);

  useEffect(() => {
    setAxiosDefaultOptions(updatedDefaultOptions);
  }, []);

  return <p>Some Other Component</p>;
};

export default SomeOtherComponent;
```

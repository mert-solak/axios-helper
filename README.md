![npm](https://img.shields.io/npm/v/@mertsolak/axios-helper)
![license](https://img.shields.io/npm/l/@mertsolak/axios-helper)
![size](https://img.shields.io/bundlephobia/min/@mertsolak/axios-helper)
![issue](https://img.shields.io/github/issues/mert-solak/axios-helper)

## Installation

Use node package manager to install @mertsolak/axios-helper

```bash
npm i @mertsolak/axios-helper
```

## Basic Usage

Initialize it in the root component

```typescript
// Root.tsx

import { AxiosProvider } from '@mertsolak/axios-helper';

export const defaultOptions = {
  isLoadingBlocked: false,
};

// Component should be pre-styled.
const ProgressSpinner = () => <p>Progress Spinner</p>;

const Root = () => {
  return (
    <AxiosProvider ProgressComponent={ProgressSpinner} defaultOptions={defaultOptions}>
      <App />
    </AxiosProvider>
  );
};
```

Use it everywhere

```typescript
// HomePage.tsx

import { useEffect } from 'react';

import { useAxios } from '@mertsolak/axios-helper';

const HomePage = () => {
  const axios1 = useAxios({ isLoadingBlocked: true }); // progress spinner blocked
  const axios2 = useAxios({ isLoadingBlocked: false }); // progress spinner not blocked
  const axios3 = useAxios(); // uses default options in root.tsx, progress not blocked

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
```

## Additional

defaultOptions and progressComponent can be updated in everywhere.

```typescript
// HomePage.tsx

import { useContext, useEffect } from 'react';

import { AxiosContext } from '@mertsolak/axios-helper';

export const updatedDefaultOptions = {
  isLoadingBlocked: false,
};

const AnotherProgressSpinner = () => <p>Another Progress Spinner</p>;

const SomeOtherComponent = () => {
  const { setProgressComponent, setAxiosDefaultOptions } = useContext(AxiosContext);

  useEffect(() => {
    setProgressComponent(AnotherProgressSpinner);
    setAxiosDefaultOptions(updatedDefaultOptions);
  }, []);

  return <p>Some Other Component</p>;
};
```

# simple-use-form

> Simple form state management for React forms

[![NPM](https://img.shields.io/npm/v/simple-use-form.svg)](https://www.npmjs.com/package/simple-use-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save simple-use-form
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'simple-use-form'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [jack-dunleavy](https://github.com/jack-dunleavy)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).

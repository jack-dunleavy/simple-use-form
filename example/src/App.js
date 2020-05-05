import React from 'react'

import { useMyHook } from 'simple-use-form'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App

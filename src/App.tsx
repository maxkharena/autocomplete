// Absolute imports
import { useState } from 'react';

// Components
import Autocomplete from './Autocomplete';

// Api
import fetchFruits from './api';

function App() {
  const [value, setValue] = useState('');

  return (
    <main>
      <h3>Controlled Autocomplite with fruit API</h3>
      <Autocomplete
        value={value}
        request={fetchFruits}
        onChange={(value: string) => setValue(value)}
      />
    </main>
  )
}

export default App

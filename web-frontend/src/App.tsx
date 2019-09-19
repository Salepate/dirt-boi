import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MainGame from './components/main-game';
import { rootReducer } from './redux/game-store';

const store = createStore(rootReducer)

const App: React.FC = () => {
  return <Provider store={store}>
    <MainGame/>
  </Provider>
  
}

export default App;

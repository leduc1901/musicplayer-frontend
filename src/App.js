import React from 'react';
import './App.css';
import Login from "./components/Login"
import User from "./components/User"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // or whatever storage you are using
import { PersistGate } from 'redux-persist/es/integration/react';
import {createStore} from 'redux';
import Reducer from "./reducers"
import {Provider} from 'react-redux';
import { BrowserRouter , Route , Switch, Link } from "react-router-dom"
import Player from "./components/Player"


const persistConfig = {
  key: 'root',
  storage,
  // whitelist: [                    
  //   'accountReducer'
  // ],
  blacklist: [
    // 'late'
  ]
}

const persistedReducer = persistReducer(persistConfig, Reducer)

let store = createStore(persistedReducer);
let persistor = persistStore(store)




function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
                <Switch>
                  <Route path="/" exact component={Login} ></Route>
                  <Route path="/player" exact component={Player} ></Route>
                  <Route path="/user" exact component={User} ></Route>
                </Switch>
          </BrowserRouter>    
      </PersistGate>
    </Provider>
  );
}

export default App;

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
import { BrowserRouter , Route , Switch} from "react-router-dom"
import Player from "./components/Player"
import  AllUser from './components/AllUser';
import AllSong from "./components/AllSong";
import AllSinger from "./components/AllSinger"
import NewSong from "./components/NewSong"
import NewSinger from "./components/NewSinger"
import Categories from "./components/Categories"
import NewCategory  from './components/NewCategory';
import  EditUser  from './components/EditUser';

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
                  <Route path="/user"  exact component={User} ></Route>
                  <Route path="/all-users" exact component={AllUser} ></Route>
                  <Route path="/all-singers" exact component={AllSinger} ></Route>
                  <Route path="/all-songs" exact component={AllSong} ></Route>
                  <Route path="/new-song" exact component={NewSong} ></Route>
                  <Route path="/new-singer" exact component={NewSinger} ></Route>
                  <Route path="/categories" exact component={Categories} ></Route>
                  <Route path="/new-category" exact component={NewCategory} ></Route>
                  <Route path="/edit-user/:id"  exact component={EditUser} ></Route>
                </Switch>
          </BrowserRouter>    
      </PersistGate>
    </Provider>
  );
}

export default App;

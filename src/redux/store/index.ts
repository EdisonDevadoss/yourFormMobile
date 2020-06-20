import AsyncStorage from '@react-native-community/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const persistConfig = {
  blacklist: ['form'],
  key: 'root',
  storage: AsyncStorage,
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = applyMiddleware(thunk);
const store = createStore(rootReducer, middleware);
// const persistor = persistStore(store);

export {store};
export default store;

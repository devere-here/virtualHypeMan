import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import motivationalWords from './motivationalWords';
import dictionary from './dictionary';
import toDoList from './toDoList';
import dinosaur from './dinosaur';




const reducer = combineReducers({motivationalWords, dictionary, toDoList, dinosaur})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
//export * from './user'
export * from './motivationalWords';
export * from './dictionary';
export * from './toDoList';
export * from './dinosaur';



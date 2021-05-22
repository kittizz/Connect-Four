// import { createGlobalState } from "speedux"

import { state } from "./state"
import { Store } from "redux"
import { reducer } from "./reducer"

import redux from "redux/dist/redux.js"

export default <Store>redux.createStore(reducer, state)

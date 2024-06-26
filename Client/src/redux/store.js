import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "./userslice.js"
export const store = configureStore({
  reducer: {
    user : UserReducer
  },
})
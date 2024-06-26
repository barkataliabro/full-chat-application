import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id : "",
  name : "",
  email : "",
  profilePic : "",
  token : "",
  onlineuser : [],
  socketconnection : null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser : (state, action) => {
        state._id = action.payload._id,
        state.name = action.payload.name,
        state.email = action.payload.email,
        state.profilePic = action.payload.profilePic
    },

    setToken : (state, action) => {
        state.token = action.payload
    },

    logout : (state, action) => {
        state.token = "",
        state._id = "",
        state.name = "",
        state.email = "",
        state.profilePic = "",
        state.socketconnection = null
    },
    setonlineuser : (state, action) => {
      state.onlineuser = action.payload
    },
    setsocketconnection : (state, action) => {
      state.socketconnection = action.payload
    }

  },
})

export const {setUser, setToken, logout, setonlineuser, setsocketconnection  } = userSlice.actions

export default userSlice.reducer
import { createSlice } from '@reduxjs/toolkit';
import appApi from '../services/appApi'; 

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    newMessages: {}, 
  },
  reducers: {
    addNotification: (state, { payload }) => {
      if (state.newMessages[payload]) {
        state.newMessages[payload] += 1;
      } else {
        state.newMessages[payload] = 1;
      }
    },
    resetNotification: (state, { payload }) => {
      delete state.newMessages[payload];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => {
      return payload;
    });

    builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
      return payload;
    });

    builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
  },
});

export const { addNotification, resetNotification } = userSlice.actions;

export default userSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import pinsSlice from './features/pins/pinsSlice';

export default configureStore({
  reducer: {
    pins: pinsSlice
  },
});
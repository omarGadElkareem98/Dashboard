import { configureStore } from '@reduxjs/toolkit';
import baseUrlReducer from './baseUrlSlice';

const store = configureStore({
    reducer: {
        baseUrl: baseUrlReducer,
        // other reducers...
    },
});

export default store;
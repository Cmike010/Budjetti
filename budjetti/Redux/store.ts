import { configureStore } from "@reduxjs/toolkit";
import  budjettiReducer  from './budjettiSlice';

export const store = configureStore({

    reducer : {
        budjetit : budjettiReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
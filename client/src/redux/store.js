import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./loaderSlice";
import logoutSlice from "./logoutSlice";

const store = configureStore({
    reducer: {
        loader: loaderSlice,
        logout: logoutSlice
    },
});

export default store;
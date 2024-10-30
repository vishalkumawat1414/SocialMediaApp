import { configureStore } from "@reduxjs/toolkit";
import appConfigSlice from "./slices/appConfigSlice";
import postsSlice from './slices/postsSlice'
import feedSlice from "./slices/feedSlice";
export default configureStore({
	reducer: {
		appConfigReducer: appConfigSlice,
		postReducer:postsSlice,
		feedDataReducer:feedSlice
	},
});

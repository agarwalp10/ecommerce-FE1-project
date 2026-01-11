// src/store/hooks.ts

// Custom typed hooks for Redux store
// hooks to use throughout the app for dispatching actions and selecting state
// typed versions for TypeScript support
// improves type safety and developer experience

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
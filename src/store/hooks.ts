import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Use these instead of plain useDispatch/useSelector so state and actions are typed.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

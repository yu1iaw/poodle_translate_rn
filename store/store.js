import { configureStore } from '@reduxjs/toolkit'
import historySlice from './historySlice'
import savedItemsSlice from './savedItemsSlice'

const store = configureStore({
  reducer: {
    history: historySlice,
    savedItems: savedItemsSlice
  }
})

export default store
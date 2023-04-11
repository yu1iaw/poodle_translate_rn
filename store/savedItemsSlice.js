import {createSlice} from "@reduxjs/toolkit";


const savedItemsSlice = createSlice({
    name: 'savedItems',
    initialState: {
        items: []
    },
    reducers: {
        setSavedItems: (state, action) => {
          state.items = action.payload.items;
            // console.log(state.items)
        },
        clearSavedItems: (state) => {
            state.items = [];
        }
    }
});

export const {setSavedItems, clearSavedItems} = savedItemsSlice.actions;
export default savedItemsSlice.reducer;
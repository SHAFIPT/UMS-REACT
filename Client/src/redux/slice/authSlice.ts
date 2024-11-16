import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email : null,
};

const usereSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUser(state , action) {
            state.email = action.payload.email;
        },
        clearUser(state){
            state.email = null
        }
    }
})

export const {setUser, clearUser} = usereSlice.actions

export default usereSlice.reducer
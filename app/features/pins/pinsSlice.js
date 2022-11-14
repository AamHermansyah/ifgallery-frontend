import { createSlice } from "@reduxjs/toolkit";


export const pinsSlice = createSlice({
    name: 'pins',
    initialState: null,
    reducers: {
        addPins: (state, action) => {
            return [...action.payload]
        },
        replacePin: (state, action) => {
            const currentState = state.map(pin => {
                if(action.payload._id === pin._id){
                    return {
                        _id: action.payload._id,
                        image_url: action.payload.image_url,
                        title: action.payload.title,
                        destination: action.payload.destination,
                        posted_by: {
                            ...pin.posted_by
                        },
                        save: action.payload.save
                    }
                }

                return pin
            })

            return [...currentState]
        },
        deletePin: (state, action) => {
            const currentState = state.filter(pin => pin._id !== action.payload);
            return [...currentState];
        }
    }
})

export const { addPins, replacePin, deletePin } = pinsSlice.actions;

export default pinsSlice.reducer
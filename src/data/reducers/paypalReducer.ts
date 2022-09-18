import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import PaypalData from "../../domain/entity/model/PaypalData";

export const payWithPaypal = createAsyncThunk(
    'paypal/payWithPaypal',
    async (action: {amount: number}): Promise<number> => {
        return 0
    }
)

const initialState: PaypalData = {
    paymentUrl: "",
    paymentLoading: false,
    paymentReferenceID: "",
    paymentStatus: "",
    paymentId: "",
    paymentSuccess: false,
    stateRequest: 0,
    error: null
}

export const paypalSlicer = createSlice({
    name: "account",
    initialState,
    reducers: {

    },
})

export default paypalSlicer.reducer


import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Abi from "../../domain/entity/abiDto";
import AbiRepository from "../../domain/repository/web/AbiRepository";
import AbiData from "../../domain/entity/model/AbiData";

export const getAbiById = createAsyncThunk(
    'abi/get',
    async (action: {abiId: String}): Promise<Abi> => {
        const abi = await new AbiRepository().getAbiByID(action.abiId)
        return abi;
    }
)

const initialState: AbiData = {
    abi: {contractName: "", contract: [], _id: ""},
    stateRequest: 0,
    error: null
}
// const initialState: CurrencyData = {
//     contracts: {
//         _id: "",
//         abiId: "",
//         contractAccount: "",
//         deployData: {contract: {name: ""}, token: {name: "", symbol: "", area: []}}
//     },
//     contractAbi: {
//         _id: "",
//         contract: [],
//         contractName: ""
//     },
//     stateRequest: 0,
//     error: null
// }

export const abiSlice = createSlice({
    name: "abi",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getAbiById.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.abi = action.payload
        })
        builder.addCase(getAbiById.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getAbiById.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })
    }
})

export default abiSlice.reducer
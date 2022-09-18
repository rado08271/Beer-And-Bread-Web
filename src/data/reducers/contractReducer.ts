import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { getData, removeData } from "../../shared/utils/cache";
import EthereumBlockchainRepository from "../../domain/repository/blockchain/EthereumBlockchainRepository";
import ContractRepository from "../../domain/repository/web/ContractRepository";
import RootState from "../../domain/entity/model/RootState";
import MultipleContractData from "../../domain/entity/model/MultipleContractData";
import Contract from "../../domain/entity/contractDto";
import ContractData from "../../domain/entity/model/ContractData";

const initialState: ContractData = {
    contract: {abiId: "", contractAccount: "", _id: "",
        deployData: {
            contract: {name: ""},
            token: {name: "", symbol: "", area: []}
        }
    },
    stateRequest: 0,
    error: null
}

export const getContractById = createAsyncThunk(
    'contract/get',
    async (action: {contractId: String}): Promise<Contract> => {
        const contract = await new ContractRepository().getContractByID(action.contractId)
        return contract;
    }
)

export const contractSlice = createSlice({
    name: "contract",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getContractById.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.contract = action.payload
        })
        builder.addCase(getContractById.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getContractById.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })
    }
})

export default contractSlice.reducer


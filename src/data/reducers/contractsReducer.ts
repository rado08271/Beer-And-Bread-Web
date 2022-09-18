import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { getData, removeData } from "../../shared/utils/cache";
import EthereumBlockchainRepository from "../../domain/repository/blockchain/EthereumBlockchainRepository";
import ContractRepository from "../../domain/repository/web/ContractRepository";
import RootState from "../../domain/entity/model/RootState";
import MultipleContractData from "../../domain/entity/model/MultipleContractData";
import Contract from "../../domain/entity/contractDto";

const initialState: MultipleContractData = {
    contracts: [],
    stateRequest: 0,
    error: null
}

export const getAllContracts = createAsyncThunk(
    'contracts/getAll',
    async (action): Promise<Contract[]> => {
        const contracts = await new ContractRepository().getAllContracts()
        return contracts;
    }
)
export const contractsSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getAllContracts.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.contracts = action.payload
        })
        builder.addCase(getAllContracts.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getAllContracts.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })
    }
})

export default contractsSlice.reducer


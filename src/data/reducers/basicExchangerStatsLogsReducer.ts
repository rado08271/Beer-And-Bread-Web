import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import EthereumTokenRepository from "../../domain/repository/blockchain/EthereumTokenRepository";
import ExchangersStatsLogsData from "../../domain/entity/model/ExchangersStatsLogsData";
import {ExchangerData} from "../../domain/entity/model/ExchangerData";
import LogRepository from "../../domain/repository/web/LogRepository";
import Log from "../../domain/entity/logDto";
import CreateTokenData from "../../domain/entity/model/CreateTokenData";

let contractRepository: EthereumTokenRepository

export const getAllExchangers = createAsyncThunk(
    'exchangers/getAllExchangers',
    async (action: {}): Promise<ExchangerData[]> => {
        const exchangers = await contractRepository.getAllExchangers()
        return exchangers;
    }
)

export const getLogs = createAsyncThunk(
    'exchangers/getLogs',
    async (action: {oldest: number, lastCall: number}): Promise<Log[]> => {
        const logs = await new LogRepository().getLogsPaged(action.oldest, action.lastCall)
        return logs;
    }
)

export const addLog = createAsyncThunk(
    'exchangers/addLog',
    async (action: {log: Log}): Promise<boolean> => {
        const response = await new LogRepository().createNewLogEntry(action.log)
        return response;
    }
)

const initialState: ExchangersStatsLogsData = {
    exchangers: [],
    exchangersLoading: true,
    logs: [],
    logAddLoading: true,
    stateRequest: 0,
    error: null
}

export const basicExchangerStatsLogsSlice = createSlice({
    name: "exchangers",
    initialState,
    reducers: {
        loadContract: (state: ExchangersStatsLogsData, action: PayloadAction<{abi: any[], contractAddress: string}>) => {
            contractRepository = new EthereumTokenRepository(action.payload.abi, action.payload.contractAddress);
        },
    },
    extraReducers: builder =>  {

        builder.addCase(getAllExchangers.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.exchangers = action.payload
            state.exchangersLoading = false
        })
        builder.addCase(getAllExchangers.pending, (state) => {
            state.stateRequest = 0
            state.exchangersLoading = true
        })
        builder.addCase(getAllExchangers.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.exchangersLoading = false
        })

        builder.addCase(getLogs.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.logs = action.payload
        })
        builder.addCase(getLogs.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getLogs.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(addLog.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.logAddLoading = false
        })
        builder.addCase(addLog.pending, (state) => {
            state.stateRequest = 0
            state.logAddLoading = true
        })
        builder.addCase(addLog.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.logAddLoading = false
        })
    }
})

export default basicExchangerStatsLogsSlice.reducer;
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import CreateTokenData from "../../domain/entity/model/CreateTokenData";
import PointDTO from "../../domain/entity/contractDto/PointDTO";
import TokenRepository from "../../domain/repository/web/TokenRepository";
import Log from "../../domain/entity/logDto";

export const createToken = createAsyncThunk(
    'create/createToken',
    async (action: {msgSender: string, tokenName: string, tokenSymbol: string, polygons: PointDTO[], onLog: (log: Log) => void}, thunkApi) => {

        const response = await new TokenRepository().createNewTokenWithLogging(action.msgSender, action.tokenName, action.tokenSymbol, action.polygons, action.onLog)
    }
)

const initialState: CreateTokenData = {
    polygonData: [],
    tokenName: "",
    tokenSymbol: "",
    logs: [],
    createTokenLoading: false,
    stateRequest: 0,
    error: null
}

export const createTokenSlice = createSlice({
    name: "create",
    initialState,
    reducers: {
        addPolygonData: (state: CreateTokenData, action: PayloadAction<PointDTO[]>) => {
            state.polygonData = action.payload
        },
        addNewDeployLogData: (state: CreateTokenData, action: PayloadAction<Log | Log[]>) => {
            state.logs = (Array.isArray(action.payload)) ? action.payload : state.logs.concat(action.payload)
        },
    },
    extraReducers: builder => {
        builder.addCase(createToken.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.createTokenLoading = false
        })
        builder.addCase(createToken.pending, (state) => {
            state.stateRequest = 0
            state.createTokenLoading = true
        })
        builder.addCase(createToken.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.createTokenLoading = false
        })
    }
})


export default createTokenSlice.reducer



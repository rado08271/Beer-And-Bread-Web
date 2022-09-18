import EthereumBlockchainRepository from "../../domain/repository/blockchain/EthereumBlockchainRepository";
import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import SessionData from "../../domain/entity/model/SessionData";
import FundsRepository from "../../domain/repository/web/FundsRepository";

const initialState: SessionData = {
    logged: false,
    address: "0x0",
    unlockAccountLoading: false,
    unlockAccountError: null,
    error: null,
    stateRequest: -1
}

export const accountLogin = createAsyncThunk(
    'account/accountLogin',
    async (action: {address: string, password?: string}, thunkApi): Promise<boolean> => {
        const logged = await new EthereumBlockchainRepository().loginAccount(action.address)
        return logged
    }
)

export const unlockAccount = createAsyncThunk(
    'account/unlockAccount',
    async (action: {address: string | null}): Promise<string | null> => {
        if (action.address !== null) {
            const funds = await new FundsRepository().unlockAccount(action.address)
            return funds.status === 200 ? funds.hash : null;
        } else {
            return null;
        }
    }
)

export const accountLoginSlice = createSlice({
    name: "account",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(accountLogin.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.address = action.meta.arg.address
            state.logged = action.payload
            state.error = null
        })
        builder.addCase(accountLogin.pending, (state, action) => {
            state.stateRequest = 0
            state.address = action.meta.arg.address
            state.logged = false
        })
        builder.addCase(accountLogin.rejected, (state, action) => {
            state.stateRequest = -1
            state.address = action.meta.arg.address
            state.logged = false
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })


        builder.addCase(unlockAccount.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.unlockAccountLoading = false
            if (!action.payload) {
                state.unlockAccountError = "Could not receive hash, or address is null"
            }
        })
        builder.addCase(unlockAccount.pending, (state) => {
            state.stateRequest = 0
            state.unlockAccountLoading = true
        })
        builder.addCase(unlockAccount.rejected, (state, action) => {
            state.stateRequest = -1
            state.unlockAccountError = (action.error.message) ? action.error.message : "Unknown error occured"
            state.unlockAccountLoading = false
        })
    }
})

export default accountLoginSlice.reducer


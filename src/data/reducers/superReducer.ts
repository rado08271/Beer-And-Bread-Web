import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { getData, removeData } from "../../shared/utils/cache";
import EthereumBlockchainRepository from "../../domain/repository/blockchain/EthereumBlockchainRepository";
import AccountData from "../../domain/entity/model/AccountData";
import FundsRepository from "../../domain/repository/web/FundsRepository";

const initialState: AccountData = {
    accountAddress: "0x0",
    accountBalance: 0,
    userLogged: false,
    loginLoading: true,
    dropHash: "",
    dropFundsLoading: false,
    dropFundsError: null,
    stateRequest: 0,
    error: null
}

export const getBalance = createAsyncThunk(
    'account/getBalance',
    async (action: {address: string | null}): Promise<number> => {
        if (action.address === null || action.address === "0x0") return 0
        const accountBalance = await new EthereumBlockchainRepository().getAccountBalance(action.address)

        return accountBalance;
    }
)

export const dropFunds = createAsyncThunk(
    'account/dropFunds',
    async (action: {address: string | null}): Promise<string | null> => {
        if (action.address !== null) {
            const funds = await new FundsRepository().fundWallet(action.address)
            return funds.status === 200 ? funds.hash : null;
        } else {
            return null;
        }
    }
)


export const superSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        checkLogin: (state: AccountData) => {
            state.accountAddress = getData("CURRENT_LOGGED_ACCOUNT_ADDRESS")
            state.userLogged = getData("CURRENT_LOGGED_ACCOUNT_ADDRESS", null) !== null
            state.loginLoading = false
        },
        doLogout: (state: AccountData) => {
            removeData("CURRENT_LOGGED_ACCOUNT_ADDRESS")
            state.userLogged = false
        }
    },
    extraReducers: builder => {
        builder.addCase(getBalance.fulfilled, (state, action) => {
            state.accountBalance = action.payload
        })
        builder.addCase(getBalance.pending, (state) => {
            state.accountBalance = 0
        })
        builder.addCase(getBalance.rejected, (state, action) => {
            state.accountBalance = 0
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(dropFunds.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.dropFundsLoading = false
            if (action.payload) {
                state.dropHash = action.payload
            } else {
                state.dropFundsError = "Could not receive hash, or address is null"
            }
        })
        builder.addCase(dropFunds.pending, (state) => {
            state.stateRequest = 0
            state.dropFundsLoading = true
        })
        builder.addCase(dropFunds.rejected, (state, action) => {
            state.stateRequest = -1
            state.dropFundsError = (action.error.message) ? action.error.message : "Unknown error occured"
            state.dropFundsLoading = false
        })
    }
})

export default superSlice.reducer


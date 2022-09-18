import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import UserData from "../../domain/entity/model/UserData";
import {getData} from "../../shared/utils/cache";
import EthereumTokenRepository from "../../domain/repository/blockchain/EthereumTokenRepository";
import {ExchangerData} from "../../domain/entity/model/ExchangerData";
import {TaxesData} from "../../domain/entity/model/TaxesData";
import PointDTO from "../../domain/entity/contractDto/PointDTO";
import RevenueData from "../../domain/entity/model/RevenueData";
import ExchangersStatsLogsData from "../../domain/entity/model/ExchangersStatsLogsData";
import Log from "../../domain/entity/logDto";
import BusinessData from "../../domain/entity/model/BusinessData";

let contractRepository: EthereumTokenRepository

export const getBalance = createAsyncThunk(
    'actions/getBalance',
    async (action: {address: string}): Promise<string> => {
        const balance = await contractRepository.getAccountTokenBalance(action.address)
        return balance;
    }
)

export const checkIsExchanger = createAsyncThunk(
    'actions/getExchangerByAddress',
    async (action: {address: string}): Promise<boolean> => {
        const exchangerData = await contractRepository.getExchangerByAddress(action.address)
        return exchangerData != null && exchangerData.exchanger === action.address
    }
)

export const checkIsOwner = createAsyncThunk(
    'actions/checkIsOwner',
    async (action: {address: string}): Promise<boolean> => {
        const owner = await contractRepository.getMicroeconomicsOwnerAddress()
        return owner === action.address
    }
)

export const checkIsActive = createAsyncThunk(
    'actions/checkIsActive',
    async (action: {address: string}): Promise<boolean> => {
        const funds = await contractRepository.getAccountTokenBalance(action.address)
        return !isNaN(parseFloat(funds)) && parseFloat(funds) > 0
    }
)

export const checkIsBusiness = createAsyncThunk(
    'actions/checkIsBusiness',
    async (action: {address: string}): Promise<boolean> => {
        const businesses = await contractRepository.getAllBusinesses()
        return businesses.filter(business => business.owner === action.address).length > 0
    }
)


export const getExchangerData = createAsyncThunk(
    'actions/getExchangerData',
    async (action: {address: string}): Promise<ExchangerData | null> => {
        const exchanger = await contractRepository.getExchangerByAddress(action.address)
        return exchanger
    }
)

export const stakeGasPriceEstimate = createAsyncThunk(
    'actions/stakeGasPriceEstimate',
    async (action: {msgSender: string, toStake: number, gweiToPay: number, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateStakeToken(action.msgSender, action.toStake, action.gweiToPay, action.toLog)
        return gasEstimate
    }
)

export const stakeFunds = createAsyncThunk(
    'actions/stakeFunds',
    async (action: {msgSender: string, toStake: number, gweiToPay: number, toLog: (log: Log) => void}) => {
        await contractRepository.stakeToken(action.msgSender, action.toStake, action.gweiToPay, action.toLog)
    }
)
/// started here

export const setTaxesEstimate = createAsyncThunk(
    'actions/setTaxesEstimate',
    async (action: {msgSender: string, taxes: TaxesData, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateSetTaxes(action.msgSender, action.taxes, action.toLog)
        return gasEstimate
    }
)

export const setTaxes = createAsyncThunk(
    'actions/setTaxes',
    async (action: {msgSender: string, taxes: TaxesData, toLog: (log: Log) => void}) => {
        await contractRepository.setTaxes(action.msgSender, action.taxes, action.toLog)
    }
)

export const setRevenueEstimate = createAsyncThunk(
    'actions/setRevenueEstimate',
    async (action: {msgSender: string, revenue: RevenueData, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateSetRevenue(action.msgSender, action.revenue, action.toLog)
        return gasEstimate
    }
)

export const setRevenue = createAsyncThunk(
    'actions/setRevenue',
    async (action: {msgSender: string, revenue: RevenueData, toLog: (log: Log) => void}) => {
        await contractRepository.setRevenue(action.msgSender, action.revenue, action.toLog)
    }
)

export const changeOwnerEstimate = createAsyncThunk(
    'actions/changeOwnerEstimate',
    async (action: {msgSender: string, newOwner: string, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateSetNewOwner(action.msgSender, action.newOwner, action.toLog)
        return gasEstimate
    }
)

export const changeOwner = createAsyncThunk(
    'actions/changeOwner',
    async (action: {msgSender: string, newOwner: string, toLog: (log: Log) => void}) => {
        await contractRepository.setNewOwner(action.msgSender, action.newOwner, action.toLog)
    }
)

export const openBusinessEstimate = createAsyncThunk(
    'actions/openBusinessEstimate',
    async (action: {msgSender: string, name: string, position: PointDTO, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateOpenBusiness(action.msgSender, action.name, action.position, action.toLog)
        return gasEstimate
    }
)

export const openBusiness = createAsyncThunk(
    'actions/openBusiness',
    async (action: {msgSender: string, name: string, position: PointDTO, toLog: (log: Log) => void}) => {
        await contractRepository.openNewBusiness(action.msgSender, action.name, action.position, action.toLog)
    }
)

export const changeBusinessEstimate = createAsyncThunk(
    'actions/closeBusinessEstimate',
    async (action: {msgSender: string, business: BusinessData, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateChangeBusinessData(action.msgSender, action.business, action.toLog)
        return gasEstimate
    }
)

export const changeBusiness = createAsyncThunk(
    'actions/closeBusiness',
    async (action: {msgSender: string, business: BusinessData, toLog: (log: Log) => void}) => {
        await contractRepository.changeBusinessData(action.msgSender, action.business, action.toLog)
    }
)

export const getRevenue = createAsyncThunk(
    'actions/getRevenue',
    async (action: {}): Promise<RevenueData> => {
        const revenueData = await contractRepository.getRevenue()
        return revenueData;
    }
)


export const depositGasPriceEstimate = createAsyncThunk(
    'actions/depositGasPriceEstimate',
    async (action: {msgSender: string, toDeposit: number, gweiToPay: number, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateDepositToToken(action.msgSender, action.toDeposit, action.gweiToPay, action.toLog)
        return gasEstimate
    }
)

export const depositFunds = createAsyncThunk(
    'actions/depositToToken',
    async (action: {msgSender: string, toDeposit: number, gweiToPay: number, toLog: (log: Log) => void}) => {
        await contractRepository.depositToToken(action.msgSender, action.toDeposit, action.gweiToPay, action.toLog)
    }
)

export const withdrawGasPriceEstimate = createAsyncThunk(
    'actions/withdrawGasPriceEstimate',
    async (action: {msgSender: string, toWithdraw: number, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateWithdrawFromToken(action.msgSender, action.toWithdraw, action.toLog)
        return gasEstimate
    }
)

export const withdrawFunds = createAsyncThunk(
    'actions/withdrawFunds',
    async (action: {msgSender: string, toWithdraw: number, toLog: (log: Log) => void}) => {
        await contractRepository.withdrawFromToken(action.msgSender, action.toWithdraw, action.toLog)
    }
)

export const transferFundsGasEstimate = createAsyncThunk(
    'actions/transferFundsGasEstimate',
    async (action: {msgSender: string, transferReceiver: string, fundsToTransfer: number, location: PointDTO, toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateTransferToken(action.msgSender, action.transferReceiver, action.fundsToTransfer, action.location, action.toLog)
        return gasEstimate
    }
)

export const transferFunds = createAsyncThunk(
    'actions/transferFunds',
    async (action: {msgSender: string, transferReceiver: string, fundsToTransfer: number, location: PointDTO, toLog: (log: Log) => void}) => {
        await contractRepository.transferToken(action.msgSender, action.transferReceiver, action.fundsToTransfer, action.location, action.toLog)
    }
)

export const redefineAreaGasEstimate = createAsyncThunk(
    'actions/redefineAreaGasEstimate',
    async (action: {msgSender: string, polygon: PointDTO[], toLog: (log: Log) => void}): Promise<number> => {
        const gasEstimate = await contractRepository.estimateRedefineArea(action.msgSender, action.polygon, action.toLog)
        return gasEstimate
    }
)

export const redefineArea = createAsyncThunk(
    'actions/redefineArea',
    async (action: {msgSender: string, polygon: PointDTO[], toLog: (log: Log) => void}) => {
        await contractRepository.redefineArea(action.msgSender, action.polygon, action.toLog)
    }
)

const initialState: UserData = {
    accountBalance: "",
    accountIsActive: false,
    accountIsOwner: false,
    accountIsExchanger: false,
    accountIsBusiness: false,
    loggedAccountAddress: "",
    exchangerAccountData: null,
    revenueData: {ownerRevenue: -1, providerRevenue: -1, exchangerRevenue: -1},
    logs: [],
    depositGasPrice: -1,
    depositLoading: false,
    withdrawGasPrice: -1,
    withdrawalLoading: false,
    transferGasPrice: -1,
    transferLoading: false,
    stakeGasPrice: -1,
    stakeLoading: false,
    setTaxesGasPrice: -1,
    setTaxesLoading: false,
    setRevenueGasPrice: -1,
    setRevenueLoading: false,
    changeOwnerGasPrice: -1,
    changeOwnerLoading: false,
    openBusinessGasPrice: -1,
    openBusinessLoading: false,
    changeBusinessGasPrice: -1,
    changeBusinessLoading: false,
    redefineAreaGasPrice: -1,
    redefineAreaLoading: false,
    stateRequest: 0,
    error: null
}

export const basicActionUserSlice = createSlice({
    name: "actions",
    initialState,
    reducers: {
        loadContract: (state: UserData, action: PayloadAction<{abi: any[], contractAddress: string}>) => {
            contractRepository = new EthereumTokenRepository(action.payload.abi, action.payload.contractAddress);
        },
        loggedUserAddress: (state: UserData) => {
            state.loggedAccountAddress = getData("CURRENT_LOGGED_ACCOUNT_ADDRESS") ? getData("CURRENT_LOGGED_ACCOUNT_ADDRESS")!! : ""
        },
        addNewEventLogData: (state: UserData, action: PayloadAction<Log | Log[]>) => {
            state.logs = (Array.isArray(action.payload)) ? action.payload : state.logs.concat(action.payload)
        }
    },
    extraReducers: builder =>  {
        builder.addCase(getBalance.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.accountBalance = action.payload
        })
        builder.addCase(getBalance.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getBalance.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(checkIsExchanger.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.accountIsExchanger = action.payload
        })
        builder.addCase(checkIsExchanger.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(checkIsExchanger.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(checkIsOwner.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.accountIsOwner = action.payload
        })
        builder.addCase(checkIsOwner.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(checkIsOwner.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(checkIsActive.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.accountIsActive = action.payload
        })
        builder.addCase(checkIsActive.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(checkIsActive.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(checkIsBusiness.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.accountIsBusiness = action.payload
        })
        builder.addCase(checkIsBusiness.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(checkIsBusiness.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getExchangerData.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.exchangerAccountData = action.payload
        })
        builder.addCase(getExchangerData.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getExchangerData.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })


        builder.addCase(depositGasPriceEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.depositGasPrice = action.payload
        })
        builder.addCase(depositGasPriceEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(depositGasPriceEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(depositFunds.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.depositLoading = false
        })
        builder.addCase(depositFunds.pending, (state) => {
            state.stateRequest = 0
            state.depositLoading = true
        })
        builder.addCase(depositFunds.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.depositLoading = false
        })

        builder.addCase(withdrawGasPriceEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.withdrawGasPrice = action.payload
        })
        builder.addCase(withdrawGasPriceEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(withdrawGasPriceEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(withdrawFunds.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.withdrawalLoading = false
        })
        builder.addCase(withdrawFunds.pending, (state) => {
            state.stateRequest = 0
            state.withdrawalLoading = true
        })
        builder.addCase(withdrawFunds.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.withdrawalLoading = false
        })

        builder.addCase(transferFundsGasEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.transferGasPrice = action.payload
        })
        builder.addCase(transferFundsGasEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(transferFundsGasEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(transferFunds.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.transferLoading = false
        })
        builder.addCase(transferFunds.pending, (state) => {
            state.stateRequest = 0
            state.transferLoading = true
        })
        builder.addCase(transferFunds.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.transferLoading = false
        })

        builder.addCase(stakeGasPriceEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.stakeGasPrice = action.payload
        })
        builder.addCase(stakeGasPriceEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(stakeGasPriceEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(stakeFunds.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.stakeLoading = false
        })
        builder.addCase(stakeFunds.pending, (state) => {
            state.stateRequest = 0
            state.stakeLoading = true
        })
        builder.addCase(stakeFunds.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.stakeLoading = false
        })

        builder.addCase(setTaxesEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.setTaxesGasPrice = action.payload
        })
        builder.addCase(setTaxesEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(setTaxesEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(setTaxes.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.setTaxesLoading = false
        })
        builder.addCase(setTaxes.pending, (state) => {
            state.stateRequest = 0
            state.setTaxesLoading = true
        })
        builder.addCase(setTaxes.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.setTaxesLoading = false
        })

        builder.addCase(setRevenueEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.setRevenueGasPrice = action.payload
        })
        builder.addCase(setRevenueEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(setRevenueEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(setRevenue.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.setRevenueLoading = false
        })
        builder.addCase(setRevenue.pending, (state) => {
            state.stateRequest = 0
            state.setRevenueLoading = true
        })
        builder.addCase(setRevenue.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.setRevenueLoading = false
        })

        builder.addCase(changeOwnerEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.changeOwnerGasPrice = action.payload
        })
        builder.addCase(changeOwnerEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(changeOwnerEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(changeOwner.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.changeOwnerLoading = false
        })
        builder.addCase(changeOwner.pending, (state) => {
            state.stateRequest = 0
            state.changeOwnerLoading = true
        })
        builder.addCase(changeOwner.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.changeOwnerLoading = false
        })

        builder.addCase(openBusinessEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.openBusinessGasPrice = action.payload
        })
        builder.addCase(openBusinessEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(openBusinessEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(openBusiness.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.openBusinessLoading = false
        })
        builder.addCase(openBusiness.pending, (state) => {
            state.stateRequest = 0
            state.openBusinessLoading = true
        })
        builder.addCase(openBusiness.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.openBusinessLoading = false
        })

        builder.addCase(changeBusinessEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.changeBusinessGasPrice = action.payload
        })
        builder.addCase(changeBusinessEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(changeBusinessEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(redefineArea.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.redefineAreaLoading = false
        })
        builder.addCase(redefineArea.pending, (state) => {
            state.stateRequest = 0
            state.redefineAreaLoading = true
        })
        builder.addCase(redefineArea.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.redefineAreaLoading = false
        })

        builder.addCase(redefineAreaGasEstimate.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.redefineAreaGasPrice = action.payload
        })
        builder.addCase(redefineAreaGasEstimate.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(redefineAreaGasEstimate.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(changeBusiness.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.changeBusinessLoading = false
        })
        builder.addCase(changeBusiness.pending, (state) => {
            state.stateRequest = 0
            state.changeBusinessLoading = true
        })
        builder.addCase(changeBusiness.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
            state.changeBusinessLoading = false
        })

        builder.addCase(getRevenue.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.revenueData = action.payload
        })
        builder.addCase(getRevenue.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getRevenue.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })
    }
})

export default basicActionUserSlice.reducer
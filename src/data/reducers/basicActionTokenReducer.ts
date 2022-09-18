import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import EthereumTokenRepository from "../../domain/repository/blockchain/EthereumTokenRepository";
import TokenData from "../../domain/entity/model/TokenData";
import PointDTO from "../../domain/entity/contractDto/PointDTO";
import {TaxesData} from "../../domain/entity/model/TaxesData";
import BusinessData from "../../domain/entity/model/BusinessData";

let contractRepository: EthereumTokenRepository

export const getTokenName = createAsyncThunk(
    'token/getTokenName',
    async (action: {}): Promise<string> => {
        const tokenName = await contractRepository.getTokenName()
        return tokenName;
    }
)

export const getTokenSymbol = createAsyncThunk(
    'token/getTokenSymbol',
    async (action: {}): Promise<string> => {
        const tokenName = await contractRepository.getTokenSymbol()
        return tokenName;
    }
)

export const getDefinedArea = createAsyncThunk(
    'token/getDefinedArea',
    async (action: {}): Promise<PointDTO[]> => {
        const area = await contractRepository.getDefinedArea()
        return area;
    }
)

export const getAllBusinesses = createAsyncThunk(
    'token/getAllBussinesses',
    async (action: {}): Promise<BusinessData[]> => {
        const businesses = await contractRepository.getAllBusinesses()
        return businesses;
    }
)

export const getMicroeconomicsOwner = createAsyncThunk(
    'token/getMicroeconomicsOwner',
    async (action: {}): Promise<string> => {
        const ownerAddress = await contractRepository.getMicroeconomicsOwnerAddress()
        return ownerAddress;
    }
)

export const getTaxes = createAsyncThunk(
    'token/getTaxes',
    async (action: {}): Promise<TaxesData> => {
        const taxesData = await contractRepository.getTaxes()
        return taxesData;
    }
)

const initialState: TokenData = {
    definedArea: [],
    businesses: [],
    tokenName: "",
    tokenSymbol: "",
    ownerAddress: "",
    taxes: {withdrawalTax: -1, transactionTax: -1, entryTax: -1, stagnationTax: -1},
    businessToPay: null,
    stateRequest: 0,
    error: null
}

export const basicActionTokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        loadContract: (state: TokenData, action: PayloadAction<{abi: any[], contractAddress: string}>) => {
            contractRepository = new EthereumTokenRepository(action.payload.abi, action.payload.contractAddress);
        },
        businessToPay: (state: TokenData, action: PayloadAction<BusinessData | null>) => {
            state.businessToPay = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(getDefinedArea.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.definedArea = action.payload
        })
        builder.addCase(getDefinedArea.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getDefinedArea.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getAllBusinesses.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.businesses = action.payload
        })
        builder.addCase(getAllBusinesses.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getAllBusinesses.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getTokenName.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.tokenName = action.payload
        })
        builder.addCase(getTokenName.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getTokenName.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getTokenSymbol.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.tokenSymbol = action.payload
        })
        builder.addCase(getTokenSymbol.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getTokenSymbol.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getMicroeconomicsOwner.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.ownerAddress = action.payload
        })
        builder.addCase(getMicroeconomicsOwner.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getMicroeconomicsOwner.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })

        builder.addCase(getTaxes.fulfilled, (state, action) => {
            state.stateRequest = 1
            state.taxes = action.payload
        })
        builder.addCase(getTaxes.pending, (state) => {
            state.stateRequest = 0
        })
        builder.addCase(getTaxes.rejected, (state, action) => {
            state.stateRequest = -1
            state.error = (action.error.message) ? action.error.message : "Unknown error occured"
        })


    }
})

export default basicActionTokenSlice.reducer



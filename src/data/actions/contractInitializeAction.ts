import {basicActionTokenSlice} from "../reducers/basicActionTokenReducer";
import {basicActionUserSlice} from "../reducers/basicActionUserReducer";
import {basicExchangerStatsLogsSlice} from "../reducers/basicExchangerStatsLogsReducer";

export const loadTokenContractRepository = basicActionTokenSlice.actions.loadContract
export const loadUserContractRepository = basicActionUserSlice.actions.loadContract
export const loadStatsContractRepository = basicExchangerStatsLogsSlice.actions.loadContract

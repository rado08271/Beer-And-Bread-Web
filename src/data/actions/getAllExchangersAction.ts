import {getAllExchangers} from "../reducers/basicExchangerStatsLogsReducer";
import ExchangersStatsLogsData from "../../domain/entity/model/ExchangersStatsLogsData";

export default getAllExchangers

export const exchangersSelector = ((state: {stats: ExchangersStatsLogsData}) => state.stats.exchangers)
export const exchangersLoadingSelector = ((state: {stats: ExchangersStatsLogsData}) => state.stats.exchangersLoading)
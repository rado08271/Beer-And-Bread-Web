import {getLogs} from "../reducers/basicExchangerStatsLogsReducer";
import ExchangersStatsLogsData from "../../domain/entity/model/ExchangersStatsLogsData";

export default getLogs

export const logsSelector = ((state: {stats: ExchangersStatsLogsData}) => state.stats.logs)
import {ExchangerData} from "./ExchangerData";
import RootState from "./RootState";
import Log from "../logDto";

export default interface ExchangersStatsLogsData extends RootState {
    exchangers: ExchangerData[]
    exchangersLoading: boolean
    logAddLoading: boolean
    logs: Log[]
}
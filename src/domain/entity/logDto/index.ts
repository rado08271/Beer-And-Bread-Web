import EtherBlockResponseData from "../model/EtherBlockResponseData";

export enum LogType {
    WARNING,
    ERROR,
    LOG
}

export default interface Log {
    logMessage: string,
    logTimestamp: string,
    logStatus: LogType
    tokenMessage?: EtherBlockResponseData,
}
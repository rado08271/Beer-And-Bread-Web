import EtherBlockEventData from "../../../presentation/components/forms/EtherBlockEventData";

export default interface EtherBlockResponseData {
    blockHash?: string,
    blockNumber?: number,
    contractAddress?: string,
    effectiveGasPrice?: number,
    from?: string,
    gasUsed?: string,
    to?: string,
    transactionHash?: string,
    transactionIndex?: string,
    event?: EtherBlockEventData
}
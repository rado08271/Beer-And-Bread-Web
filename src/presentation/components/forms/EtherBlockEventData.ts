
export default interface EtherBlockEventData {
    UserEvent?: { date: number, userAddress: string, funded: number, received: number },
    ExchangerEvent?: { date: number, exchanger: string, staked: string },
    BussinessEvent?: { date: number, bussiness: string, location: any },
    TransferEvent?: { date: number, to: string, from: string, transaction: number, transactionTax: number},
}
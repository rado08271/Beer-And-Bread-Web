import Log, {LogType} from "../entity/logDto";
import EtherBlockResponseData from "../entity/model/EtherBlockResponseData";
import EtherBlockEventData from "../../presentation/components/forms/EtherBlockEventData";
import showNotification from "./NotificationService";

export default function passNewMessage(message: any, type: "error" | "log",  toLog: (log: Log) => void, isEvent = false) {
    console.log(message)

    if (`${message}`.startsWith("Returned error") || `${message}`.startsWith("Transaction has")) {
        showNotification({
            type: `${message}`.startsWith("Transaction") ? "warning" : "error",
            message: message,
            ttl: 2000,
            title: "Returned error"
        })
        toLog({
            logMessage: message,
            logStatus: `${message}`.startsWith("Transaction") ? LogType.WARNING : LogType.ERROR,
            logTimestamp: new Date().toUTCString(),
        })
        return;

    }

    const dataEvent: EtherBlockResponseData = {
        blockHash: message["blockHash"],
        blockNumber: message["blockNumber"],
        contractAddress: message["contractAddress"],
        effectiveGasPrice: message["effectiveGasPrice"],
        from: message["from"],
        gasUsed: message["gasUsed"],
        to: message["to"],
        transactionHash: message["transactionHash"],
        transactionIndex: message["transactionIndex"],
    }

    let event: EtherBlockEventData = {}
    if (message["events"]["UserEvent"] && message["events"]["UserEvent"]["event"] === "UserEvent") {
        event.UserEvent = {
            date: message["events"]["UserEvent"]["returnValues"]["date"],
            userAddress: message["events"]["UserEvent"]["returnValues"]["userAddress"],
            funded: message["events"]["UserEvent"]["returnValues"]["funded"],
            received: message["events"]["UserEvent"]["returnValues"]["received"]
        }
    }
    if (message["events"]["ExchangerEvent"] && message["events"]["ExchangerEvent"]["event"] === "ExchangerEvent") {
        event.ExchangerEvent = {
            date: message["events"]["ExchangerEvent"]["returnValues"]["date"],
            exchanger: message["events"]["ExchangerEvent"]["returnValues"]["exchanger"],
            staked: message["events"]["ExchangerEvent"]["returnValues"]["staked"]
        }
    }
    if (message["events"]["BussinessEvent"] && message["events"]["BussinessEvent"]["event"] === "BussinessEvent") {
        event.BussinessEvent = {
            date: message["events"]["BussinessEvent"]["returnValues"]["date"],
            bussiness: message["events"]["BussinessEvent"]["returnValues"]["bussiness"],
            location: message["events"]["BussinessEvent"]["returnValues"]["location"]
        }
    }
    if (message["events"]["TransferEvent"] && message["events"]["TransferEvent"]["event"] === "TransferEvent") {
        event.TransferEvent = {
            date: message["events"]["TransferEvent"]["returnValues"]["date"],
            to: message["events"]["TransferEvent"]["returnValues"]["to"],
            from: message["events"]["TransferEvent"]["returnValues"]["from"],
            transaction: message["events"]["TransferEvent"]["returnValues"]["transaction"],
            transactionTax: message["events"]["TransferEvent"]["returnValues"]["transactionTax"]
        }
    }


    dataEvent.event = event
    toLog({
        logMessage: "",
        logStatus: type === "log" ? LogType.LOG : LogType.ERROR,
        logTimestamp: new Date().toUTCString(),
        tokenMessage: dataEvent,
    })
}
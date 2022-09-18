import Web3 from "web3";
import PointDTO from "../../entity/contractDto/PointDTO";
import {TaxesData} from "../../entity/model/TaxesData";
import passNewMessage from "../../service/TokenEventsService";
import {ExchangerData} from "../../entity/model/ExchangerData";
import RevenueData from "../../entity/model/RevenueData";
import Log from "../../entity/logDto";
import BusinessData, {BussinessState} from "../../entity/model/BusinessData";
import {BLOCKCHAIN_URL} from "../../../presentation/config/constants";
import _ from "lodash";

export default class EthereumTokenRepository {
    web3 = new Web3(Web3.givenProvider || `${BLOCKCHAIN_URL}`)
    contract: any = {}
    estimateTimes: number = 5
    start = 0
    end = 0

    constructor(abi: any[], contractAddress: string) {
        this.web3.eth.handleRevert = true
        this.getContractData(abi, contractAddress);
    }

    getContractData(abi: any[], contractAddress: string)  {
        try {
            this.contract = new this.web3.eth.Contract(JSON.parse(JSON.stringify(abi)), contractAddress);
            this.contract.handleRevert = true
            return this.contract
        } catch (e: any) {
            console.error(e)
            throw e;
        }
    }

    async getTokenName(): Promise<string> {
        if (!this.contract) throw new Error("Contract is not defined")
        try {
            const tokenName = await this.contract.methods.tokenName().call()
            return tokenName;
        } catch (e: any) {
            throw e;
        }
    }

    async getTokenSymbol(): Promise<string> {
        if (!this.contract) throw new Error("Contract is not defined")
        try {
            const tokenSymbol = await this.contract.methods.tokenSymbol().call()
            return tokenSymbol;
        } catch (e: any) {
            throw e;
        }
    }

    async getDefinedArea(): Promise<PointDTO[]> {
        if (!this.contract) throw new Error("Contract is not defined")
        try {
            const definedArea: any[] = await this.contract.methods.getDefinedArea().call()

            return definedArea.map((point) =>  {return {lat: point[0]/1e5, lng: point[1]/1e5}}).filter(value => value.lat > 0 && value.lng > 0)
        } catch (e: any) {
            throw e;
        }
    }

    async getAccountTokenBalance(address: string): Promise<string> {
        if (!this.contract) throw new Error("Contract is not defined")
        try {
            console.log(address)
            const balance = await this.contract.methods.balance(address).call()
            return balance;
        } catch (e: any) {
            throw e;
        }
    }

    async getMicroeconomicsOwnerAddress(): Promise<string> {
        if (!this.contract) throw new Error("Contract is not defined")
        try {
            const ownerAddress = await this.contract.methods.microeconomicsOwner().call()
            return ownerAddress;
        } catch (e: any) {
            throw e;
        }
    }

    async getTaxes(): Promise<TaxesData> {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const taxes: any = await this.contract.methods.taxes().call()
            return {
                entryTax: parseFloat(taxes["entryTax"]),
                transactionTax: parseFloat(taxes["transactionTax"]),
                stagnationTax: parseFloat(taxes["stagnationTax"]),
                withdrawalTax: parseFloat(taxes["withdrawelTax"])};
        } catch (e: any) {
            throw e;
        }
    }

    async getAllBusinesses(): Promise<BusinessData[]> {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const amountOfBusinesses = await this.contract.methods.amountOfBusinesses().call()

            const businesses: BusinessData[] = []

            for (let idx = 0; idx < amountOfBusinesses; idx++) {
                const businessRaw = await this.contract.methods.bussinesses(idx).call()
                const stateValue = businessRaw['state']
                businesses.push({
                    id: businessRaw['id'],
                    brand: businessRaw['brand'],
                    owner: businessRaw['owner'],
                    state: stateValue === "0" ? BussinessState.OPENED : BussinessState.CLOSED,
                    location: {lat: businessRaw['location']['longitude']/1e5, lng: businessRaw['location']['lattitude']/1e5}
                })
            }

            return businesses;
        } catch (e) {
            throw e
        }

    }

    async getAllExchangers(): Promise<ExchangerData[]> {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const amountOfExchangers = await this.contract.methods.amountOfExchangers().call()

            const exchangers: ExchangerData[] = []

            for (let idx = 0; idx < amountOfExchangers; idx++) {
                const exchangerRaw = await this.contract.methods.exchangers(idx).call()

                exchangers.push({
                        exchanger: exchangerRaw["exchanger"],
                        fullAmountForExchanging: exchangerRaw["fullAmountForExchanging"],
                        exchangesCounter: parseFloat(exchangerRaw["exchangesCounter"])
                    }
                )
            }

            return exchangers;
        } catch (e) {
            throw e
        }
    }

    async getExchangerByAddress(accountAddress: string): Promise<ExchangerData | null> {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const amountOfExchangers = await this.contract.methods.amountOfExchangers().call()

            let exchanger: ExchangerData = {exchanger: "", fullAmountForExchanging: "", exchangesCounter: 0}

            // This would take some time to finish
            for (let idx = 0; idx < amountOfExchangers; idx++) {
                const exchangerRaw = await this.contract.methods.exchangers(idx).call()
                exchanger = {
                    exchanger: exchangerRaw["exchanger"],
                    fullAmountForExchanging: exchangerRaw["fullAmountForExchanging"],
                    exchangesCounter: parseFloat(exchangerRaw["exchangesCounter"])
                }
                if (exchanger.exchanger === accountAddress) {
                    return exchanger
                }
            }

            return null;
        } catch (e) {
            throw e
        }
    }

    async getRevenue(): Promise<RevenueData> {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const revenueData: any = await this.contract.methods.revenue().call()
            return {
                ownerRevenue: parseFloat(revenueData["ownerRevenue"]),
                providerRevenue: parseFloat(revenueData["providerRevenue"]),
                exchangerRevenue: parseFloat(revenueData["exchangerRevenue"])}
        } catch (e) {
            throw e;
        }

    }

    async estimateDepositToToken(msgSender: string, toDeposit: number, gweiToPay: number, toLog: (log: Log) => void ) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const inWei = gweiToPay + "000000000";          // wei is -10e9 of gwei
            const estimatedGas = await this.contract.methods.deposit(`${toDeposit}`).estimateGas({from: msgSender, value: inWei})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async depositToToken(msgSender: string, toDeposit: number, gweiToPay: number, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const inWei = gweiToPay + "000000000";          // wei is -10e9 of gwei
            const estimatedGas = await this.estimateDepositToToken(msgSender, toDeposit, gweiToPay, toLog)
            const transactionHash = await this.contract.methods.depositFunds(`${toDeposit}`).send({from: msgSender, value: inWei, gas: estimatedGas})
            // .on('transactionHash', function(hash: string) {console.log("Transaction Hash", hash)})
            // .on('receipt', function(receipt: string) {console.log("Receipt", JSON.stringify(receipt))})
            // .on('confirmation', function(confirmationNumber: number, receipt: string) {console.log("Confirmation", confirmationNumber, JSON.stringify(receipt))})
            // .on('error', function(error: string) {
            //     console.log("error created", error)
            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateWithdrawFromToken(msgSender: string, toWithdraw: number, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods.withdraw(`${toWithdraw}`).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async withdrawFromToken(msgSender: string, toWithdraw: number, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateWithdrawFromToken(msgSender, toWithdraw, toLog)
            const transactionHash = await this.contract.methods.withdraw(`${toWithdraw}`).send({from: msgSender, gas: 100000000})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateTransferToken(msgSender: string, transferReceiver: string, toTransfer: number, location: PointDTO, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const lattitude = `${parseInt(`${location.lat * 1e5}`)}`
            const longitude = `${parseInt(`${location.lng * 1e5}`)}`

            const estimatedGas = await this.contract.methods.transfer(transferReceiver, `${toTransfer}`, lattitude, longitude).estimateGas({from: msgSender})

            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async transferToken(msgSender: string, transferReceiver: string, toTransfer: number, location: PointDTO, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const lattitude = `${parseInt(`${location.lat * 1e5}`)}`
            const longitude = `${parseInt(`${location.lng * 1e5}`)}`

            const estimatedGas = await this.estimateTransferToken(msgSender, transferReceiver, toTransfer, location, toLog)
            const transactionHash = await this.contract.methods.transfer(transferReceiver, `${toTransfer}`, lattitude, longitude).send({from: msgSender, gas: estimatedGas})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateStakeToken(msgSender: string, toStake: number, gweiToPay: number, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const inWei = gweiToPay + "000000000";          // wei is -10e9 of gwei
            const estimatedGas = await this.contract.methods.stakeExchange(`${toStake}`).estimateGas({from: msgSender, value: inWei})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async stakeToken(msgSender: string, toStake: number, gweiToPay: number, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const inWei = gweiToPay + "000000000";          // wei is -10e9 of gwei
            const estimatedGas = await this.estimateStakeToken(msgSender, toStake, gweiToPay, toLog)
            const transactionHash = await this.contract.methods.stakeExchange(`${toStake}`).send({from: msgSender, value: inWei, gas: estimatedGas})
            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateSetTaxes(msgSender: string, tax: TaxesData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods
                .establishTaxes(tax.entryTax, tax.withdrawalTax, tax.transactionTax, tax.stagnationTax).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async setTaxes(msgSender: string, tax: TaxesData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateSetTaxes(msgSender, tax, toLog)
            const transactionHash = await this.contract.methods
                .establishTaxes(tax.entryTax, tax.withdrawalTax, tax.transactionTax, tax.stagnationTax).send({from: msgSender, gas: estimatedGas})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateSetNewOwner(msgSender: string, newOwner: string, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods.setOwner(newOwner).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async setNewOwner(msgSender: string, newOwner: string, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateSetNewOwner(msgSender, newOwner, toLog)
            const transactionHash = await this.contract.methods.setOwner(newOwner).send({from: msgSender, gas: estimatedGas})
            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateOpenBusiness(msgSender: string, businessName: string, point: PointDTO, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods.openBussiness(businessName, parseInt(`${point.lat*1e5}`), parseInt(`${point.lng*1e5}`)).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async openNewBusiness(msgSender: string, businessName: string, point: PointDTO, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateOpenBusiness(msgSender, businessName, point, toLog)
            const transactionHash = await this.contract.methods.openBussiness(businessName, parseInt(`${point.lat*1e5}`), parseInt(`${point.lng*1e5}`)).send({from: msgSender, gas: estimatedGas})
            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateChangeBusinessData(msgSender: string, business: BusinessData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods.changeBussinessData(business.id, business.brand, business.state).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async changeBusinessData(msgSender: string, business: BusinessData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateChangeBusinessData(msgSender, business, toLog)
            const transactionHash = await this.contract.methods.changeBussinessData(business.id, business.brand, business.state).send({from: msgSender, gas: estimatedGas})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateSetRevenue(msgSender: string, revenue: RevenueData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.contract.methods.establishRevenue(revenue.ownerRevenue, revenue.providerRevenue, revenue.exchangerRevenue).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async setRevenue(msgSender: string, revenue: RevenueData, toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const estimatedGas = await this.estimateSetRevenue(msgSender, revenue, toLog)
            const transactionHash = await this.contract.methods.establishRevenue(revenue.ownerRevenue, revenue.providerRevenue, revenue.exchangerRevenue).send({from: msgSender, gas: estimatedGas})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async estimateRedefineArea(msgSender: string, polygon: PointDTO[], toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const updatedArr = polygon.map(value => [parseInt(`${value.lat * 1e5}`), parseInt(`${value.lng * 1e5}`)]).join(',').split(",")
            const estimatedGas = await this.contract.methods.defineArea(updatedArr).estimateGas({from: msgSender})
            return estimatedGas * this.estimateTimes
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }

    async redefineArea(msgSender: string, polygon: PointDTO[], toLog: (log: Log) => void) {
        if (!this.contract) throw new Error("Contract is not defined")

        try {
            const updatedArr = polygon.map(value => [parseInt(`${value.lat * 1e5}`), parseInt(`${value.lng * 1e5}`)]).join(',').split(",")
            const estimatedGas = await this.estimateRedefineArea(msgSender, polygon, toLog)
            const transactionHash = await this.contract.methods.defineArea(updatedArr).send({from: msgSender, gas: estimatedGas})

            passNewMessage(transactionHash, "log", toLog)
        } catch (e: any) {
            passNewMessage(e.message, "error", toLog)
            throw e;
        }
    }
}

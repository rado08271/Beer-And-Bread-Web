import Web3 from "web3";
import SWeb3, {Keypair} from '@solana/web3.js';
import {BLOCKCHAIN_URL} from "../../../presentation/config/constants";

class NoAccountFoundError implements Error {
    message: string;
    name: string;

    constructor(accountAddress: string, allAddresses: string[]) {
        this.name = "NoAccountFound"
        this.message = "No account found " + accountAddress + " between addresses: " + allAddresses.join(" ")
    }
}

export default class EthereumBlockchainRepository {
    web3 = new Web3(Web3.givenProvider || `${BLOCKCHAIN_URL}`)

    createAccount () {
        const keyPair = Keypair.generate()
        console.log(keyPair.secretKey)
        console.log(keyPair.publicKey)
        console.log(keyPair)
    }

    async loginAccount(accountAddress: string) : Promise<boolean> {
        try {
            const accounts = await this.web3.eth.getAccounts()

            if (accounts.find(value => value === accountAddress)) {
                return true
            } else {
                throw new NoAccountFoundError(accountAddress, accounts)
            }
        } catch (e: any) {
            throw e;
        }
    }

    async getAccountBalance(accountAddress: string): Promise<number> {
        try {

            const balance = await this.web3.eth.getBalance(accountAddress)
            if (Number(balance)) {
                return parseInt(balance)
            } else {
                throw new Error("Error")
            }
        } catch (e: any) {
            throw e;
        }
    }


}
import axios from "axios";
import {APP_URL } from "../../../presentation/config/constants";

export default class FundsRepository {
    async fundWallet(accountAddress: string): Promise<{ status: number, hash: string }> {
        try {
            const response = await axios.get(`${APP_URL}/account/fund/${accountAddress}`, {headers: {"Content-type": "application/json"}})
            if (response.status !== 200) {
                throw new Error("Funds could not be sent" + response.data)
            }
            return {hash: JSON.stringify(response.data, null, 4), status: response.status}
        } catch (e: any) {
            throw e;
        }
    }

    async unlockAccount(accountAddress: string): Promise<{ status: number, hash: string }> {
        try {
            const response = await axios.get(`${APP_URL}/account/unlock/${accountAddress}?password=heslo`, {headers: {"Content-type": "application/json"}})
            if (response.status !== 200) {
                throw new Error("Account cannot be unlocked " + response.data)
            }
            return {hash: JSON.stringify(response.data, null, 4), status: response.status}
        } catch (e: any) {
            throw e;
        }
    }

}
import axios, {Axios} from "axios";
import Contract from "../../entity/contractDto";
import {APP_URL} from "../../../presentation/config/constants";

export default class ContractRepository {
    async getAllContracts(): Promise<Contract[]> {
        const response = await axios.get(`${APP_URL}/contract`, {headers: {"Content-type": "application/json"}})

        return response.data
    }

    async getContractByID(contractID: String): Promise<Contract> {
        const response = await axios.get(`${APP_URL}/contract/${contractID}`, {headers: {"Content-type": "application/json"}})

        return response.data
    }
}
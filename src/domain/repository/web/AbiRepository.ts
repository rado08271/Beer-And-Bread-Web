import axios from "axios";
import Abi from "../../entity/abiDto";
import {APP_URL} from "../../../presentation/config/constants";

export default class AbiRepository {
    async getAllAbis(): Promise<Abi[]> {
        const response = await axios.get(`${APP_URL}/abi`, {headers: {"Content-type": "application/json"}})

        return response.data
    }

    async getAbiByID(abiId: String): Promise<Abi> {
        const response = await axios.get(`${APP_URL}/abi/${abiId}`, {headers: {"Content-type": "application/json"}})

        return response.data
    }
}
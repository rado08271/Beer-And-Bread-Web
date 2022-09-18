import axios from "axios";
import { APP_URL } from "../../../presentation/config/constants";
import Log from "../../entity/logDto";

export default class LogRepository {
    async getAllLogs(): Promise<Log[]> {
        const response = await axios.get(`${APP_URL}/logs`, {headers: {"Content-type": "application/json"}})

        return response.data
    }

    async getLogsPaged(age: number, lastLog: number): Promise<Log[]> {
        const response = await axios.get(`${APP_URL}/logs?age=${age}&lastLog=${lastLog}`, {headers: {"Content-type": "application/json"}})

        return response.data
    }

    async createNewLogEntry(log: Log): Promise<boolean> {
        const response = await axios.post(`${APP_URL}logs/push`, log)

        return response.status === 200
    }

}
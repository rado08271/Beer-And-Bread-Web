import Log, {LogType} from "../../entity/logDto";
import axios from "axios";
import PointDTO from "../../entity/contractDto/PointDTO";
import DeployDataDTO from "../../entity/contractDto/DeployDataDTO";
import { APP_URL } from "../../../presentation/config/constants";

export default class TokenRepository {
    // dispatch = useDispatch()

    async createNewTokenWithLogging(msgSender: string, tokenName: string, tokenSymbol: string, polygons: PointDTO[], onLog: (log: Log) => void) {
        const deployData: DeployDataDTO = {deployer: msgSender, contract: {name: tokenName}, token: {area: polygons, symbol: tokenSymbol, name: tokenName}}
        const response = await axios.post(`${APP_URL}/create`, JSON.stringify(deployData),{
            headers: {"Content-Type": "application/json"},
            onDownloadProgress: progressEvent => {
                if (progressEvent.currentTarget.response) {
                    const logs: string[] = progressEvent.currentTarget.response.split(`</pre>`).filter(((value: string) => value !== ""))


                    logs.forEach((logMessages) => {
                        onLog({
                            logMessage: `${logMessages}</pre>`,
                            logTimestamp: new Date().toUTCString(),
                            logStatus: ((logMessages.toLowerCase()).includes("error")) ? LogType.ERROR : LogType.LOG
                        })

                    })
                }
            }
        })

        return response.status
    }

}
import Log from "../entity/logDto";

const deployLogsProcess: Log[] = []
export default deployLogsProcess

export function addNewDeployLogToLogger(log: Log) {

    deployLogsProcess.push(log)
    console.log("Log added to ", deployLogsProcess)
}


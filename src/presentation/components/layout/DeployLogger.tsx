import {useEffect} from "react";
import {Button, Card, CardContent, Paper, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import addNewDeployLogData, {deployLogsSelector} from "../../../data/actions/addNewDeployLogAction";
import DeployLogsList from "../list/DeployLogsList";

export default function DeployLogger() {
    const dispatch = useDispatch()
    const loggerData = useSelector(deployLogsSelector)

    return (
        <Paper variant={"outlined"}>
            <Stack justifyContent={"flex-start"}>
                <Button disabled={loggerData.length <= 0} onClick={() => dispatch(addNewDeployLogData([]))}>Clear Logs</Button>
            </Stack>

            {loggerData.length > 0 ? <DeployLogsList/> : <Typography align={"center"}>No logs available yet ...</Typography>}
        </Paper>
    )
}
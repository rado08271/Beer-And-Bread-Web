import {Grid, Stack} from "@mui/material";
import LogsItem from "./LogsItem";
import Log, {LogType} from "../../../domain/entity/logDto";
import {useSelector} from "react-redux";
import {deployLogsSelector} from "../../../data/actions/addNewDeployLogAction";

interface Props {
}

export default function DeployLogsList(props: Props) {
    const logger = useSelector(deployLogsSelector)

    return (
        <Stack
            direction={"column-reverse"} spacing={2} justifyContent={"flex-start"}>
            {
                logger.map((currentLog, index) =>
                    <Grid key={index} item md={12}>
                        <LogsItem key={index} log={currentLog} unstyled={true}/>
                    </Grid>
                )
            }
        </Stack>
    )
}
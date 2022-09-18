import {Divider, Grid, Stack} from "@mui/material";
import LogsItem from "./LogsItem";
import Log, {LogType} from "../../../domain/entity/logDto";
import {useSelector} from "react-redux";
import {eventsLogSelector} from "../../../data/actions/addNewEventLogAction";

interface Props {
}

export default function EventLogsList(props: Props) {
    const logger = useSelector(eventsLogSelector)

    return (
        <Stack
            direction={"column-reverse"} spacing={2} justifyContent={"flex-start"}>
            {
                logger.map((currentLog, index) =>
                    <Grid key={index} item md={12}>
                        <LogsItem key={index} log={currentLog}/>
                        <Divider/>
                    </Grid>
                )
            }
        </Stack>
    )
}
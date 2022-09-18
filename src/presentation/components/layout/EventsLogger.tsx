import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Paper, Stack, Typography} from "@mui/material";
import DeployLogsList from "../list/DeployLogsList";
import addNewEventLogData, {eventsLogSelector} from "../../../data/actions/addNewEventLogAction";
import EventLogsList from "../list/EventLogsList";

export default function EventsLogger() {
    const dispatch = useDispatch()
    let loggerData = useSelector(eventsLogSelector)

    return (
        <Paper variant={"outlined"}>
            <Stack justifyContent={"flex-start"}>
                <Button disabled={loggerData.length <= 0} onClick={() => dispatch(addNewEventLogData([]))}>Clear Logs</Button>
            </Stack>

             {loggerData.length > 0 ? <EventLogsList/> : <Typography align={"center"}>No logs available yet ...</Typography>}
         </Paper>
    )
}
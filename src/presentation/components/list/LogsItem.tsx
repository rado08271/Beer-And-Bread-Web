import Log, {LogType} from "../../../domain/entity/logDto";
import {ForwardedRef, ReactElement, useEffect, useRef} from "react";
import {Box, Container, Slide, Stack, Typography} from "@mui/material";
import {makeStyles} from "@material-ui/core";

interface Props {
    log: Log,
    unstyled?: boolean
}

const logItemStyle = makeStyles((theme) => ({
    itemSuccess: {},
    itemError: {
        background: theme.palette.error.light,
    }
}))


export default function LogsItem(props: Props): ReactElement {
    const style = logItemStyle()
    const containerRef = useRef(null);

    const renderToken = () => {
        if (props.log.tokenMessage)
            return (<Stack direction={"column"}>
                <Typography variant={"caption"}>From: {props.log.tokenMessage.from}</Typography>
                <Typography variant={"caption"}>To: {props.log.tokenMessage.from}</Typography>
                <Typography variant={"caption"}>Hash: {props.log.tokenMessage.transactionHash}</Typography>
                <Typography variant={"caption"}>Gas: {props.log.tokenMessage.gasUsed}</Typography>
                <Typography variant={"caption"}>Block: {props.log.tokenMessage.blockNumber}</Typography>
                {props.log.tokenMessage.event ?
                    <Stack direction={"column"} justifyContent={"flex-end"} alignItems={"flex-end"}>
                        {!props.log.tokenMessage.event.ExchangerEvent ? <></> :
                            <Stack>
                                <Typography variant={"caption"}>Date: {JSON.stringify(props.log.tokenMessage.event.ExchangerEvent.date)}</Typography>
                                <Typography variant={"caption"}>Exchanger: {JSON.stringify(props.log.tokenMessage.event.ExchangerEvent.exchanger)}</Typography>
                                <Typography variant={"caption"}>Staked: {JSON.stringify(props.log.tokenMessage.event.ExchangerEvent.staked)}</Typography>
                            </Stack>
                        }
                        {!props.log.tokenMessage.event.TransferEvent ? <></> :
                            <Stack>
                                <Typography variant={"caption"}>Date: {JSON.stringify(props.log.tokenMessage.event.TransferEvent.date)}</Typography>
                                <Typography variant={"caption"}>From: {JSON.stringify(props.log.tokenMessage.event.TransferEvent.from)}</Typography>
                                <Typography variant={"caption"}>To: {JSON.stringify(props.log.tokenMessage.event.TransferEvent.to)}</Typography>
                                <Typography variant={"caption"}>Transaction: {JSON.stringify(props.log.tokenMessage.event.TransferEvent.transaction)}</Typography>
                                <Typography variant={"caption"}>Transaction Tax: {JSON.stringify(props.log.tokenMessage.event.TransferEvent.transactionTax)}</Typography>
                            </Stack>
                        }
                        {!props.log.tokenMessage.event.UserEvent ? <></> :
                            <Stack>
                                <Typography variant={"caption"}>Date: {JSON.stringify(props.log.tokenMessage.event.UserEvent.date)}</Typography>
                                <Typography variant={"caption"}>Address: {JSON.stringify(props.log.tokenMessage.event.UserEvent.userAddress)}</Typography>
                                <Typography variant={"caption"}>Funded: {JSON.stringify(props.log.tokenMessage.event.UserEvent.funded)}</Typography>
                                <Typography variant={"caption"}>Received: {JSON.stringify(props.log.tokenMessage.event.UserEvent.received)}</Typography>
                            </Stack>
                        }
                        {!props.log.tokenMessage.event.BussinessEvent ? <></> :
                            <Stack>
                                <Typography variant={"caption"}>Date: {JSON.stringify(props.log.tokenMessage.event.BussinessEvent.date)}</Typography>
                                <Typography variant={"caption"}>Business: {JSON.stringify(props.log.tokenMessage.event.BussinessEvent.bussiness)}</Typography>
                                <Typography variant={"caption"}>Location: {JSON.stringify(props.log.tokenMessage.event.BussinessEvent.location)}</Typography>
                            </Stack>
                        }
                    </Stack> : <></>
                }
            </Stack>
        )
    }

    return (
        <Box ref={containerRef} className={props.log.logStatus !== LogType.LOG ? style.itemError: style.itemSuccess}>
            <Container>
                <Slide container={containerRef.current} timeout={100} key={props.log.logMessage} in direction={"left"}>
                    <Stack direction={"column"}>
                        <Typography variant={"overline"} align={"right"}>{props.log.logTimestamp}</Typography>
                        {!props.unstyled ?
                            <Stack direction={"column"} spacing={2}>
                                {!props.log.tokenMessage
                                    ? <Typography variant={"caption"}>{props.log.logMessage}</Typography>
                                    : renderToken()
                                }
                            </Stack>

                            : <div dangerouslySetInnerHTML={{__html: props.log.logMessage}}>{}</div>
                        }
                    </Stack>
                </Slide>
            </Container>
        </Box>

    )
}
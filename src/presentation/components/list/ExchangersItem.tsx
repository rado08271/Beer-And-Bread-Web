import {Container, Divider, Stack, Typography} from "@mui/material";
import {ExchangerData} from "../../../domain/entity/model/ExchangerData";
import {exchangersSelector} from "../../../data/actions/getAllExchangersAction";
import {useSelector} from "react-redux";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";

interface Props {
    exchanger: ExchangerData
}

export default function ExchangersItem(props: Props) {
    const tokenSymbol = useSelector(tokenSymbolSelector)
    return (
        <Container>
            {/*<Typography>{props.exchanger.exchanger.slice(0,5) + "..." + props.exchanger.exchanger.slice(props.exchanger.exchanger.length - 5,props.exchanger.exchanger.length)}</Typography>*/}
            <Typography align={"center"}>{props.exchanger.exchanger}</Typography>
            <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
                <Stack>
                    <Typography variant={"caption"}>Staked:</Typography>
                    <Typography>{parseFloat(props.exchanger.fullAmountForExchanging) / 1e9} {tokenSymbol}</Typography>
                </Stack>
                <Stack direction={"column"} alignItems={"flex-end"}>
                    <Typography variant={"caption"}>Succesful exchanges:</Typography>
                    <Typography>{props.exchanger.exchangesCounter} x</Typography>
                </Stack>
            </Stack>
            <Divider/>
        </Container>

    )
}
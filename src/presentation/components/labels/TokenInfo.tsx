import {Container, Divider, Skeleton, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import getTokenName, {tokenNameSelector} from "../../../data/actions/getTokenNameAction";
import getTokenSymbol, {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";

import {useEffect} from "react";

export default function TokenInfo () {
    const dispatch = useDispatch()

    const tokenName = useSelector(tokenNameSelector)
    const tokenSymbol = useSelector(tokenSymbolSelector)

    useEffect(() => {
        dispatch(getTokenName({}))
        dispatch(getTokenSymbol({}))
    }, [dispatch])

    return (
        <Stack
            direction={"row"}
            spacing={2}
        >
            <Typography variant="h5">{tokenName === "" ? <Skeleton/> : tokenName.length > 15 ? tokenName.substring(0, 12) + "..." : tokenName }</Typography>
            <Typography variant="h5" color={"#c7c7c7"}>{tokenSymbol === "" ? <Skeleton/> : tokenSymbol}</Typography>
        </Stack>
    )
}
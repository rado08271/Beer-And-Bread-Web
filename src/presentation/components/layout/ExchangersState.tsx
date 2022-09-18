import {useEffect, useRef} from "react";
import {Card, CardContent, Container, Divider, Grid, Paper, Skeleton, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import getAllExchangers, { exchangersLoadingSelector,} from "../../../data/actions/getAllExchangersAction";
import ExchangersList from "../list/ExchangersList";

export default function ExchangersState() {
    const dispatch = useDispatch()
    const exchangersLoading = useSelector(exchangersLoadingSelector)

    useEffect(() => {
        dispatch(getAllExchangers({}))
    }, [dispatch])

    return (
        <Paper>
            {exchangersLoading ? <Skeleton/> : <ExchangersList/>}
        </Paper>

    )
}
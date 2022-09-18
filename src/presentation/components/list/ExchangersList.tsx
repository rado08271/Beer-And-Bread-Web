import {Box, Container, Divider, Grid, Pagination, Stack, TablePagination, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {exchangersSelector} from "../../../data/actions/getAllExchangersAction";
import ExchangersItem from "./ExchangersItem";
import {useEffect, useState} from "react";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import WarningIcon from '@mui/icons-material/Warning';

export default function ExchangersList() {
    const tokenSymbol = useSelector(tokenSymbolSelector)
    const exchangers = useSelector(exchangersSelector)
    const [currentPage, setNewPage] = useState(0)
    const perPage = 5

    useEffect(() => {
    }, [exchangers])

    return (
        <div>
            {(exchangers === null || exchangers.length <= 0) ?
                <Stack spacing={2}>
                    <Typography textAlign={"center"}>No exchangers yet available, you can join, by staking some {tokenSymbol}</Typography>
                    <Typography textAlign={"center"}><WarningIcon/></Typography>
                </Stack> :
                <>
                    <Grid container spacing={2}>
                        {exchangers
                            .slice(0, ((currentPage + 1) * perPage >= exchangers.length) ? exchangers.length : (currentPage + 1) * perPage)
                            .map((exchanger, index) =>
                                <Grid key={index} item md={12}>
                                    <ExchangersItem exchanger={exchanger}/>
                                </Grid>
                            )}
                    </Grid>

                    <Stack alignItems={"center"}>
                        <div>
                            <Pagination
                                onChange={(event, page) => setNewPage(page - 1)}
                                count={Math.ceil(exchangers.length / perPage)}
                                page={currentPage + 1}
                            />
                        </div>
                    </Stack>
                </>
             }
        </div>
    )
}
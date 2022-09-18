import {Badge, Box, Button, Card, CardActions, CardContent, Skeleton, Stack, Tooltip, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {useEffect} from "react";
import getBalance, {addressBalanceSelector} from "../../../data/actions/getAddressBalance";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import checkIsOwner, {isOwnerSelector} from "../../../data/actions/checkAccountIsOwnerAction";
import checkIsExchanger, {isExchangerSelector} from "../../../data/actions/checkAccountIsExchangerAction";
import checkIsActive, {isActiveSelector} from "../../../data/actions/checkAccountIsActiveAction";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CopyrightIcon from '@mui/icons-material/Copyright';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {makeStyles} from "@material-ui/core";
import {ExchangerData} from "../../../domain/entity/model/ExchangerData";
import getExchangerData, {exchangerSelector} from "../../../data/actions/getExchangerStatsAction";
import checkIsBusiness, {isBusinessSelector} from "../../../data/actions/checkAcountIsBusinessAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";

const accountStyle = makeStyles((theme) => ({
    acountRoles: {
        width: "100%",
    },
}))

export default function AccountState () {
    const dispatch = useDispatch()
    const style = accountStyle()

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const accountBalance: string = useSelector(addressBalanceSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);

    const isOwner: boolean = useSelector(isOwnerSelector)
    const isExchanger: boolean = useSelector(isExchangerSelector)
    const isUser: boolean = useSelector(isActiveSelector)
    const isBusiness: boolean = useSelector(isBusinessSelector)
    const exchanger: ExchangerData | null = useSelector(exchangerSelector)

    useEffect(() => {
        if (accountAddress !== "" && accountBalance === "") {
            dispatch(getBalance({address: accountAddress}))
            dispatch(checkIsOwner({address: accountAddress}))
            dispatch(checkIsExchanger({address: accountAddress}))
            dispatch(checkIsActive({address: accountAddress}))
            dispatch(checkIsBusiness({address: accountAddress}))
        }
    }, [accountAddress])

    useEffect(() => {
        if (isExchanger) {
            dispatch(getExchangerData({address: accountAddress}))
        }
    }, [isExchanger])


    return (
        <Card style={{
            // width: "93vw"
        }}>
            <CardContent>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <div>
                        <Typography variant={"caption"}>Account address:</Typography>
                        {accountAddress === "" ? <Skeleton/> : <Typography variant={"body1"}>{accountAddress}</Typography>}
                    </div>

                    <Stack direction={"column"} alignItems={"flex-end"}>
                        <Typography variant={"caption"} >Account balance:</Typography>
                        {accountBalance === "" ? <Skeleton/> : <Typography variant={"body1"}>{parseFloat(accountBalance) / 1e9} {tokenSymbol}</Typography>}
                    </Stack>

                </Stack>

                {
                    !exchanger ? <span/> :
                    <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                        <div>
                            <Typography variant={"caption"}>Successful exchanges:</Typography>
                            {accountAddress === "" ? <Skeleton/> : <Typography variant={"body1"}>{exchanger.exchangesCounter}</Typography>}
                        </div>

                        <Stack direction={"column"} alignItems={"flex-end"}>
                            <Typography variant={"caption"}>Staked for exchange:</Typography>
                            {accountBalance === "" ? <Skeleton/> : <Typography variant={"body1"}>{parseFloat(exchanger.fullAmountForExchanging)/1e9} {tokenSymbol}</Typography>}
                        </Stack>

                    </Stack>
                }

            </CardContent>
            <CardActions>
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"} className={style.acountRoles}>
                    {isOwner ? <Tooltip title={"Owner"}><CopyrightIcon/></Tooltip> : <></>}
                    {isBusiness ? <Tooltip title={"Business owner"}><StorefrontIcon/></Tooltip> : <></>}
                    {isExchanger ? <Tooltip title={"Exchanger"}><CurrencyExchangeIcon/></Tooltip> : <></>}
                    {isUser ? <Tooltip title={"Active User"}><PersonOutlineIcon/></Tooltip> : <></>}
                </Stack>
            </CardActions>
        </Card>

    )
}
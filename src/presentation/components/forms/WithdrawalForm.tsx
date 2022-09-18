import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup, InputAdornment, Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {actionInputStyle} from "./TransferForm";
import {useDispatch, useSelector} from "react-redux";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import {tokenErrorSelector, tokenStateSelector} from "../../../data/actions/getTokenReducerStateAction";
import getTaxes, {withdrawalTaxesSelector} from "../../../data/actions/getTaxesAction";
import withdrawGasPriceEstimate, {withdrawGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForWithdrawAction";
import withdrawFunds, {withdrawalLoadingSelector} from "../../../data/actions/directTokenActions/makeWithdrawFundsAction";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";

export default function WithdrawalForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("")

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const withdrawalTax: number = useSelector(withdrawalTaxesSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const withdrawalLoading: boolean = useSelector(withdrawalLoadingSelector);
    const gasPrice: number = useSelector(withdrawGasPriceSelector);

    useEffect(() => {
        dispatch(getTaxes({}))
    }, [dispatch])

    useEffect(() => {
        if (withdrawAmount.length > 0 && !isNaN(parseInt(withdrawAmount)) && (parseInt(withdrawAmount)) > 1) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [withdrawAmount])

    function toWithdrawPotentially(): string {
        const number =  parseInt(withdrawAmount) - parseInt(withdrawAmount) / 100 * withdrawalTax
        const precision = `${number}`.split(".");
        if (precision.length === 2 && precision[1].length > 2 ) {
            return precision[0] + precision[1].substring(0, 2)
        }
        return `${number}`
    }

    function getGasPrice() {
        if (valid) {
            dispatch(withdrawGasPriceEstimate({
                msgSender: accountAddress,
                toWithdraw: parseFloat(withdrawAmount),
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doWithdraw() {
        if (valid) {
            dispatch(withdrawFunds({
                msgSender: accountAddress,
                toWithdraw: parseFloat(withdrawAmount),
                toLog: (log) => {
                    dispatch(addNewEventLogData(log))
                }
            }))
        }
    }

    return (
        <Card className={style.container}>
            <CardHeader
                title={"Withdrawal"}
                subheader={`Withdraw funds from ${tokenSymbol}, for exchange for real money, you will pay taxes for you transaction!`}/>
            <CardContent>
                <Stack direction={"column"} spacing={2} >
                    <FormControl
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && valid) doWithdraw()
                        }}
                    >
                        <FormGroup className={style.inputs}>
                            <TextField
                                type={"number"} variant={"standard"} label={"Withdraw Amount"} placeholder={"1000"} rows={1} error={error !== null}
                                onChange={event => setWithdrawAmount(event.target.value)} required
                                InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>{tokenSymbol}</InputAdornment>,}}/>
                        </FormGroup>
                    </FormControl>

                    <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                        <div>
                            <Typography variant={"caption"}>Taxes:</Typography>
                            {
                                withdrawalTax < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{withdrawalTax}%</Typography>
                            }
                        </div>
                        <div>
                            <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                            {
                                gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                            }
                        </div>
                        <TextField
                            variant={"standard"} label={"GWEI To Withdraw (Potentially)"} disabled value={valid ? (toWithdrawPotentially()) : "..."} rows={1} />
                        <Button variant={"contained"} disabled={!valid} onClick={doWithdraw}>Withdraw</Button>
                    </Stack>
                </Stack>
            </CardContent>
            {withdrawalLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}

        </Card>
    )
}
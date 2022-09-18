import {
    Backdrop,
    Box, Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup, IconButton,
    InputAdornment, Skeleton,
    Stack,
    TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {actionInputStyle} from "./TransferForm";
import {useDispatch, useSelector} from "react-redux";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import {tokenErrorSelector, tokenStateSelector} from "../../../data/actions/getTokenReducerStateAction";
import getTaxes, {depositTaxesSelector} from "../../../data/actions/getTaxesAction";
import depositFunds, {depositLoadingSelector} from "../../../data/actions/directTokenActions/makeDepositFundsAction";
import depositGasPriceEstimate, {depositGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForDepositAction";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import GasMeterIcon from '@mui/icons-material/GasMeter';
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";

export default function DepositForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [depositAmount, setDepositAmount] = useState("")
    const [gweiAmount, setGweiAmount] = useState("")

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const depositTaxes: number = useSelector(depositTaxesSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const depositLoading: boolean = useSelector(depositLoadingSelector);
    const gasPrice: number = useSelector(depositGasPriceSelector);

    useEffect(() => {
        dispatch(getTaxes({}))
    }, [dispatch])

    useEffect(() => {
        const preGwei = gweiAmount === "" ? depositAmount : gweiAmount
        if ((depositAmount.length > 0 && !isNaN(parseInt(depositAmount)) && (parseInt(depositAmount)) > 0 &&
            (preGwei.length > 0 && !isNaN(parseInt(preGwei)) && (parseInt(preGwei)) > 0) &&
            parseInt(depositAmount) <= parseInt(preGwei)
        )) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [depositAmount, gweiAmount])

    function toDepositPotentially(): string {
        const number =  parseInt(depositAmount) + parseInt(depositAmount) / 100 * depositTaxes
        const precision = `${number}`.split(".");
        if (precision.length === 2 && precision[1].length > 2 ) {
            return precision[0] + precision[1].substring(0, 2)
        }
        return `${number}`
    }

    function getGasPrice() {
        if (valid) {
            const preGwei = gweiAmount === "" ? depositAmount : gweiAmount
            dispatch(depositGasPriceEstimate({
                msgSender: accountAddress,
                toDeposit: parseFloat(depositAmount),
                gweiToPay: parseFloat(preGwei),
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doDeposit() {
        if (valid) {
            const preGwei = gweiAmount === "" ? depositAmount : gweiAmount
            dispatch(depositFunds({
                msgSender: accountAddress,
                toDeposit: parseFloat(depositAmount),
                gweiToPay: parseFloat(preGwei),
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Deposit"}
                subheader={`Deposit funds to ${tokenSymbol}, you will be credited with extra funds for discovering beauties of complementary currencies. If you pay more GWEI than needed, you will receive change`}/>
            <CardContent>
                <Stack direction={"column"} spacing={2}>
                    <FormControl
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && valid) doDeposit()
                        }}
                    >
                        <FormGroup className={style.inputs}>
                            <TextField
                                type={"number"} variant={"standard"} label={"Deposit Amount"} placeholder={"1000"}
                                rows={1} error={error !== null}
                                onChange={event => setDepositAmount(event.target.value)} required
                                InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>{tokenSymbol}</InputAdornment>}}/>

                            <TextField
                                type={"number"} variant={"standard"} label={"Payment in gwei"} placeholder={"1000"}
                                rows={1} error={error !== null}
                                onChange={event => setGweiAmount(event.target.value)} required
                                value={gweiAmount === "" ? depositAmount : gweiAmount}
                                InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>gwei</InputAdornment>}}/>
                        </FormGroup>
                    </FormControl>

                    <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                        <div>
                            <Typography variant={"caption"}>Taxes:</Typography>
                            {
                                depositTaxes < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{depositTaxes}%</Typography>
                            }
                        </div>
                        <div>
                            <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                            {
                                gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                            }
                        </div>
                        <TextField
                            variant={"standard"} label={"To Deposit (Potentially)"} disabled value={valid ? toDepositPotentially() : "..."} rows={1}/>
                        <Button variant={"contained"} disabled={!valid} onClick={doDeposit}>Deposit</Button>
                    </Stack>
                </Stack>

            </CardContent></>
            {depositLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}

        </Card>
    )
}

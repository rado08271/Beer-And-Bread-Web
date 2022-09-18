import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup,
    InputAdornment, Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import {useEffect, useState} from "react";
import stakeGasPriceEstimate, {stakeGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForStakeAction";
import stakeFunds, {stakeLoadingSelector} from "../../../data/actions/directTokenActions/makeStakeFundsAction";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";

export default function StakeForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [stakeAmount, setStakeAmount] = useState("")
    const [gweiAmount, setGweiAmount] = useState("")

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const stakeLoading: boolean = useSelector(stakeLoadingSelector);
    const gasPrice: number = useSelector(stakeGasPriceSelector);

    useEffect(() => {
        const preGwei = gweiAmount === "" ? stakeAmount : gweiAmount
        if ((stakeAmount.length > 0 && !isNaN(parseInt(stakeAmount)) && (parseInt(stakeAmount)) > 0 &&
            (preGwei.length > 0 && !isNaN(parseInt(preGwei)) && (parseInt(preGwei)) > 0) &&
            parseInt(stakeAmount) <= parseInt(preGwei)
        )) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [stakeAmount, gweiAmount])

    function getGasPrice() {
        if (valid) {
            const preGwei = gweiAmount === "" ? stakeAmount : gweiAmount
            dispatch(stakeGasPriceEstimate({
                msgSender: accountAddress,
                toStake: parseFloat(stakeAmount),
                gweiToPay: parseFloat(preGwei),
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doStake() {
        if (valid) {
            const preGwei = gweiAmount === "" ? stakeAmount : gweiAmount
            dispatch(stakeFunds({
                msgSender: accountAddress,
                toStake: parseFloat(stakeAmount),
                gweiToPay: parseFloat(preGwei),
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Stake"}
                subheader={`Increase your staked ${tokenSymbol} to become exchanger, you will receive revenue from transfers. You will compete to benefit new deposits and to get withdrawals with fair conditions`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doStake()
                            }}
                        >
                            <FormGroup className={style.inputs}>
                                <TextField
                                    type={"number"} variant={"standard"} label={"Stake Amount"} placeholder={"1000"}
                                    rows={1} error={error !== null}
                                    onChange={event => setStakeAmount(event.target.value)} required
                                    InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>{tokenSymbol}</InputAdornment>}}/>

                                <TextField
                                    type={"number"} variant={"standard"} label={"Payment in gwei"} placeholder={"1000"}
                                    rows={1} error={error !== null}
                                    onChange={event => setGweiAmount(event.target.value)} required
                                    value={gweiAmount === "" ? stakeAmount : gweiAmount}
                                    InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>gwei</InputAdornment>}}/>
                            </FormGroup>
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>
                            <Button variant={"contained"} disabled={!valid} onClick={doStake}>Stake</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {stakeLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}

        </Card>
    )
}
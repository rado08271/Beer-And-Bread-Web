import {
    Button,
    Card, CardContent, CardHeader, CircularProgress,
    FormControl,
    FormGroup, InputAdornment, Skeleton, Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {makeStyles, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import {tokenErrorSelector, tokenStateSelector} from "../../../data/actions/getTokenReducerStateAction";
import getTaxes, {transferTaxesSelector} from "../../../data/actions/getTaxesAction";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import transferFunds, {transferLoadingSelector} from "../../../data/actions/directTokenActions/makeTransferFundsAction";
import transferFundsGasEstimate, {transferGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForTransferAction";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import showNotification from "../../../domain/service/NotificationService";
import {definedAreaSelector} from "../../../data/actions/getDefinedAreaAction";
import {isInside} from "../../../shared/utils/map";
import {businessAddressToPaySelector, businessToPaySelector} from "../../../data/actions/businessToPayAction";

export const actionInputStyle = makeStyles((theme: Theme) => ({
    container: {
        position: "relative",
    },
    inputs: {
        display: "flex",
        justifyContent: "space-between",
    },
    loading: {
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: `translate(50%,-50%)`,
    }
}))

export default function TransferForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [transferAmount, setTransferAmount] = useState("");
    const [transferAddress, setTransferAddress] = useState("");
    const [valid, setIsValid] = useState(false);
    const [lastKnownLocation, setLastKnownLocation] = useState<PointDTO>({lat: 0, lng: 0});
    const [locationError, setLocationError] = useState<string | null>(null);

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const transferTax: number = useSelector(transferTaxesSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    const businessAddress = useSelector(businessAddressToPaySelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const transferLoading: boolean = useSelector(transferLoadingSelector);
    const gasPrice: number = useSelector(transferGasPriceSelector);
    const definedArea = useSelector(definedAreaSelector);

    useEffect(() => {
        dispatch(getTaxes({}))
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(position => {
                setLastKnownLocation({lat: position.coords.longitude, lng: position.coords.latitude})

                setLocationError(null)
            }, positionError => {
                setLocationError(positionError.message)
                showNotification({
                    type: "error",
                    message: positionError.message,
                    title: "Location error",
                    ttl: 20000
                })
            }, {enableHighAccuracy: true, maximumAge: 10000})
        } else {
            setLocationError("Your device does not support location services")
        }
    }, [dispatch])

    useEffect(() => {

        if (businessAddress) setTransferAddress(businessAddress)
    }, [businessAddress])

    useEffect(() => {
        if ((transferAmount.length > 0 && !isNaN(parseInt(transferAmount)) && (parseInt(transferAmount)) > 0) &&
            (transferAddress.startsWith("0x") && transferAddress.length === 42) && locationError === null && isInside(definedArea, lastKnownLocation)) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [transferAmount, transferAddress, locationError])

    function toTransferPotentially(): string {
        const number =  parseInt(transferAmount) - parseInt(transferAmount) / 100 * transferTax
        const precision = `${number}`.split(".");
        if (precision.length === 2 && precision[1].length > 2 ) {
            return precision[0] + precision[1].substring(0, 2)
        }
        return `${number}`
    }

    async function getGasPrice() {
        if (valid) {
            dispatch(transferFundsGasEstimate({
                msgSender: accountAddress,
                transferReceiver: transferAddress,
                fundsToTransfer: parseFloat(transferAmount),
                location: lastKnownLocation,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doTransfer() {
        if (valid) {
            dispatch(transferFunds({
                msgSender: accountAddress,
                transferReceiver: transferAddress,
                fundsToTransfer: parseFloat(transferAmount),
                location: lastKnownLocation,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <CardHeader
                title={"Transfer"}
                subheader={"Transfer your funds to recipient address, (payment for product, etc)"}/>
            <CardContent>
                <Stack direction={"column"} spacing={2} >
                    <FormControl
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && valid) doTransfer()
                        }}
                    >
                        <FormGroup className={style.inputs}>
                            <TextField
                                variant={"standard"} label={"Recipient Address"} value={transferAddress} placeholder={"0x0000000000000000000000000000000000000000"} rows={1} error={error !== null}
                                onChange={event => setTransferAddress(event.target.value)} required/>
                            <TextField
                                type={"number"} variant={"standard"} label={"Transfer Amount"} value={transferAmount} placeholder={"1000"} rows={1} error={error !== null}
                                onChange={event => setTransferAmount(event.target.value)} required
                                InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>{tokenSymbol}</InputAdornment>,}}/>
                        </FormGroup>
                    </FormControl>

                    <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                        <div>
                            <Typography variant={"caption"}>Taxes:</Typography>
                            {
                                transferTax < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{transferTax}%</Typography>
                            }
                        </div>
                        <div>
                            <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                            {
                                gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                            }
                        </div>
                        <TextField
                            variant={"standard"} label={"Final Amount (Potentially)"} disabled value={valid ? toTransferPotentially() : "..."} rows={1} />
                        <Button variant={"contained"} disabled={!valid} onClick={doTransfer}>transfer</Button>
                    </Stack>
                </Stack>
            </CardContent>
            {transferLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}

        </Card>
    )
}
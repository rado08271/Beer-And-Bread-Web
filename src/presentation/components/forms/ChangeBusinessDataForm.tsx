import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    FormControl, FormControlLabel,
    FormGroup,
    Skeleton,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {useEffect, useState} from "react";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import BusinessData, {BussinessState} from "../../../domain/entity/model/BusinessData";
import changeBusiness, {
    changeBusinessLoadingSelector
} from "../../../data/actions/directTokenActions/makeChangeBusinessAction";
import changeBusinessEstimate, {
    changeBusinessGasPriceSelector
} from "../../../data/actions/directTokenActions/getGasPriceForChangeBusinessAction";

interface Props {
    businessData: BusinessData
    onSuccess?: () => void
}


export default function ChangeBusinessDataForm(props: Props) {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState("")
    const [businessState, setNewBusinessState] = useState<BussinessState>(BussinessState.UNKNOWN)
    const [business, setBusiness] = useState<BusinessData>(props.businessData)
    const [dispatchedAction, setDispatchedAction] = useState(false)

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const changeOwnerLoading: boolean = useSelector(changeBusinessLoadingSelector);
    const gasPrice: number = useSelector(changeBusinessGasPriceSelector);

    useEffect(() => {
        if (!changeOwnerLoading && dispatchedAction && props.onSuccess) {
            props.onSuccess()
        }
    }, [changeOwnerLoading])

    useEffect(() => {
        setNewBusinessName(props.businessData.brand)
        setNewBusinessState(props.businessData.state)
        setBusiness(props.businessData)
    }, [props.businessData])

   useEffect(() => {
        if (newBusinessName.length > 0) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [newBusinessName,])

    function getGasPrice() {
        if (valid ) {
            dispatch(changeBusinessEstimate({
                msgSender: accountAddress,
                business: {
                    ...business,
                    brand: newBusinessName,
                    state: businessState
                },
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doChangeBusiness() {
        if (valid) {
            dispatch(changeBusiness({
                msgSender: accountAddress,
                business: {
                    ...business,
                    brand: newBusinessName,
                    state: businessState
                },
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
            setDispatchedAction(true)
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Change Business"}
                subheader={`You are about to change data to ${business.brand} which is owned by ${business.owner}, rename it, or close it`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doChangeBusiness()
                            }}
                        >
                            <FormGroup className={style.inputs}>
                                <TextField
                                    variant={"standard"} label={"New Business name"} value={newBusinessName} placeholder={"My Big Business, co"}
                                    rows={1} error={error !== null}
                                    onChange={event => setNewBusinessName(event.target.value)} required/>
                            </FormGroup>
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>
                            {businessState === BussinessState.UNKNOWN ? <></> : <FormControlLabel
                                value="start"
                                control={
                                    <Switch
                                        defaultChecked={businessState === BussinessState.OPENED}
                                        onChange={(event, checked) =>
                                            setNewBusinessState(checked ? BussinessState.OPENED : BussinessState.CLOSED)}/>
                                }
                                label={businessState === BussinessState.OPENED ? "Opened" : "Closed"}
                                labelPlacement="top"
                            />}

                            <Button variant={"contained"} disabled={!valid} onClick={doChangeBusiness}>Change Business Data</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {changeOwnerLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}
        </Card>
    )
}
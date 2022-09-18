import {
    Button, Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup,
    InputAdornment,
    Skeleton,
    Stack,
    TextField, Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {useEffect, useState} from "react";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import openBusiness, {openBusinessLoadingSelector} from "../../../data/actions/directTokenActions/makeOpenBusinessAction";
import openBusinessEstimate, {openBusinessGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForOpenBusinessAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import {isInside} from "../../../shared/utils/map";
import {definedAreaSelector} from "../../../data/actions/getDefinedAreaAction";

interface Props {
    businessLocationFromMap: PointDTO | null
}

export default function OpenBusinessForm(props: Props) {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [businessName, setNewBusinessName] = useState("")

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const changeOwnerLoading: boolean = useSelector(openBusinessLoadingSelector);
    const gasPrice: number = useSelector(openBusinessGasPriceSelector);
    const definedArea = useSelector(definedAreaSelector);

    useEffect(() => {
        if (businessName.length > 0 && props.businessLocationFromMap != null && isInside(definedArea, props.businessLocationFromMap) ) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [businessName, props.businessLocationFromMap])

    function getGasPrice() {
        if (valid && props.businessLocationFromMap !== null) {
            dispatch(openBusinessEstimate({
                msgSender: accountAddress,
                name: businessName,
                position: props.businessLocationFromMap,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doOpenBusiness() {
        if (valid && props.businessLocationFromMap !== null) {
            dispatch(openBusiness({
                msgSender: accountAddress,
                name: businessName,
                position: props.businessLocationFromMap,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Open Business"}
                subheader={`Let others know you are open for business and accept ${tokenSymbol}, if you are unhappy with this service, you can close it later, just give it a try`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doOpenBusiness()
                            }}
                        >
                            <FormGroup className={style.inputs}>
                                <TextField
                                    variant={"standard"} label={"Business name"} placeholder={"My Big Business, co"}
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
                            <Button variant={"contained"} disabled={!valid} onClick={doOpenBusiness}>Open Business</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {changeOwnerLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}
        </Card>
    )
}
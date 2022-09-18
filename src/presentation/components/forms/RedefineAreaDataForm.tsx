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
import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import redefineAreaGasEstimate, {redefineAreaGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForRedefineAreaAction";
import redefineArea, {redefineAreaLoadingSelector} from "../../../data/actions/directTokenActions/makeRedefineAreaAction";
import {isOwnerSelector} from "../../../data/actions/checkAccountIsOwnerAction";

interface Props {
    polygon: PointDTO[]
    onSuccess?: () => void
}


export default function RedefineAreaDataForm(props: Props) {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [newPolygonArea, setNewPolygonArea] = useState<PointDTO[]>([]);
    const [dispatchedAction, setDispatchedAction] = useState(false)

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const redefineAreaLoading: boolean = useSelector(redefineAreaLoadingSelector);
    const gasPrice: number = useSelector(redefineAreaGasPriceSelector);
    const isOwner: boolean = useSelector(isOwnerSelector)

    useEffect(() => {
        if (!redefineAreaLoading && dispatchedAction && props.onSuccess) {
            props.onSuccess()
        }
    }, [redefineAreaLoading])

    useEffect(() => {
        if (props.polygon) setNewPolygonArea(props.polygon)
    }, [props.polygon])

   useEffect(() => {
        if (newPolygonArea.length > 3 && isOwner) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [newPolygonArea])

    function getGasPrice() {
        if (valid ) {
            dispatch(redefineAreaGasEstimate({
                msgSender: accountAddress,
                polygon: newPolygonArea,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doChangeBusiness() {
        if (valid) {
            dispatch(redefineArea({
                msgSender: accountAddress,
                polygon: newPolygonArea,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
            setDispatchedAction(true)
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Redefine Area"}
                subheader={`Are you willing to redefine currently set area in ${tokenSymbol}?`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doChangeBusiness()
                            }}
                        >
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>

                            <Button variant={"contained"} disabled={!valid} onClick={doChangeBusiness}>Redefine Area</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {redefineAreaLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}
        </Card>
    )
}
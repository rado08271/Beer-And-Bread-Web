import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {useEffect, useState} from "react";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import setRevenue, {setRevenueLoadingSelector} from "../../../data/actions/directTokenActions/makeSetRevenueAction";
import setRevenueEstimate, {setRevenueGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForSetRevenueAction";
import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup,
    Skeleton, Slider,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import RevenueData from "../../../domain/entity/model/RevenueData";
import getRevenue, {revenueSelector} from "../../../data/actions/getRevenueAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import {isOwnerSelector} from "../../../data/actions/checkAccountIsOwnerAction";

export default function SetRevenueForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [currentRevenue, setCurrentRevenue] = useState<RevenueData>({
        exchangerRevenue: 33, ownerRevenue: 34, providerRevenue: 33
    })

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    const previousRevenue: RevenueData = useSelector(revenueSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const setRevenueLoading: boolean = useSelector(setRevenueLoadingSelector);
    const gasPrice: number = useSelector(setRevenueGasPriceSelector);
    const isOwner: boolean = useSelector(isOwnerSelector)

    useEffect(() => {
        dispatch(getRevenue({}))
    }, [dispatch])

    useEffect(() => {
        if (currentRevenue.exchangerRevenue + currentRevenue.ownerRevenue + currentRevenue.providerRevenue === 100 && isOwner ) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [currentRevenue])

    useEffect(() => {
        if (previousRevenue && (previousRevenue.exchangerRevenue + previousRevenue.providerRevenue + previousRevenue.ownerRevenue === 100) ) {
            setCurrentRevenue({
                exchangerRevenue: previousRevenue.exchangerRevenue,
                ownerRevenue: previousRevenue.ownerRevenue,
                providerRevenue: previousRevenue.providerRevenue
            })
        }
    }, [previousRevenue])

    function getGasPrice() {
        if (valid) {
            dispatch(setRevenueEstimate({
                msgSender: accountAddress,
                revenue: currentRevenue,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doSetRevenue() {
        if (valid) {
            dispatch(setRevenue({
                msgSender: accountAddress,
                revenue: currentRevenue,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Set Revenue"}
                subheader={`Set revenue received from ${tokenSymbol} transfer for exchangers, owner and system provider`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Typography variant={"caption"}>Exchanger</Typography>
                                <Typography variant={"body2"}>{previousRevenue.exchangerRevenue < 0 ? <Skeleton/> : currentRevenue.exchangerRevenue + "%"}</Typography>
                            </div>

                            <div>
                                <Typography variant={"caption"}>Owner</Typography>
                                <Typography variant={"body2"}>{previousRevenue.ownerRevenue < 0 ? <Skeleton/> : currentRevenue.ownerRevenue + "%"}</Typography>
                            </div>

                            <div>
                                <Typography variant={"caption"}>Provider</Typography>
                                <Typography variant={"body2"}>{previousRevenue.providerRevenue < 0 ? <Skeleton/> : currentRevenue.providerRevenue + "%"}</Typography>
                            </div>
                        </Stack>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doSetRevenue()
                            }}
                        >
                            {previousRevenue.ownerRevenue < 0 ? <Skeleton/> :
                                <Slider
                                    track={false}
                                    valueLabelDisplay={"off"}
                                    disableSwap={true}
                                    onChange={(e, numbers: number | number[]) => {
                                        if (Array.isArray(numbers) && numbers.length === 2) {
                                            setCurrentRevenue({
                                                exchangerRevenue: numbers[0],
                                                ownerRevenue: numbers[1] - numbers[0],
                                                providerRevenue: 100 - numbers[1]
                                            })
                                        }
                                    }}
                                    defaultValue={[
                                        previousRevenue.exchangerRevenue < 0 ? 33 : previousRevenue.exchangerRevenue,
                                        previousRevenue.providerRevenue < 0 ? 67 : 100 - previousRevenue.providerRevenue]}
                                    marks={[{value: 25, label: "Exchanger"}, {value: 50, label: "Owner"}, {value: 75, label: "Provider"}]}
                                />
                            }
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>
                            <Button variant={"contained"} disabled={!valid} onClick={doSetRevenue}>Set Revenue</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {setRevenueLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}
        </Card>
    )

}
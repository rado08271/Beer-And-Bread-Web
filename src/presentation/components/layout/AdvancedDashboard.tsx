import {Box, Card, Divider, Grid, Stack, Typography} from "@mui/material";
import TokenInfo from "../labels/TokenInfo";
import {makeStyles} from "@material-ui/core";
import ContractInfo from "../labels/ContractInfo";
import DepositForm from "../forms/DepositForm";
import TransferForm from "../forms/TransferForm";
import WithdrawalForm from "../forms/WithdrawalForm";
import AccountState from "../labels/AccountState";
import StakeForm from "../forms/StakeForm";
import SetTaxesForm from "../forms/SetTaxesForm";
import ChangeOwnerForm from "../forms/ChangeOwnerForm";
import SetRevenueForm from "../forms/SetRevenueForm";
import ExchangersState from "./ExchangersState";
import EventsLogger from "./EventsLogger";
import MapAndBusinessPanel from "./MapAndBusinessPanel";

const dashboardStyle = makeStyles((theme) => ({
    container: {
        width: "100%",
        padding: theme.spacing(3),
    },
    main: {
        paddingTop: theme.spacing(4)
    }
}))

export default function AdvancedDashboard() {
    const style = dashboardStyle()

    return (
        <div className={style.container}>
            <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems="flex-end"
            >
                <TokenInfo/>
                <ContractInfo/>
            </Stack>

            <Divider orientation={"vertical"}/>
            <Grid
                container
                className={style.main}
                spacing={2}
            >
                <Grid item md={8} sm={12}>
                    <Grid container rowSpacing={2}>
                        <Grid item md={12} sm={12}>
                            <MapAndBusinessPanel/>
                        </Grid>
                        <Grid item md={12} sm={12}>
                            <Typography variant={"caption"}>Account Info</Typography>
                            <AccountState/>
                        </Grid>
                        <Grid container columnSpacing={2}>
                            <Grid item sm={12} md={6}>
                                <Typography variant={"caption"}>Account Actions</Typography>
                                <Stack direction={"column"} spacing={2}>
                                    <TransferForm/>
                                    <DepositForm/>
                                    <WithdrawalForm/>
                                </Stack>
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <Typography variant={"caption"}>Token Actions</Typography>
                                <Stack direction={"column"} spacing={2}>
                                    <StakeForm/>
                                    <SetTaxesForm/>
                                    <SetRevenueForm/>
                                    <ChangeOwnerForm/>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item md={4} sm={12}>
                    <Stack direction={"column"} spacing={2}>
                        <ExchangersState/>
                        <EventsLogger/>
                    </Stack>
                </Grid>
            </Grid>
        </div>
    )
}
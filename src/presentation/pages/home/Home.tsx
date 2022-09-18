import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container, Fab,
    Grid,
    Paper,
    Slide,
    Stack,
    Typography
} from "@mui/material";
import {makeStyles} from "@material-ui/core";

const homeStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        display: "flex",
    },
    card: {
        maxWidth: '30%',
        textAlign: "center"
    },
    name: {
        position: "fixed",
        bottom: 0,
        right: 0,
        padding: theme.spacing(2)
    }
}))

export default function Home() {
    const styles = homeStyles()

    return (
        <Box>
            <Stack className={styles.container} direction={"column"} justifyContent={"center"}  spacing={8}>
                <Stack alignSelf={"flex-end"} textAlign={"end"}>
                    <Typography variant={"h1"} color={"primary"}>Beer And Bread</Typography>
                    <Typography variant={"h4"}>Complementary cryptocurrencies provider</Typography>
                    <Typography variant={"body2"}>User interface to showcase possible inovative usage of cryptocurrencies in
                        current day and age</Typography>
                </Stack>
                <Stack direction={"column"} spacing={2} >
                    <Slide timeout={500} in direction={"up"}>
                        <Card className={styles.card}>
                            <CardHeader title={"Create new Cryptocurrency"}/>
                            <CardContent>Are you loving the idea, proceed, to create new complementary currency in your town and
                                let everyone in the area pay you in your new currency 🏙</CardContent>
                        </Card>
                    </Slide>
                    <Slide timeout={1000} in direction={"down"}>
                        <Card className={styles.card}>
                            <CardHeader title={"Use available currenies"}/>
                            <CardContent>You want to try already created currencies? Feel free to join any of them and be
                                rewarded with some extra money 🤑</CardContent>
                        </Card>
                    </Slide>
                    <Slide timeout={1500} in direction={"up"}>
                        <Card className={styles.card}>
                            <CardHeader title={"Stake money"}/>
                            <CardContent>By staking money you become exchanger, you will receive money with every transaction
                                and be responsible for currency money sources📈</CardContent>
                        </Card>
                    </Slide>
                    <Slide timeout={2000} in direction={"down"}>
                        <Card className={styles.card}>
                            <CardHeader title={"Open Business"}/>
                            <CardContent>If you are business and looking to adapt new form of payments in your shops or
                                services, join us! 🛍💈</CardContent>
                        </Card>
                    </Slide>
                    <Slide timeout={2500} in direction={"up"}>
                        <Card className={styles.card}>
                            <CardHeader title={"Don't hold money"}/>
                            <CardContent>Complementary currencies are not meant to be the form of savings or investments, they
                                are here to boost your local influence and to boost your town economy 🥇</CardContent>
                        </Card>
                    </Slide>
                </Stack>
            </Stack>
        </Box>
    )
}
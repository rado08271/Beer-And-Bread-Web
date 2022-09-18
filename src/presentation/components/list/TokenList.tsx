import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {allContractsSelector} from "../../../data/actions/getAllContractsAction";
import {getAllContracts} from "../../../data/reducers/contractsReducer";
import TokenItem from "./TokenItem";
import {Container, Grid, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

export default function TokenList() {
    const contracts = useSelector(allContractsSelector)
    const navigator = useNavigate()

    return (
        <Container>
            {
                contracts.length <= 0 ? <Typography align={"center"} textAlign={"center"} variant={"h4"}>There are no
                        currencies yet, start by <Link to={"/define"} >creating new</Link> complementary local currency!</Typography> :
                <Grid
                    container
                    spacing={4}
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="flex-start"
                >
                    {
                        contracts.map((contract, index) => {
                            if (index >= 0) {
                                return (
                                    <Grid onClick={() => {navigator(`/currency/${contract._id}`)}} item xs={12} md={6} lg={4} key={index}>
                                        <TokenItem key={index} areasNotThis={contracts
                                            .filter((ctx) => ctx !== contract)
                                            .map((value) => value.deployData.token.area)
                                        } contract={contract}/>
                                    </Grid>
                                )
                            }
                        })
                    }
                </Grid>
            }
        </Container>
    )
}
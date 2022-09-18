import {Card, CardMedia, CardContent, Stack, Typography, Grid, Paper, Container, Box, Skeleton} from "@mui/material";
import MapPlaceholderEditor from "../map/MapPlaceholderEditor";
import {useDispatch, useSelector} from "react-redux";
import getDefinedArea, {definedAreaSelector} from "../../../data/actions/getDefinedAreaAction";
import {useEffect, useState} from "react";
import OpenBusinessForm from "../forms/OpenBusinessForm";
import getAllBusinesses, {businessesSelector} from "../../../data/actions/getAllBusinessesAction";
import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import BusinessData from "../../../domain/entity/model/BusinessData";
import ChangeBusinessDataModal from "./ChangeBusinessDataModal";
import RedefineAreaModal from "./RedefineAreaModal";
import businessToPay from "../../../data/actions/businessToPayAction";

export default function MapAndBusinessPanel() {
    // This should be handled with custom hooks!!!
    const [businessLocation, setBusinessLocation] = useState<PointDTO | null>(null)
    const [businessToChange, setBusinessClicked] = useState<BusinessData | null>(null)
    const [newPolygonData, setNewPolygonData] = useState<PointDTO[] | null >(null)

    const dispatch = useDispatch()
    const accountAddress = useSelector(loggedAccountAddressSelector);
    const definedArea = useSelector(definedAreaSelector)
    const businesses = useSelector(businessesSelector)

    useEffect(() => {
        dispatch(getDefinedArea({}))
        dispatch(getAllBusinesses({}))
    }, [dispatch])

    useEffect(() => {
        if (businessToChange && businessToChange.owner !== accountAddress) dispatch(businessToPay(businessToChange))
    }, [businessToChange])
    return (
        <Box>
            <Paper style={{
                // width: "93vw"
            }}>
                {
                    (definedArea.length <= 0) ? <Skeleton/> :
                        <MapPlaceholderEditor
                            positionType={"PERSIST"}
                            polygon={definedArea}
                            businesses={businesses.map(business => {return {...business, currentIsOwner: business.owner === accountAddress}})}
                            interactive={true}
                            centerPolygon={true}
                            onPointAdded={(point) => {
                                setBusinessLocation(point)
                            }}
                            onPolygonAdded={(polygon) =>
                                setNewPolygonData(polygon)
                            }
                            onBusinessClicked={business => {
                                setBusinessClicked(business)
                            }}
                        />
                }
            </Paper>

            <OpenBusinessForm businessLocationFromMap={businessLocation}/>
            {businessToChange && businessToChange.owner === accountAddress ? <ChangeBusinessDataModal businessData={businessToChange}/> : <></>}
            {newPolygonData ? <RedefineAreaModal polygon={newPolygonData}/> : <></>}
        </Box>
    )
}
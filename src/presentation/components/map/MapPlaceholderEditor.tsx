import PointDTO from "../../../domain/entity/contractDto/PointDTO";
import BusinessData from "../../../domain/entity/model/BusinessData";
import * as React from "react";

import Map, {
    NavigationControl,
    GeolocateControl,
    AttributionControl,
    MapController,
    Source,
    Layer,
    Popup, Marker,
} from 'react-map-gl'
import {DrawPointMode, DrawPolygonMode, EditingMode, Editor, } from 'react-map-gl-draw'
import EditControlPanel from "../layout/EditControlPanel";
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useRef, useState} from "react";
import {getCentroid, toGeoJson} from "../../../shared/utils/map";
import {Button, Card, CardContent, IconButton, Tooltip, Typography} from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface Props {
    polygon: PointDTO[],
    interactive: boolean,
    centerPolygon?: boolean,
    otherPolygons?: PointDTO[][],
    businesses?: BusinessData[],
    onPointAdded?: (point: PointDTO | null) => void
    onPolygonAdded?: (polygon: PointDTO[] | null) => void
    onBusinessClicked?: (business: BusinessData) => void
    positionType?: "PERSIST" | "INITIALIZE"
}

const SIZE = 32;
const UNIT = "px";

// <Marker style={{transform: `translate(${SIZE/2 + UNIT}, ${SIZE/2 + UNIT}` />

export default function MapPlaceholderEditor(props: Props) {

    const mapRef = useRef<any>()

    const [currentMapMode, changeCurrentMapMode] = useState<DrawPolygonMode | DrawPointMode | EditingMode>()
    const [currentMapModeName, changeCurrentMapModeName] = useState<"POLYGON" | "POINT" | "EDIT">()
    const [currentLocation, changeCurrentLocation] = useState<PointDTO>({lat: 48.72386826003009, lng:21.25608801841736})

    const [disabledPoint, setDisabledPoint] = useState(true)
    const [disabledPolygon, setDisabledPolygon] = useState(true)

    const [availableFeatures, addAvailableFeatures] = useState<any>([])
    const [viewport, changeCurrentViewport] = useState<any>()

    const [businessesInternal, setBusinessesInternal] = useState<BusinessData[]>([])
    const [polygonInternal, setPolygonInternal] = useState<PointDTO[]>([])

    const [centeredAlready, setCenteredAlready] = useState<boolean>(false)

    useEffect(() => {
        if (props.businesses) {
            setBusinessesInternal(props.businesses)
        }
    }, [props.businesses])

    useEffect(() => {
        if (props.polygon.length > 0) {
            setPolygonInternal(props.polygon)
        }
    }, [props.polygon])

    useEffect(() => {
        if (props.positionType && "geolocation" in navigator) {
            if (props.positionType === "INITIALIZE") {
                navigator.geolocation.getCurrentPosition(position => {
                    changeCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude})
                    setCenteredAlready(true)
                })
            } else if (props.positionType === "PERSIST") {
                navigator.geolocation.watchPosition(position => {
                    changeCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude})
                    setCenteredAlready(true)
                }, positionError => {}, {enableHighAccuracy: true, maximumAge: 20000})
            }
        }
    }, [props.positionType])

    useEffect(() => {
        if (!centeredAlready) {
            changeCurrentViewport({
                longitude: (!props.centerPolygon || polygonInternal.length <= 0) ? currentLocation.lng : getCentroid(polygonInternal).lat,
                latitude: (!props.centerPolygon || polygonInternal.length <= 0) ? currentLocation.lat : getCentroid(polygonInternal).lng,
                zoom: 13,
            })
        }
    }, [currentLocation, polygonInternal])

    useEffect(() => {
        setDisabledPolygon((props.onPolygonAdded === undefined || !props.interactive) || availableFeatures.filter((feature: any) => feature["geometry"]["type"] === "Polygon").length > 0 )
        setDisabledPoint((props.onPointAdded === undefined || !props.interactive) || availableFeatures.filter((feature: any) => feature["geometry"]["type"] === "Point").length > 0 )

    }, [availableFeatures])

    function deleteFeature(selectedFeature: any, selectedIndex: any, mapCoords?: any) {
        if (currentMapModeName === "EDIT" && selectedIndex !== null) {
            if (props.onPointAdded && availableFeatures[selectedIndex]["geometry"]["type"] === "Point") props.onPointAdded(null)
            else if (props.onPolygonAdded && availableFeatures[selectedIndex]["geometry"]["type"] === "Polygon") props.onPolygonAdded(null)

            const newArr = availableFeatures.filter((value: any, index: number) => index !== selectedIndex)
            addAvailableFeatures(newArr)
        }
    }

    function updatedMap(newData: any[], editType: string, editContext: []) {
        if (editType === "addFeature") {
            const newFeature = newData[newData.length - 1]
            const featureType = newFeature["geometry"]["type"]

            if (currentMapModeName === "POINT" && props.onPointAdded && featureType === "Point") {
                props.onPointAdded({
                    lat: newFeature["geometry"]["coordinates"][0],
                    lng: newFeature["geometry"]["coordinates"][1]
                })
                changeCurrentMapMode(undefined)
            } else if (currentMapModeName === "POLYGON" && props.onPolygonAdded && featureType === "Polygon") {
                props.onPolygonAdded(newFeature["geometry"]["coordinates"][0].map(
                    (values: [number, number]): PointDTO => { return {lat: values[0], lng: values[1]}}
                ))
                changeCurrentMapMode(undefined)
            }
        }

        addAvailableFeatures(newData)
    }

    return (
        <>
            <Map
                ref={mapRef}
                mapboxApiAccessToken={`pk.eyJ1IjoicmFkb2ZpZ3VyYSIsImEiOiJjbDExaHd2cW8wMXJ2M2tvMjdma2Z3NXZnIn0.W2wPGd94TIT4RG2Pyhfh2w`}
                viewState={viewport}
                width={`100%`}
                height={400}
                visible={true}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                controller={new MapController()}
                onViewportChange={(viewPort: any) => { if (props.interactive) changeCurrentViewport(viewPort)}}
                // onViewStateChange={(newViewState: any) => { if (props.interactive) changeCurrentViewport(newViewState.viewState)}}
            >
                {props.positionType ? <GeolocateControl onGeolocate={(data: any) => (data != null) ? {/*({lat: data.coords.latitude, lng: data.coords.lng})*/} : {} }/> : <></>}

                {
                    !props.otherPolygons ? <></> :
                        props.otherPolygons.map((other, index) =>
                            <Source key={index} id={`otherAreaSourceId${index}`} type="geojson" data={toGeoJson(other, [])}>
                                <Layer id={`areaAreaLayerId${index}`} type="fill" source={`otherAreaSourceId${index}`}
                                       paint={{
                                           'fill-color': '#3050ce',
                                              'fill-opacity': 0.2
                                       }}
                                />
                            </Source>
                        )
                }

                <Source id="areaSourceId" type="geojson" data={toGeoJson(polygonInternal, [])}>
                    <Layer id="areaLayerId" type="fill" source="areaSourceId"
                       paint={{
                           'fill-color': '#ce5f30',
                           'fill-opacity': 0.4
                       }}
                    />
                </Source>

                {/* TODO: For now I decided to show bussinesses as popups data */}
                {/*<Source  id="businessSourceId" type="geojson" data={toGeoJson([], businessesInternal ? businessesInternal : [])}>*/}
                {/*    <Layer*/}
                {/*        id="businessLayerId" type="circle" source="businessSourceId"*/}
                {/*        paint={{*/}
                {/*            "circle-color": '#ff1599'*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Source>*/}
                {/*<Marker offsetTop={-heigth}  offsetLeft={-width/2} ...otherProps />*/}
                {
                    businessesInternal.map(((business, index) => {
                        return <Marker offsetTop={-SIZE} offsetLeft={-SIZE/2}
                                latitude={business.location.lat} longitude={business.location.lng} key={index}>
                            <Tooltip title={business.brand}>
                                <IconButton color={business.currentIsOwner ? "secondary" : "primary"}
                                    onClick={() => props.onBusinessClicked ? props.onBusinessClicked(business) : {}}>
                                        <RoomIcon sx={{ fontSize: SIZE }}/>
                                </IconButton>
                            </Tooltip>
                        </Marker>
                    }))
                }

                {
                    !props.interactive ? <></> :
                        <>
                            <Editor
                                ref={mapRef}
                                mode={currentMapMode}
                                features={availableFeatures}
                                onSelect={(onSelect: any) => {deleteFeature(onSelect.selectedFeature, onSelect.selectedFeatureIndex, onSelect.editHandleIndex)}}
                                onUpdate={(onUpdate: any) => {updatedMap(onUpdate.data, onUpdate.editType, onUpdate.editContext)}}

                            />
                            <EditControlPanel
                                disabledPolygon={disabledPolygon}
                                disabledPoint={disabledPoint}
                                getTool={(tool, toolString) => { changeCurrentMapMode(tool); changeCurrentMapModeName(toolString)}}
                                toolChanged={currentMapMode}/>
                        </>
                }

                {
                    props.positionType !== "PERSIST" ? <></> :
                    <Marker offsetTop={(-SIZE)/2} offsetLeft={(-SIZE/2)/2}
                            latitude={currentLocation.lat} longitude={currentLocation.lng}>
                        <MyLocationIcon color={"primary"} sx={{ fontSize: SIZE / 2 }}/>
                    </Marker>
                }
            </Map>
        </>
    );


}

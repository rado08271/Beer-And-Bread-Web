import PointDTO from "../../domain/entity/contractDto/PointDTO";
import {GeoJSONSourceRaw, MapboxGeoJSONFeature} from "mapbox-gl";
import BusinessData from "../../domain/entity/model/BusinessData";
import centroid from "@turf/centroid";

export function fromGeoJson(json: string): {point: PointDTO, polygon: PointDTO[]} {
    const geoJson: MapboxGeoJSONFeature[] = JSON.parse(json)

    let polygon: PointDTO[] = []
    let point: PointDTO = {lng: 0, lat: 0}

    for (const feature of geoJson) {
        if (feature.geometry.type === "Point") {
            point = {lat: feature.geometry.coordinates[0], lng: feature.geometry.coordinates[1]}
        } else if (feature.geometry.type === "Polygon") {
            for (const point of feature.geometry.coordinates.reduce((prev, next) => prev.concat(next))) {
                polygon.push({lat: point[0], lng: point[1]})
            }
        }
    }

    return {polygon: polygon, point: point}
}

export function getCentroid(area: PointDTO[]): PointDTO {
    const center = centroid(toGeoJson(area, []))
    return {lat: center.geometry.coordinates[0], lng: center.geometry.coordinates[1]}
}

export function toGeoJson(area: PointDTO[], businesses: BusinessData[], floatingPoint?: number): any {
    const geoData: {
        type: "FeatureCollection",
        features: {
            type: "Feature",
            properties: {}
            geometry: {
                type: "Point" | "Polygon",
                coordinates: [number, number] | [[number, number][]]
            }
        }[]
    } = {type: "FeatureCollection",features: []}

    for (const business of businesses) {
        geoData.features.push({type: "Feature", properties: {}, geometry: {type: "Point", coordinates: [business.location.lng/(!floatingPoint ? 1 : floatingPoint), business.location.lat/(!floatingPoint ? 1 : floatingPoint)]}})
    }

    if (area.length > 0) {
        const mapArea: [[number, number][]] = [area.map(value => [value.lat/(!floatingPoint ? 1 : floatingPoint), value.lng/(!floatingPoint ? 1 : floatingPoint)])]
        geoData.features.push({type: "Feature", properties: {}, geometry: {type: "Polygon", coordinates: mapArea}})
    }

    return geoData
}

export function isInside(polygon: PointDTO[], location: PointDTO) {
    const latMaxEast = Math.max.apply(Math, polygon.map((point) => point.lat))
    const latMinWest = Math.min.apply(Math, polygon.map((point) => point.lat))
    const lngMaxNorth = Math.max.apply(Math, polygon.map((point) => point.lng))
    const lngMinSouth = Math.min.apply(Math, polygon.map((point) => point.lng))

    let latMaxEastTMP = 0
    let latMinWestTMP = 360
    let lngMaxNorthTMP = 0
    let lngMinSouthTMP = 180

    for (let i = 0; i < polygon.length; i++) {
        if (latMaxEastTMP < polygon[i].lat) latMaxEastTMP = polygon[i].lat
        if (latMinWestTMP > polygon[i].lat) latMinWestTMP = polygon[i].lat
        if (lngMaxNorthTMP < polygon[i].lng) lngMaxNorthTMP = polygon[i].lng
        if (lngMinSouthTMP > polygon[i].lng) lngMinSouthTMP = polygon[i].lng
    }

    /// check this
    if (!(location.lat >= latMinWest && location.lat <= latMaxEast)) return false
    if (!(location.lng >= lngMinSouth && location.lng <= lngMaxNorth)) return false

    // console.log("Point may be inside of polygon or in some cut outs or angles")
    let countIntersections = 0
    for (let side = 0; side < polygon.length - 1; side++) {
        const pointA = polygon[side]
        const pointB = polygon[side + 1]
        const beacon: PointDTO = {lng: location.lng, lat: latMaxEast}

        if (pointA.lng > location.lng || pointB.lng > location.lng) {
            const ABL = orientation(pointA, pointB, location)
            const ABB = orientation(pointA, pointB, beacon)
            const LBA = orientation(location, beacon, pointA)
            const LBB = orientation(location, beacon, pointB)

            if (ABL !== ABB && LBA !== LBB) {
                countIntersections++
            }
        }
    }

    return countIntersections % 2 === 1
}

//https://www.geeksforgeeks.org/orientation-3-ordered-points/
function orientation(a: PointDTO, b: PointDTO, c: PointDTO) {
    // vector multiplication for orientation - cross product
    const oriented = ((b.lat - a.lat) * (c.lng - b.lng)) - ((b.lng - a.lng) * (c.lat - b.lat))

    if (oriented === 0) return 0
    return oriented < 0 ? -1 : 1
}

export function isInsideV1(polygon: PointDTO[], location: PointDTO) {
    const lngMaxEast = Math.max.apply(Math, polygon.map((point) => point.lng))
    const lngMinWest = Math.min.apply(Math, polygon.map((point) => point.lng))
    const latMaxNorth = Math.max.apply(Math, polygon.map((point) => point.lat))
    const latMinSouth = Math.min.apply(Math, polygon.map((point) => point.lat))

    // console.log("lngMaxEast", lngMaxEast)
    // console.log("lngMinWest", lngMinWest)
    // console.log("latMaxNorth", latMaxNorth)
    // console.log("latMinSouth", latMinSouth)

    const sidePointsOnLine: PointDTO[][] = []
    for (let side = 0; side < polygon.length - 1; side++) {
        const pointA = polygon[side]
        const pointB = polygon[side + 1]

        const vectorLng = (pointB.lng - pointA.lng)
        const vectorLat = (pointB.lat - pointA.lat)

        const pointsOnLine: PointDTO[] = []
        if (pointA.lat > pointB.lat) {
            for (let latAxisValue = pointB.lat; latAxisValue <= pointA.lat ; latAxisValue++) {
                const lngAxisValue = (latAxisValue - pointB.lat) / vectorLat * vectorLng + pointB.lng
                pointsOnLine.push({lat: latAxisValue, lng: lngAxisValue})
            }
        } else {
            for (let latAxisValue = pointA.lat; latAxisValue < pointB.lat; latAxisValue++) {
                const lngAxisValue = (latAxisValue - pointA.lat) / vectorLat * vectorLng + pointA.lng
                pointsOnLine.push({lat: latAxisValue, lng: lngAxisValue})
            }
        }

        sidePointsOnLine.push(pointsOnLine)
    }

    const joined = sidePointsOnLine.reduce((prev, next) => prev.concat(next))
    console.log(joined)
    return joined
}

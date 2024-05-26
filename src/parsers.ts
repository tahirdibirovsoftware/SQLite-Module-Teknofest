import { ITelemetry, SatStatus, IIoTTelemetry } from "./types";

export const flightDataParser = (data: string, delimiter: string): ITelemetry | string => {
    try {
        const splittedTelemetry = data.split(delimiter);
        if (splittedTelemetry.length < 21) {
            throw new Error('Insufficient data fields');
        }

        const jsonFlightTelemetry: ITelemetry = {
            packetNumber: parseFloat(splittedTelemetry[0]),
            satelliteStatus: parseFloat(splittedTelemetry[1]) as SatStatus,
            errorCode: splittedTelemetry[2],
            missionTime: splittedTelemetry[3],
            pressure1: parseFloat(splittedTelemetry[4]),
            pressure2: parseFloat(splittedTelemetry[5]),
            altitude1: parseFloat(splittedTelemetry[6]),
            altitude2: parseFloat(splittedTelemetry[7]),
            altitudeDifference: parseFloat(splittedTelemetry[8]),
            descentRate: parseFloat(splittedTelemetry[9]),
            temp: parseFloat(splittedTelemetry[10]),
            voltageLevel: parseFloat(splittedTelemetry[11]),
            gps1Latitude: parseFloat(splittedTelemetry[12]),
            gps1Longitude: parseFloat(splittedTelemetry[13]),
            gps1Altitude: parseFloat(splittedTelemetry[14]),
            pitch: parseFloat(splittedTelemetry[15]),
            roll: parseFloat(splittedTelemetry[16]),
            yaw: parseFloat(splittedTelemetry[17]),
            lnln: splittedTelemetry[18],
            iotData: parseFloat(splittedTelemetry[19]),
            teamId: parseFloat(splittedTelemetry[20])
        };

        return jsonFlightTelemetry;
    } catch (error) {
        return `Error: ${(error as Error).message}`;
    }
};

export const iotDataParser = (data: string, delimiter: string): IIoTTelemetry => {
    try {
        const splittedIotData = data.split(delimiter);
        if (splittedIotData.length < 2) {
            throw new Error('Insufficient data fields');
        }
        const jsonIotTelemetry: IIoTTelemetry = {
            temperature: Number(splittedIotData[0]),
            humidity: Number(splittedIotData[1])
        };
        return jsonIotTelemetry;
    } catch (error) {
        throw new Error(`Error: ${(error as Error).message}`);
    }
};

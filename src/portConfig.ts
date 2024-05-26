import { ReadlineParser, SerialPort } from 'serialport';
import { Database } from 'sqlite';
import { flightDataParser } from './parsers';
import { ITelemetry } from './types';

export const getDevicePath = async (deviceName: string): Promise<string | undefined> => {
    const devices = await SerialPort.list();
    const device = devices.find(device => device?.manufacturer?.toLowerCase()?.includes(deviceName.toLowerCase()));
    return device ? device.path : undefined;
};

export const startWriting = async (path: string, baudRate: number, db: Database) => {
    const port = new SerialPort({ path, baudRate });

    const parser = port.pipe(new ReadlineParser());
    parser.on('data', async (data: string) => {
        const jsonData = flightDataParser(data, '*');
        if (typeof jsonData === 'string') {
            console.error(`Error parsing data: ${jsonData}`);
            return;
        }

        await db.run(
            `INSERT INTO FLIGHT_DATA (
                packetNumber, satelliteStatus, errorCode, missionTime, pressure1, pressure2,
                altitude1, altitude2, altitudeDifference, descentRate, temp, voltageLevel,
                gps1Latitude, gps1Longitude, gps1Altitude, pitch, roll, yaw, lnln, iotData, teamId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                jsonData.packetNumber,
                jsonData.satelliteStatus,
                jsonData.errorCode,
                jsonData.missionTime,
                jsonData.pressure1,
                jsonData.pressure2,
                jsonData.altitude1,
                jsonData.altitude2,
                jsonData.altitudeDifference,
                jsonData.descentRate,
                jsonData.temp,
                jsonData.voltageLevel,
                jsonData.gps1Latitude,
                jsonData.gps1Longitude,
                jsonData.gps1Altitude,
                jsonData.pitch,
                jsonData.roll,
                jsonData.yaw,
                jsonData.lnln,
                jsonData.iotData,
                jsonData.teamId
            ]
        );
    });
};

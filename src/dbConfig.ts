import { homedir } from 'os';
import { resolve, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { open } from 'sqlite';
import { Database } from 'sqlite3';

const dbPath = resolve(homedir(), 'x-soft', 'telemetry.sqlite');

export const initializeDb = async () => {
    // Ensure the directory exists
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    const dbExists = existsSync(dbPath);
    const db = await open({
        filename: dbPath,
        driver: Database
    });

    if (!dbExists) {
        await db.exec(`
            CREATE TABLE FLIGHT_DATA (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                packetNumber INT,
                satelliteStatus INT,
                errorCode TEXT,
                missionTime TEXT,
                pressure1 REAL,
                pressure2 REAL,
                altitude1 REAL,
                altitude2 REAL,
                altitudeDifference REAL,
                descentRate REAL,
                temp REAL,
                voltageLevel REAL,
                gps1Latitude REAL,
                gps1Longitude REAL,
                gps1Altitude REAL,
                pitch REAL,
                roll REAL,
                yaw REAL,
                lnln TEXT,
                iotData REAL,
                teamId INT
            )
        `);
        console.log(`Database has been initialized`);
    } else {
        console.log(`Database already exists`);
    }

    return db;
};

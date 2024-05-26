import { initializeDb } from './dbConfig';
import { getDevicePath, startWriting } from './portConfig';

const main = async () => {
    try {
        // Initialize the database
        const db = await initializeDb();

        // Get the device path for the specific device
        const deviceName = "Arduino";  // Replace with the actual device manufacturer name
        const devicePath = await getDevicePath(deviceName);

        if (!devicePath) {
            console.error(`Device ${deviceName} not found`);
            return;
        }

        // Start writing data from the serial port to the database
        const baudRate = 57600;  // Set your baud rate
        await startWriting(devicePath, baudRate, db);

        console.log(`Started reading from device ${deviceName} at path ${devicePath}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
    }
};

main();

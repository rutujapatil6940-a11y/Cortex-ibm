const mongoose = require("mongoose");

let cortexConnection = null;
let connectionPromise = null;

async function connectCortexDB() {
    if (cortexConnection && cortexConnection.readyState === 1) {
        return cortexConnection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    const uri = process.env.CORTEX_MONGODB_URI;

    if (!uri) {
        throw new Error("CODEALPHA_MONGODB_URI is not configured");
    }

    connectionPromise = mongoose
        .createConnection(uri, {
            dbName: "cortex"
        })
        .asPromise();

    try {
        cortexConnection = await connectionPromise;

        console.log("CodeAlpha MongoDB connected");

        return cortexConnection;
    } catch (error) {
        connectionPromise = null;
        cortexConnection = null;

        console.error(
            "CodeAlpha MongoDB connection failed:",
            error.message
        );

        throw error;
    }
}

function getCortexDB() {
    if (!cortexConnection || cortexConnection.readyState !== 1) {
        throw new Error("CodeAlpha MongoDB is not connected");
    }

    return cortexConnection;
}

module.exports = {
    connectCortexDB,
    getCortexDB
};
const mongoose = require("mongoose");

let connectionPromise = null;

async function connectCortexDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    const uri = process.env.CORTEX_MONGODB_URI;

    if (!uri) {
        throw new Error("CORTEX_MONGODB_URI is not configured");
    }

    connectionPromise = mongoose.connect(uri, {
        dbName: "cortex"
    });

    try {
        await connectionPromise;
        console.log("Cortex MongoDB connected");
        return mongoose.connection;
    } catch (error) {
        connectionPromise = null;
        console.error("Cortex MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = {
    connectCortexDB
};
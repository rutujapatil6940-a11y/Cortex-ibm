const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('dns');
// Set Google DNS at code level
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const uri = "mongodb+srv://bariyasakshi9_db_user:Sakshi0385@cluster1.loahk6a.mongodb.net/?appName=Cluster1";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function connectDB() {
  try {
    await client.connect();

    console.log("MongoDB connected successfully!");

    const db = client.db("ibm_project");
    const collection = db.collection("users");

    // Data insert
    const result = await collection.insertOne({
      name: "Shreya",
      email: "shreya@gmail.com",
      project: "IBM Project1"
    });

    console.log("Data inserted:", result.insertedId);

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();
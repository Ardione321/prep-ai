import mongoose from "mongoose";

// Determine the MongoDB connection URI based on the environment (development or production)
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_LOCAL! // Use local database URI in development
    : process.env.MONGODB_URI!; // Use production database URI in other cases

// Throw an error if no MongoDB URI is provided
if (!MONGODB_URI) {
  throw new Error("No MONGODB_URI provided");
}

// Define an interface for caching the mongoose connection
interface MongooseCache {
  connection: typeof mongoose | null; // Holds the mongoose connection instance
  promise: Promise<typeof mongoose> | null; // Holds the promise of the connection
}

// Declare a global variable for caching the mongoose connection to prevent multiple connections in development
declare global {
  var mongoose: MongooseCache;
}

// Check if a cached connection exists; if not, initialize the cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    connection: null,
    promise: null,
  };
}

// Function to establish a connection to MongoDB
async function dbConnect() {
  // If a connection already exists, return it
  if (cached.connection) {
    return cached.connection;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection to be established and store it in the cache
  cached.connection = await cached.promise;

  // Return the cached connection
  return cached.connection;
}

export default dbConnect;

#!/bin/sh
# wait-for-mongo.sh

# wait until Mongo is ready
echo "Waiting for MongoDB to start..."
until nc -z mongo 27017; do
  sleep 1
done
echo "MongoDB is up, running seed script..."
npm run seed
echo "Starting backend server..."
npm start

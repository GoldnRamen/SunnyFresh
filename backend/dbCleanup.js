const mongoose = require('mongoose');

async function cleanupDatabase() {
  await mongoose.connect('mongodb://localhost:27017/laundry_cleaning');

  const result = await mongoose.connection.collection('users').updateMany(
    { username: null },
    { $set: { username: "placeholder_username" } }
  );

  console.log(`${result.modifiedCount} documents updated`);
  mongoose.disconnect();
}

cleanupDatabase();

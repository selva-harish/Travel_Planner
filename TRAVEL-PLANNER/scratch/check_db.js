const { connectDB } = require('../backend/config/db');
const Hotel = require('../backend/models/Hotel');

async function checkData() {
    await connectDB();
    const count = await Hotel.count();
    console.log(`Total hotels in database: ${count}`);
    process.exit(0);
}

checkData();

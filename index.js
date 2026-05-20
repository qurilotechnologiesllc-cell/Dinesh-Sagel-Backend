require('dotenv').config();
const {app, server} = require('./src/app')
const connectDB = require('./src/config/db');
const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
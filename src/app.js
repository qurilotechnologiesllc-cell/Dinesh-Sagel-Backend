const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const path = require('path');
const { Server } = require('socket.io');
const { socketHandler } = require('./utils/sockethandler');

// these are the routes imported from the routers folder
const adminAuthRoutes = require('./routers/adminAuthRoutes');
const contactUsRoutes = require('./routers/contactUsRoutes');
const blogRoutes = require('./routers/blogRoutes');
const gymPlanRoutes = require('./routers/gymplanRoutes');
const userEnquiryRoutes = require('./routers/userEnquiryRoutes');
const bannerRoutes = require('./routers/bannerRoutes');
const VideoPlanRoutes = require('./routers/videoPlanRoutes');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.set('io', io) // Make io accessible in routes/controllers via req.app.get('io')

socketHandler(io);

app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, "public")))

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/plans', gymPlanRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', userEnquiryRoutes);
app.use('/api', contactUsRoutes);
app.use('/api', bannerRoutes);
app.use('/api', VideoPlanRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Gym API');
});

module.exports = { app, server };
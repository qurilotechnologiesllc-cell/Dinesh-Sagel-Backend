const express = require('express');
const cors = require('cors');
const app = express();
const adminAuthRoutes = require('./routers/adminAuthRoutes');
const contactUsRoutes = require('./routers/contactUsRoutes');
const blogRoutes = require('./routers/blogRoutes');
const gymPlanRoutes = require('./routers/gymplanRoutes');
const userEnquiryRoutes = require('./routers/userEnquiryRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/plans', gymPlanRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', userEnquiryRoutes);
app.use('/api', contactUsRoutes);



app.get('/', (req, res) => {
    res.send('Dear Binod Tum Chutiya ho backend Chal gya hai apna kaam aage ka kaam kro !');
});

module.exports = { app }
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const productRoutes = require('./routes/productRoute')
const userRoutes = require('./routes/userRoute')
const clientRoutes = require('./routes/clientRoute')
const checkoutRoutes = require('./routes/checkoutRoute')
const errorMiddleware = require('./middleware/errorMiddleware')
const authenticateToken = require('./middleware/authMiddleware')
const cors = require('cors')
const MONOGO_URL = process.env.MONOGO_URL
app.use(express.json())
app.use(cors())
//router
//user routes
app.use('/api', clientRoutes)
app.use('/api/admin', userRoutes)

//admin routes
app.use('/api', authenticateToken ,checkoutRoutes)
app.use('/api/admin/product', authenticateToken, productRoutes);

app.get('/', (req, res) => {
    res.send('Welcome node api')
})

app.use(errorMiddleware);

mongoose.set("strictQuery",false)
mongoose.
connect(MONOGO_URL)
.then(()=>{
    console.log('connection to MongoDB')
    app.listen(3000, () => {
        console.log("listening on 3000");
      });
}).catch((error)=>{
    console.log(error);
})
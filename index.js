const express = require('express');
const cors = require('cors')
const app = express()
const path = require('path')
const dbConnect = require('./config/dbConnect')
const env = require('dotenv').config()
const userRouter = require("./routes/userRoutes")
const tutorRouter = require("./routes/tutorRoutes")
const adminRouter = require("./routes/adminRoutes")
app.use(express.json())

dbConnect()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}))

app.use("/", userRouter)
app.use("/tutor", tutorRouter)
app.use("/admin", adminRouter)
app.use((err, req, res, next) => {
    console.error(err.stack)
})
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
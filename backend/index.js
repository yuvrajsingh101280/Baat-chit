import express from "express"
import dotenv from "dotenv"
import connectToDB from "./database/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import chatRoutes from "./routes/chatRoutes.js"
import cors from "cors"
// env config
dotenv.config()

// app instance
const app = express()
// port 
const port = process.env.PORT
// databse connectino
connectToDB()
// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
// routes
app.get("/", (req, res) => {

    res.send("Jia ho bihar ke lala")

})
app.use("/api/auth", authRoutes)
app.use("/api/auth", userRoutes)
app.use("api/chat", chatRoutes)
// server listening
app.listen(port, () => {

    console.log(`server is running at http://localhost:${port}`)


})

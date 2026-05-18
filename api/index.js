const express = require("express")
const path = require("path")
const router = require("../Router")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }

    next()
})

app.use("/api", router)

app.use(express.static(path.join(__dirname, "..")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"))
})

module.exports = app
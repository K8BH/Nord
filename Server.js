const express = require("express")
const path = require("path")
const router = require("./Router")

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, "frontend")))

app.use("/api", router)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"))
})

module.exports = app

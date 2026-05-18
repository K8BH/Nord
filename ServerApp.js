const express = require("express")
const path = require("path")
const router = require("./Router")

const app = express()

app.use(express.json())

// frontend serve
app.use(express.static(path.join(__dirname, "frontend")))

app.use("/api", router)

module.exports = app
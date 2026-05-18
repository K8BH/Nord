const app = require("./ServerApp")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Nord running on http://localhost:" + PORT)
})
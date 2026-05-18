const express = require("express")
const router = express.Router()

const lexer = require("./Lexer")
const parser = require("./Parser")
const buildIR = require("./IRBuilder")
const { translate } = require("./Translator")
const { execute } = require("./Executor")

router.post("/run", (req, res) => {
    const { code, target = "javascript" } = req.body

    try {
        const tokens = lexer(code)
        const ast = parser(tokens)
        const ir = buildIR(ast)
        const js = translate(ir, target)
        const result = execute(js, target)

        res.json({
            success: true,
            result
        })
    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
})

module.exports = router
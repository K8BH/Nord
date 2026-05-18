const vm = require("vm")
const fs = require("fs")
const path = require("path")
const os = require("os")
const { execSync } = require("child_process")

const DEFAULT_TIMEOUT_MS = 5000

function getPythonCommand() {
    try {
        execSync("python --version", { stdio: "ignore" })
        return "python"
    } catch (e1) {
        try {
            execSync("py --version", { stdio: "ignore" })
            return "py"
        } catch (e2) {
            return null
        }
    }
}

function executeJS(code, timeout = DEFAULT_TIMEOUT_MS) {
    const output = []
    const errors = []

    const sandbox = {
        console: {
            log: (...args) => output.push(args.join(" ")),
            error: (...args) => errors.push(args.join(" "))
        },
        _input: () => "",
        Math,
        String,
        Number,
        Boolean,
        Array,
        Object,
        JSON
    }

    try {
        const script = new vm.Script(code)
        const context = vm.createContext(sandbox)
        script.runInContext(context, { timeout })

        return { success: true, output: output.join("\n"), errors: errors.join("\n"), runtime: "node-vm" }
    } catch (err) {
        return { success: false, output: output.join("\n"), errors: err.message, runtime: "node-vm" }
    }
}

function executePython(code, timeout = DEFAULT_TIMEOUT_MS) {
    const pythonCmd = getPythonCommand()

    if (!pythonCmd) {
        return { success: false, output: "", errors: "Python not found", runtime: "python" }
    }

    const tmpFile = path.join(os.tmpdir(), `nord_${Date.now()}.py`)

    try {
        fs.writeFileSync(tmpFile, code)

        const result = execSync(`${pythonCmd} "${tmpFile}"`, {
            timeout,
            encoding: "utf-8"
        })

        return { success: true, output: result.trim(), errors: "", runtime: pythonCmd }

    } catch (err) {
        return { success: false, output: "", errors: err.stderr ? err.stderr.toString() : err.message, runtime: "python" }
    } finally {
        try { fs.unlinkSync(tmpFile) } catch {}
    }
}

function execute(code, target = "javascript") {
    target = target.toLowerCase()

    if (target === "javascript" || target === "js") return executeJS(code)
    if (target === "python" || target === "py") return executePython(code)

    throw new Error("Unknown target")
}

module.exports = { execute, executeJS, executePython }
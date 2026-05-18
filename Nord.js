const fs = require('fs')
const lexer = require('./Lexer')
const parser = require('./Parser')
const buildIR = require('./IRBuilder')
const { translate } = require('./Translator')
const { execute } = require('./Executor')
const runtime = require('./Runtime')

const rawArgs = process.argv.slice(2)
const flags = {}
const positional = []

for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith('--')) {
        const [key, val] = rawArgs[i].slice(2).split('=')
        flags[key] = val !== undefined ? val : true
    } else {
        positional.push(rawArgs[i])
    }
}

const file = positional[0] || 'Examples.nord'
const target = flags.target || flags.t || 'javascript'
const showIR = !!(flags.ir || flags.debug)
const showTokens = !!flags.tokens
const translateOnly = !!(flags['translate-only'] || flags.translate)
const useRuntime = !!flags.runtime
const serveMode = !!(flags.serve || flags.server)

if (serveMode) {
    require('./Server')
    return
}

if (flags.help || flags.h) {
    console.log(`
  Nord Language Platform v2.0
  
  Usage: node Nord.js [file] [options]

  Options:
    --target=<js|python>    Translation target (default: javascript)
    --ir                    Show the Intermediate Representation
    --tokens                Show the token stream
    --translate-only        Translate but do not execute
    --runtime               Execute directly via tree-walk (skip translate)
    --serve                 Start the API server
    --help                  Show this message

  Examples:
    node Nord.js Examples.nord
    node Nord.js program.nord --target=python
    node Nord.js program.nord --ir --tokens
    node Nord.js --serve
`)
    process.exit(0)
}

if (!fs.existsSync(file)) {
    console.error(`\n  Error: File not found — "${file}"`)
    console.error('  Run with --help for usage.\n')
    process.exit(1)
}

const code = fs.readFileSync(file, 'utf8')

console.log(`\n${'─'.repeat(50)}`)
console.log(`  Nord Language Platform`)
console.log(`  File:   ${file}`)
console.log(`  Target: ${target}`)
console.log(`${'─'.repeat(50)}\n`)

try {

    const tokens = lexer(code)

    if (showTokens) {
        console.log('── Tokens ──────────────────────────────────────────')
        tokens
            .filter(t => t.type !== 'EOF')
            .forEach(t => console.log(`  [${t.type.padEnd(14)}] ${t.value}`))
        console.log()
    }

    const ast = parser(tokens)

    if (useRuntime) {
        console.log('── Output (direct runtime) ─────────────────────────')
        runtime()(ast)
        console.log()
        return
    }

    const ir = buildIR(ast)

    if (showIR) {
        console.log('── IR ──────────────────────────────────────────────')
        console.log(JSON.stringify(ir, null, 2))
        console.log()
    }

    const generatedCode = translate(ir, target)

    console.log(`── Generated ${target} ${'─'.repeat(Math.max(0, 38 - target.length))}`)
    console.log(generatedCode)
    console.log()

    if (translateOnly) return

    const result = execute(generatedCode, target)

    console.log('── Output ──────────────────────────────────────────')
    if (result.output) console.log(result.output)
    if (result.errors) console.error('Errors:', result.errors)
    if (!result.success) process.exit(1)
    console.log()

} catch (err) {
    console.error(`\n  Error: ${err.message}\n`)
    process.exit(1)
}
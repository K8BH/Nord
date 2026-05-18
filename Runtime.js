function createRuntime() {
    const globals = {}
    const functions = {}

    function evalExpr(node, scope) {
        if (!node) return undefined

        switch (node.type) {

            case 'Literal':
                return node.value

            case 'Identifier': {
                const name = node.name
                if (scope && name in scope) return scope[name]
                if (name in globals) return globals[name]
                return undefined
            }

            case 'BinaryExpression': {
                const L = evalExpr(node.left, scope)
                const R = evalExpr(node.right, scope)
                switch (node.operator) {
                    case '+': return L + R
                    case '-': return L - R
                    case '*': return L * R
                    case '/': return R !== 0 ? L / R : (console.error('Division by zero'), 0)
                    case '%': return L % R
                    case '==': return L == R
                    case '!=': return L != R
                    case '>': return L > R
                    case '<': return L < R
                    case '>=': return L >= R
                    case '<=': return L <= R
                    case '&&': return L && R
                    case '||': return L || R
                    default: return null
                }
            }

            case 'UnaryExpression': {
                const val = evalExpr(node.value, scope)
                if (node.operator === '!') return !val
                if (node.operator === '-') return -val
                return val
            }

            case 'CallExpression': {
                const fn = functions[node.callee]

                if (!fn) {
                    if (node.callee === 'String') return String(evalExpr(node.arguments[0], scope))
                    if (node.callee === 'Number') return Number(evalExpr(node.arguments[0], scope))
                    console.error(`Undefined function: ${node.callee}`)
                    return undefined
                }

                const localScope = {}

                fn.params.forEach((p, idx) => {
                    localScope[p] = evalExpr((node.arguments || [])[idx], scope)
                })

                let returnVal

                try {
                    for (const stmt of fn.body) {
                        evaluate(stmt, localScope)
                    }
                } catch (signal) {
                    if (signal && '__returnValue' in signal) {
                        returnVal = signal.__returnValue
                    } else {
                        throw signal
                    }
                }

                return returnVal
            }

            case 'InputExpression':
                return ''

            default:
                return undefined
        }
    }

    function evaluate(node, scope) {
        if (!node) return

        switch (node.type) {

            case 'PrintStatement':
                console.log(evalExpr(node.value, scope))
                break

            case 'VariableDeclaration':
                if (scope) scope[node.name] = evalExpr(node.value, scope)
                else globals[node.name] = evalExpr(node.value, scope)
                break

            case 'Assignment': {
                const val = evalExpr(node.value, scope)
                if (scope && node.name in scope) scope[node.name] = val
                else globals[node.name] = val
                break
            }

            case 'FunctionDeclaration':
                functions[node.name] = { params: node.params, body: node.body }
                break

            case 'ReturnStatement':
                throw { __returnValue: evalExpr(node.value, scope) }

            case 'IfStatement': {
                const cond = evalExpr(node.condition, scope)
                if (cond) {
                    for (const s of node.consequent) evaluate(s, scope)
                } else if (node.alternate) {
                    for (const s of node.alternate) evaluate(s, scope)
                }
                break
            }

            case 'WhileStatement': {
                let guard = 0
                while (evalExpr(node.condition, scope)) {
                    if (++guard > 50000) throw new Error('Infinite loop guard triggered')
                    for (const s of node.body) evaluate(s, scope)
                }
                break
            }

            case 'RepeatStatement': {
                const count = evalExpr(node.count, scope)
                for (let i = 0; i < count; i++) {
                    for (const s of node.body) evaluate(s, scope)
                }
                break
            }

            case 'ExpressionStatement':
                evalExpr(node.expression, scope)
                break

            default:
                break
        }
    }

    return function runtime(ast) {
        for (const node of ast) {
            evaluate(node, null)
        }
    }
}

module.exports = createRuntime
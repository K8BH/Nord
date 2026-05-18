function buildIR(ast) {
    return {
        version: '2.0',
        language: 'nord',
        nodes: ast.map(processStmt).filter(Boolean)
    }
}

function processStmt(node) {
    if (!node) return null

    switch (node.type) {

        case 'PrintStatement':
            return { kind: 'print', value: processExpr(node.value) }

        case 'VariableDeclaration':
            return { kind: 'var_decl', name: node.name, value: processExpr(node.value) }

        case 'Assignment':
            return { kind: 'var_assign', name: node.name, value: processExpr(node.value) }

        case 'FunctionDeclaration':
            return {
                kind: 'func_decl',
                name: node.name,
                params: node.params,
                body: node.body.map(processStmt).filter(Boolean)
            }

        case 'ReturnStatement':
            return { kind: 'return', value: processExpr(node.value) }

        case 'IfStatement':
            return {
                kind: 'if',
                condition: processExpr(node.condition),
                consequent: node.consequent.map(processStmt).filter(Boolean),
                alternate: node.alternate
                    ? node.alternate.map(processStmt).filter(Boolean)
                    : null
            }

        case 'WhileStatement':
            return {
                kind: 'while',
                condition: processExpr(node.condition),
                body: node.body.map(processStmt).filter(Boolean)
            }

        case 'RepeatStatement':
            return {
                kind: 'repeat',
                count: processExpr(node.count),
                body: node.body.map(processStmt).filter(Boolean)
            }

        case 'ExpressionStatement':
            return { kind: 'expr', expression: processExpr(node.expression) }

        default:
            return null
    }
}

function processExpr(node) {
    if (!node) return null

    switch (node.type) {

        case 'Literal':
            return { kind: 'literal', dataType: node.dataType, value: node.value }

        case 'Identifier':
            return { kind: 'identifier', name: node.name }

        case 'BinaryExpression':
            return {
                kind: 'binary',
                operator: node.operator,
                left: processExpr(node.left),
                right: processExpr(node.right)
            }

        case 'UnaryExpression':
            return {
                kind: 'unary',
                operator: node.operator,
                value: processExpr(node.value)
            }

        case 'CallExpression':
            return {
                kind: 'call',
                callee: node.callee,
                args: (node.arguments || []).map(processExpr)
            }

        case 'InputExpression':
            return { kind: 'input', prompt: node.prompt || '' }

        default:
            return null
    }
}

module.exports = buildIR
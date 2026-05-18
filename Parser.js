function parser(tokens) {
    let current = 0

    function peek() { return tokens[current] }
    function advance() { return tokens[current++] }
    function isEOF() { return !peek() || peek().type === 'EOF' }

    function check(type) {
        return peek() && peek().type === type
    }

    function expect(type) {
        const t = peek()
        if (!t || t.type !== type) {
            const got = t ? `${t.type}(${t.value})` : 'EOF'
            throw new Error(`Expected ${type} but got ${got} at line ${t ? t.line : '?'}`)
        }
        return advance()
    }

    function parseExpression() { return parseOr() }

    function parseOr() {
        let left = parseAnd()
        while (check('OR')) {
            advance()
            const right = parseAnd()
            left = { type: 'BinaryExpression', operator: '||', left, right }
        }
        return left
    }

    function parseAnd() {
        let left = parseEquality()
        while (check('AND')) {
            advance()
            const right = parseEquality()
            left = { type: 'BinaryExpression', operator: '&&', left, right }
        }
        return left
    }

    function parseEquality() {
        let left = parseComparison()
        while (check('DOUBLE_EQUALS') || check('NOT_EQUALS')) {
            const op = advance()
            const right = parseComparison()
            left = { type: 'BinaryExpression', operator: op.value, left, right }
        }
        return left
    }

    function parseComparison() {
        let left = parseAddition()
        while (
            check('GREATER') ||
            check('LESS') ||
            check('GREATER_EQ') ||
            check('LESS_EQ')
        ) {
            const op = advance()
            const right = parseAddition()
            left = { type: 'BinaryExpression', operator: op.value, left, right }
        }
        return left
    }

    function parseAddition() {
        let left = parseMultiplication()
        while (check('PLUS') || check('MINUS')) {
            const op = advance()
            const right = parseMultiplication()
            left = { type: 'BinaryExpression', operator: op.value, left, right }
        }
        return left
    }

    function parseMultiplication() {
        let left = parseUnary()
        while (check('STAR') || check('SLASH') || check('PERCENT')) {
            const op = advance()
            const right = parseUnary()
            left = { type: 'BinaryExpression', operator: op.value, left, right }
        }
        return left
    }

    function parseUnary() {
        if (check('NOT') || check('MINUS')) {
            const op = advance()
            const value = parseUnary()
            return {
                type: 'UnaryExpression',
                operator: op.type === 'NOT' ? '!' : '-',
                value
            }
        }
        return parsePrimary()
    }

    function parsePrimary() {
        const t = peek()
        if (!t || isEOF()) return null

        if (t.type === 'NUMBER') {
            advance()
            return { type: 'Literal', dataType: 'number', value: t.value }
        }

        if (t.type === 'STRING') {
            advance()
            return { type: 'Literal', dataType: 'string', value: t.value }
        }

        if (t.type === 'TRUE') {
            advance()
            return { type: 'Literal', dataType: 'boolean', value: true }
        }

        if (t.type === 'FALSE') {
            advance()
            return { type: 'Literal', dataType: 'boolean', value: false }
        }

        if (t.type === 'INPUT') {
            advance()
            let prompt = null
            if (check('STRING')) prompt = advance().value
            return { type: 'InputExpression', prompt }
        }

        if (t.type === 'IDENTIFIER') {
            advance()
            if (check('OPEN_PAREN')) {
                advance()
                const args = []
                while (!check('CLOSE_PAREN') && !isEOF()) {
                    args.push(parseExpression())
                    if (check('COMMA')) advance()
                }
                expect('CLOSE_PAREN')
                return { type: 'CallExpression', callee: t.value, arguments: args }
            }
            return { type: 'Identifier', name: t.value }
        }

        if (t.type === 'OPEN_PAREN') {
            advance()
            const expr = parseExpression()
            expect('CLOSE_PAREN')
            return expr
        }

        advance()
        return null
    }

    function parseBlock() {
        expect('OPEN_BRACE')
        const body = []
        while (!check('CLOSE_BRACE') && !isEOF()) {
            const stmt = parseStatement()
            if (stmt) body.push(stmt)
        }
        expect('CLOSE_BRACE')
        return body
    }

    function parseStatement() {
        const t = peek()
        if (!t || isEOF()) return null

        if (t.type === 'PRINT') {
            advance()
            const value = parseExpression()
            return { type: 'PrintStatement', value }
        }

        if (t.type === 'LET') {
            advance()
            const name = expect('IDENTIFIER')
            expect('EQUALS')
            const value = parseExpression()
            return { type: 'VariableDeclaration', name: name.value, value }
        }

        if (t.type === 'FUNCTION') {
            advance()
            const name = expect('IDENTIFIER')
            expect('OPEN_PAREN')
            const params = []
            while (!check('CLOSE_PAREN') && !isEOF()) {
                params.push(expect('IDENTIFIER').value)
                if (check('COMMA')) advance()
            }
            expect('CLOSE_PAREN')
            const body = parseBlock()
            return { type: 'FunctionDeclaration', name: name.value, params, body }
        }

        if (t.type === 'RETURN') {
            advance()
            const value = parseExpression()
            return { type: 'ReturnStatement', value }
        }

        if (t.type === 'IF') {
            advance()
            const condition = parseExpression()
            const consequent = parseBlock()
            let alternate = null
            if (check('ELSE')) {
                advance()
                alternate = parseBlock()
            }
            return { type: 'IfStatement', condition, consequent, alternate }
        }

        if (t.type === 'WHILE') {
            advance()
            const condition = parseExpression()
            const body = parseBlock()
            return { type: 'WhileStatement', condition, body }
        }

        if (t.type === 'REPEAT') {
            advance()
            const count = parseExpression()
            const body = parseBlock()
            return { type: 'RepeatStatement', count, body }
        }

        if (
            t.type === 'IDENTIFIER' &&
            tokens[current + 1] &&
            tokens[current + 1].type === 'EQUALS' &&
            tokens[current + 2] &&
            tokens[current + 2].type !== 'EQUALS'
        ) {
            const name = advance()
            advance()
            const value = parseExpression()
            return { type: 'Assignment', name: name.value, value }
        }

        if (t.type === 'IDENTIFIER') {
            const expr = parseExpression()
            return expr ? { type: 'ExpressionStatement', expression: expr } : null
        }

        advance()
        return null
    }

    const ast = []

    while (!isEOF()) {
        const stmt = parseStatement()
        if (stmt) ast.push(stmt)
    }

    return ast
}

module.exports = parser
const TOKENS = require("./Tokens")
const langMap = require("./LanguageMap")

function makeToken(type, value, line, col) {
    return { type, value, line, col }
}

const OPERATORS = {
    '>=': TOKENS.GREATER_EQ,
    '<=': TOKENS.LESS_EQ,
    '!=': TOKENS.NOT_EQUALS,
    '==': TOKENS.DOUBLE_EQUALS,
    '>': TOKENS.GREATER,
    '<': TOKENS.LESS,
    '=': TOKENS.EQUALS,
    '+': TOKENS.PLUS,
    '-': TOKENS.MINUS,
    '*': TOKENS.STAR,
    '/': TOKENS.SLASH,
    '%': TOKENS.PERCENT,
    '(': TOKENS.OPEN_PAREN,
    ')': TOKENS.CLOSE_PAREN,
    '{': TOKENS.OPEN_BRACE,
    '}': TOKENS.CLOSE_BRACE,
    ',': TOKENS.COMMA,
}

function stripComments(code) {
    return code
        .split('\n')
        .map(line => {
            const slashIdx = line.indexOf('//')
            const hashIdx = line.indexOf('#')
            let end = line.length
            if (slashIdx !== -1) end = Math.min(end, slashIdx)
            if (hashIdx !== -1) end = Math.min(end, hashIdx)
            return line.slice(0, end)
        })
        .join('\n')
}

function lexer(code) {
    const tokens = []
    const clean = stripComments(code)

    const re = /"[^"]*"|'[^']*'|>=|<=|!=|==|[+\-*\/%(){}=<>,]|[0-9]+(?:\.[0-9]+)?|[a-zA-Z_\u0900-\u097F][a-zA-Z0-9_\u0900-\u097F]*/g

    let match
    while ((match = re.exec(clean)) !== null) {
        const word = match[0]
        const before = clean.slice(0, match.index)
        const line = (before.match(/\n/g) || []).length + 1
        const lastNL = before.lastIndexOf('\n')
        const col = match.index - lastNL

        const keyword = langMap[word.toLowerCase()]
        if (keyword) {
            tokens.push(makeToken(keyword, word, line, col))
            continue
        }

        if (OPERATORS[word]) {
            tokens.push(makeToken(OPERATORS[word], word, line, col))
            continue
        }

        if (!isNaN(word) && word.trim() !== '') {
            tokens.push(makeToken(TOKENS.NUMBER, Number(word), line, col))
            continue
        }

        if (
            (word.startsWith('"') && word.endsWith('"')) ||
            (word.startsWith("'") && word.endsWith("'"))
        ) {
            tokens.push(makeToken(TOKENS.STRING, word.slice(1, -1), line, col))
            continue
        }

        tokens.push(makeToken(TOKENS.IDENTIFIER, word, line, col))
    }

    tokens.push(makeToken(TOKENS.EOF, null, 0, 0))
    return tokens
}

module.exports = lexer
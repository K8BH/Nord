// Nord Example Library
// Each example has: English code, Hinglish code, explanation, hints

const examples = [

    {
        id:          'hello-world',
        title:       'Hello World',
        level:       'beginner',
        tags:        ['basics', 'print', 'output'],
        description: 'Your very first Nord program — print something to the screen.',
        code: `print "Hello, World!"`,
        hinglish: `bolo "Namaste Duniya!"`,
        explanation: '"print" and "bolo" both show text on screen. bolo = Hindi word for "say/tell".',
        hints: ['Use print or bolo to show output', 'Put text inside double quotes "like this"']
    },

    {
        id:          'variables',
        title:       'Variables',
        level:       'beginner',
        tags:        ['variables', 'basics'],
        description: 'Store and use values in named variables.',
        code: `let name = "Alex"\nlet score = 95\nprint name\nprint score`,
        hinglish: `rakho naam = "Alex"\nrakho ank = 95\nbolo naam\nbolo ank`,
        explanation: '"let" and "rakho" both create variables. rakho = Hindi for "keep/store".',
        hints: ['let x = value  creates a variable', 'Use the variable name to read its value']
    },

    {
        id:          'arithmetic',
        title:       'Basic Math',
        level:       'beginner',
        tags:        ['math', 'arithmetic', 'operators'],
        description: 'Do arithmetic with + - * / %',
        code: `let a = 10\nlet b = 3\nlet sum = a + b\nlet diff = a - b\nlet product = a * b\nprint sum\nprint diff\nprint product`,
        hinglish: `rakho a = 10\nrakho b = 3\nrakho jod = a + b\nbolo jod`,
        explanation: 'Nord supports +, -, *, /, % (remainder). Results can be stored in variables.',
        hints: ['Use + to add, - to subtract, * to multiply, / to divide', '% gives the remainder']
    },

    {
        id:          'if-else',
        title:       'If / Else',
        level:       'beginner',
        tags:        ['control-flow', 'if', 'conditions'],
        description: 'Make decisions in your code.',
        code: `let age = 18\nif age >= 18 {\n    print "You can vote!"\n}\nelse {\n    print "Too young"\n}`,
        hinglish: `rakho umar = 18\nagar umar >= 18 {\n    bolo "Aap vote kar sakte hain!"\n}\nwarna {\n    bolo "Abhi nahi"\n}`,
        explanation: '"if/agar" runs a block when condition is true. "else/warna" runs when false.',
        hints: ['agar = Hindi for "if"', 'warna = Hindi for "otherwise/else"', 'Use ==, !=, <, >, <=, >= to compare']
    },

    {
        id:          'while-loop',
        title:       'While Loop',
        level:       'intermediate',
        tags:        ['control-flow', 'loops', 'while'],
        description: 'Keep running code while a condition is true.',
        code: `let count = 1\nwhile count <= 5 {\n    print count\n    count = count + 1\n}`,
        hinglish: `rakho ginti = 1\njabtak ginti <= 5 {\n    bolo ginti\n    ginti = ginti + 1\n}`,
        explanation: '"while/jabtak" loops as long as the condition stays true. Always update the variable or you get an infinite loop!',
        hints: ['jabtak = Hindi for "as long as / until"', 'Always change the loop variable inside the block']
    },

    {
        id:          'repeat-loop',
        title:       'Repeat Loop',
        level:       'beginner',
        tags:        ['control-flow', 'loops', 'repeat'],
        description: 'Run a block of code N times.',
        code: `repeat 5 {\n    print "Hello!"\n}`,
        hinglish: `dobara 5 {\n    bolo "Namaste!"\n}`,
        explanation: '"repeat/dobara" is the simplest loop — just say how many times.',
        hints: ['dobara = Hindi for "again/repeat"', 'The number can be a variable too: repeat count { }']
    },

    {
        id:          'functions-basic',
        title:       'Functions',
        level:       'intermediate',
        tags:        ['functions', 'reusability'],
        description: 'Create reusable blocks of code with functions.',
        code: `function greet() {\n    print "Hello from a function!"\n}\n\ngreet()\ngreet()`,
        hinglish: `kaam greet() {\n    bolo "Function se namaste!"\n}\n\ngreet()`,
        explanation: '"function/kaam" defines a reusable block. Call it by name with ().',
        hints: ['kaam = Hindi for "task/work"', 'Call a function by writing its name followed by ()']
    },

    {
        id:          'functions-params',
        title:       'Functions with Parameters',
        level:       'intermediate',
        tags:        ['functions', 'parameters'],
        description: 'Pass values into functions.',
        code: `function greet(name) {\n    print "Hello"\n    print name\n}\n\ngreet("Priya")\ngreet("Rahul")`,
        hinglish: `kaam greet(naam) {\n    bolo "Namaste"\n    bolo naam\n}\n\ngreet("Priya")\ngreet("Rahul")`,
        explanation: 'Parameters let you pass data into a function. Each call can use different values.',
        hints: ['Put parameter names inside function( name1, name2 )', 'Pass values when calling: greet("Priya")']
    },

    {
        id:          'functions-return',
        title:       'Functions with Return',
        level:       'intermediate',
        tags:        ['functions', 'return', 'values'],
        description: 'Get a value back from a function.',
        code: `function add(x, y) {\n    return x + y\n}\n\nlet result = add(10, 20)\nprint result`,
        hinglish: `kaam jodo(x, y) {\n    wapas x + y\n}\n\nrakho nateeja = jodo(10, 20)\nbolo nateeja`,
        explanation: '"return/wapas" sends a value back from the function. Store it in a variable.',
        hints: ['wapas = Hindi for "back/return"', 'Returned value can be stored: let x = myFunc()']
    },

    {
        id:          'fizzbuzz',
        title:       'FizzBuzz',
        level:       'intermediate',
        tags:        ['classic', 'loops', 'conditions', 'math'],
        description: 'The classic programming challenge — print Fizz, Buzz, or the number.',
        code: `let i = 1\nwhile i <= 15 {\n    if i % 3 == 0 {\n        print "Fizz"\n    }\n    i = i + 1\n}`,
        hinglish: `rakho i = 1\njabtak i <= 15 {\n    agar i % 3 == 0 {\n        bolo "Fizz"\n    }\n    i = i + 1\n}`,
        explanation: '% gives the remainder after division. If remainder is 0, the number is divisible.',
        hints: ['% 3 == 0 means "divisible by 3"', 'Chain ifs for FizzBuzz: check 15, then 3, then 5']
    },

    {
        id:          'factorial',
        title:       'Factorial',
        level:       'advanced',
        tags:        ['math', 'loops', 'functions'],
        description: 'Calculate n! using a loop.',
        code: `function factorial(n) {\n    let result = 1\n    let i = 1\n    while i <= n {\n        result = result * i\n        i = i + 1\n    }\n    return result\n}\n\nprint factorial(5)\nprint factorial(10)`,
        hinglish: `kaam factorial(n) {\n    rakho nateeja = 1\n    rakho i = 1\n    jabtak i <= n {\n        nateeja = nateeja * i\n        i = i + 1\n    }\n    wapas nateeja\n}\n\nbolo factorial(5)`,
        explanation: 'Factorial of n is 1×2×3×…×n. We multiply in a loop and return the final result.',
        hints: ['Start result at 1 (not 0)', 'Multiply result by i each iteration']
    }

]

// Helper to get a single example by id
function getExample(id) {
    return examples.find(e => e.id === id) || null
}

// Filter examples by level or tags
function filterExamples({ level, tag } = {}) {
    let list = [...examples]
    if (level) list = list.filter(e => e.level === level)
    if (tag)   list = list.filter(e => e.tags.includes(tag))
    return list
}

module.exports = { examples, getExample, filterExamples }
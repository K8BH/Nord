# Nord Language Platform

Nord is a multilingual programming language playground where users can code in Hinglish, Hindi, English, or mixed native-language syntax and translate it into real JavaScript or Python.

Built with a real compiler pipeline:

Lexer → Parser → AST → IR → Translator → Executor

---

## Example

### Nord

```nord
rakho name = "Nord"

bolo "Hello " + name
```

### JavaScript Output

```js
let name = "Nord"

console.log("Hello " + name)
```

---

## Features

- Hinglish programming
- Hindi-style syntax
- JavaScript translation
- Python translation
- Real execution engine
- Web playground
- CLI support
- AST + IR pipeline

---

## Run

```bash
npm install
node Server.js
```

Open:

```txt
http://localhost:3000
```

---

## Keywords

| English | Nord |
|---|---|
| print | bolo |
| let | rakho |
| if | agar |
| else | warna |
| while | jabtak |
| function | kaam |
| return | wapas |

---

## Tech Stack

- Node.js
- Express
- Custom Lexer
- Recursive Descent Parser
- IR Builder
- JS/Python Translator

---

## Project Structure

```txt
Nord/
│
├── Nord.js
├── Server.js
├── Router.js
├── Lexer.js
├── Parser.js
├── IRBuilder.js
├── Translator.js
├── Runtime.js
├── Executor.js
├── LanguageMap.js
├── Tokens.js
├── Examples.js
├── index.html
├── style.css
├── app.js
├── package.json
```

---

## Built By

K8BH

const examples = {
    hello: `print "Hello World"`,

    vars: `let name = "Nord"
print name`,

    loop: `let i = 1
while i <= 5 {
    print i
    i = i + 1
}`,

    func: `function add(a, b) {
    return a + b
}

print add(5, 10)`
}

function setExample(key) {
    document.getElementById("code").value = examples[key]
}

async function run() {
    const code = document.getElementById("code").value
    const target = document.getElementById("target").value

    document.getElementById("output").textContent = "Running..."

    const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, target })
    })

    const data = await res.json()

    document.getElementById("output").textContent =
        JSON.stringify(data, null, 2)
}
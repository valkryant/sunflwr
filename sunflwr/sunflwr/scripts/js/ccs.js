const title = document.getElementById('categoryTitle')
const scriptsContainer = document.getElementById('scripts')
const formatter = new Compressor()
const searchbar = document.getElementById('searchbar')

var currentScripts = []
var currentScriptDisplays = []
var currentCategory = updateCategory('all')

document.addEventListener('click', e => {
    if (e.target.getAttribute('id') == 'navButton') {
        updateCategory(e.target.innerText)
    }
    if (e.target == searchbar) {
        searchbar.select()
        searchbar.setSelectionRange(0, 999999)
    }
})
document.addEventListener('keyup', e => {
    if (document.activeElement == searchbar) {
        filterScripts()
    }
})

function filterScripts() {
    scriptsContainer.innerHTML = ''
    var query = searchbar.value.toLowerCase()
    var count = 0

    for (var i = 0; i < currentScriptDisplays.length; i++) {
        var s = currentScriptDisplays[i]
        if (s.innerText.toLowerCase().includes(query)) {
            count++
            scriptsContainer.appendChild(s)
        }
    }

    title.innerText = captialize(currentCategory) + ' Scripts ' 
                        + (searchbar.value.length == 0 ? '' : 'for "' + searchbar.value + '"')
}

function updateCategory(newCategory) {
    currentScripts = []
    currentScriptDisplays = []
    scriptsContainer.innerHTML = ''

    if (newCategory.toLowerCase() == 'all') {
        fetchCategory('anchor')
        fetchCategory('crystal')
        fetchCategory('hacks')
        fetchCategory('macros')
        fetchCategory('totem')
        currentCategory = 'all'
        filterScripts()
        return currentCategory
    }

    currentCategory = newCategory.toLowerCase()
    title.innerText = captialize(currentCategory) + ' Scripts'
    fetchCategory()
    filterScripts()
    return currentCategory
}

function fetchCategory(category) {
    var cat = category != null ? category : currentCategory
    var link = './scripts/content/' + cat + '.category'
    console.log('fetching data from: ' + link)

    fetch(link)
    .then(res => res.text())
    .then(res => parseFile(formatter.decompress(res)))
}

function parseFile(fileContents) {
    var scripts = fileContents.split(/^```/gm).filter(s => s != null && s.trim().length != 0)
    var query = searchbar.value.toLowerCase()
    
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i]
        script = parseScript(script)
        currentScripts.push(script)
        
        code = `
        <p id="title">` + script.name + `</p>
        <span id="author">` + (script.author != null ? 'by ' + script.author : '') + `</span>
        <p id="desc">` + script.desc + `</p>
        <textarea id="contents" style="cursor:pointer;">` + script.contents + `</textarea>
        `

        var div = document.createElement('div')
        div.setAttribute('id', 'script')
        div.innerHTML = code
        addScriptDisplayListener(div)

        if ((script.name + script.desc).toLowerCase().includes(query)) {
            scriptsContainer.appendChild(div)
        }
        currentScriptDisplays.push(div)
    }
}

function addScriptDisplayListener(div) {
    div.addEventListener('click', e => {
        var contents = div.querySelector('textarea#contents')
        contents.select()
        contents.setSelectionRange(0, 999999)
        navigator.clipboard.writeText(contents.value)
    })
}

function parseHTMLlines(str) {
    str = formatter.decompress(str)
    code = ``

    var lines = str.split(/\n/gm).filter(s => s != null)
    for (var i = 0; i < lines.length; i++) {
        code += `<p style="margin: 0; padding: 0;">` + lines[i].replaceAll(' ', '&nbsp') + `</p>`
    }

    var div = document.createElement('p')
    div.setAttribute('id', 'contents')
    div.innerHTML = code
    return div
}

function parseScript(script) {
    var lines = script.split(/\n/gm).filter(s => s.match(/.*(def|module|desc|\/{2}).*/gm))
    var name = 'Unnamed Module'
    var desc = 'No description provided'
    var author = null
    var hasName = false
    var hasDesc = false

    for (var i = 0; i < lines.length; i++) {
        if (hasDesc && hasName) {
            break
        }
        var line = lines[i]

        if (line.match(/.*(def module|module create).*/gm) != null) {
            line = line.replaceAll(/.*(def module|module create)\s+/gm, '')
            line = captialize(line)
            name = line
            hasName = true
        }
        else if (line.match(/.*(def description|def desc|description|desc).*/gm) != null) {
            line = line.replaceAll(/.*(def description|def desc|description|desc)\s+/gm, '')
            line = line.replaceAll(/(^\")|(\"$)/gm, '')
            desc = line
            hasDesc = true
        }
        else if (line.match(/^\s*(\/{2})\s*@\s*.*$/gm) != null) {
            console.log(line)
            line = line.replaceAll(/^\s*(\/{2})\s*@\s*/gm, '')
            line = captialize(line)
            author = line
        }
    }
    console.log('by ' + author)
    return new Script(name, desc, author, script)
}

function captialize(str) {
    var words = str.toLowerCase().split(/[ \\/+_,-]/gm)
    var result = ''
    for (var i = 0; i < words.length; i++) {
        var str = words[i]
        result += str.substring(0, 1).toUpperCase() + str.substring(1) + ' '
    }
    return result.trim()
}

class Script {
    name
    desc
    contents
    author

    constructor(name, desc, author, contents) {
        this.name = name
        this.desc = desc
        this.author = author
        this.contents = contents
    }
}
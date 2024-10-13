
const bookmarkPattern = /^\s*(.*):\s*((https?:\/\/)?\w+.\w+.*)$/gm
const titlePattern = /^\s*(.*):\s*$/gm
const contentsLink = '../../bookmarks.txt'
const headers = {
    method: 'GET'
}

const htmlContainer = document.querySelector('.container')
const htmlNav = document.querySelector('nav .links')

loadContents()

async function fetchContents() {
    var response = await fetch(contentsLink, headers)
    var text = await response.text()
    var container = BookmarkContainer.parse(text)
    console.log(container)
    return container
}

async function loadContents() {
    var container = await fetchContents()
    
    htmlContainer.innerHTML = ''
    for (var i = 0; i < container.contents.length; i++) {
        var content = container.contents[i]
        if (content.bookmarks.length == 0) {
            continue
        }
        htmlContainer.appendChild(content.createHTML())
    }

    htmlNav.innerHTML = ''
    for (var i = 0; i < container.quickAccess.length; i++) {
        var link = container.quickAccess[i]
        var a = document.createElement('a')
        a.href = link.href
        a.innerText = link.name
        htmlNav.appendChild(a)
    }
}

class BookmarkContainer {
    quickAccess = []
    contents = []

    static parse(yml) {
        var container = new BookmarkContainer()
        var lines = yml.trim().split('\n')
        var currentCategory
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim()
            if (line.length == 0) {
                continue
            }

            var regex = titlePattern.exec(line)
            if (regex) {
                currentCategory = new Category(regex[1], [])
                container.contents.push(currentCategory)
                continue
            }

            if (line.match(bookmarkPattern)) {
                var mark = new Bookmark(line)
                if (currentCategory.name == 'Quick Access') {
                    container.quickAccess.push(mark)
                }
                else {
                    currentCategory.bookmarks.push(mark)
                }
            }
        }
        return container
    }

    constructor () {

    }
}

class Category {
    name = 'Unnamed Category'
    bookmarks = []

    constructor (name, bookmarks) {
        this.name = name
        this.bookmarks = bookmarks
    }

    createHTML() {
        var categoryDiv = document.createElement('div')
        categoryDiv.className = 'category'
        categoryDiv.id = this.name
        
        var titleHeader = document.createElement('h3')
        titleHeader.id = 'name'
        titleHeader.innerText = this.name
        categoryDiv.appendChild(titleHeader)

        var bookmarksDiv = document.createElement('div')
        bookmarksDiv.id = 'bookmarks'
        categoryDiv.appendChild(bookmarksDiv)

        for (var i = 0; i < this.bookmarks.length; i++) {
            var bookmark = this.bookmarks[i]
            var bookmarkDiv = document.createElement('div')
            bookmarkDiv.className = 'bookmark'
            bookmarksDiv.appendChild(bookmarkDiv)

            var href = document.createElement('a')
            href.href = bookmark.href
            href.innerText = bookmark.name
            bookmarkDiv.appendChild(href)
        }

        console.log(bookmarksDiv)
        
        return categoryDiv
    }
}

class Bookmark {
    name = 'Unnamed Bookmark'
    href = ''

    constructor (input) {
        input = input.trim();
        var match = bookmarkPattern.exec(input)
        this.name = match[1]
        this.href = match[2]
    }
}




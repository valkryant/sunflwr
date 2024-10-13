const inputUser = document.querySelector('.inputs > .textarea > #user')
const inputRepo = document.querySelector('.inputs > .textarea > #repo')
const genButton = document.querySelector('.inputs > .textarea #button-generate')
const results = document.querySelector('.results .outputs')
const out = new MainOutput()
const gen = new Generator()
var assetCards = []

genButton.addEventListener('click', generate)

function generate() {
    var user = inputUser.value.trim()
    var repo = inputRepo.value.trim()
    var api = 'https://api.github.com/repos/' + user + '/' + repo + '/releases'

    if (user.length == 0 || repo.length == 0) {
        out.error('Please provide inputs for user-name and repo-name!')
        return;
    }

    console.log(api)
    fetch(api, { method: 'GET' })
    .then(res => res.json())
    .then(res => {
        var totalDl = 0;
        var totalAs = 0;
        gen.clear()

        if (res.length == undefined) {
            out.error('Repository "https://github.com/' + user + '/' + repo + '" not found')
            console.error('Error: Repository ' + api + ' not found!')
            return;
        }

        console.log('Generating results for ' + api)
        for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].assets.length; j++) {
                var asset = res[i].assets[j]
                var dl = asset.download_count
                totalDl += dl
                totalAs++
                gen.create(asset)
            }
        }
        out.write('Total Downloads: ' + totalDl + ' , Total Releases: ' + res.length + ' , Total Assets: ' + totalAs)
    })
}

function Generator() {
    this.count = 0
    this.create = function (asset) {
        var div = document.createElement('div')
        div.setAttribute('class', 'output')
        div.innerHTML = `
        <div id="name">` + (this.count + 1) + ')' + `<a href="` + asset.browser_download_url + `"><p>` + asset.name + `</p></a></div>
        <span id="downloads">Downloads: ` + asset.download_count + `</span><br>
        <span id="created">Created At: ` + new Date(asset.created_at).toLocaleDateString() + `</span><br>
        <div id="author-info">
            <p>Uploaded by:</p>
            <a href="` + asset.uploader.html_url + `" id="author">
                <img src="` + asset.uploader.avatar_url + `" alt="" id="pfp">
                <span id="name">` + asset.uploader.login + `</span>
            </a>
        </div>
        `
        results.appendChild(div)
        assetCards.push(div)
        this.count++
    }
    this.clear = function () {
        for (var i = 0; i < assetCards.length; i++) {
            results.removeChild(assetCards[i])
        }
        assetCards.splice(0, assetCards.length)
        this.count = 0;
    }
}

function MainOutput() {
    this.self = document.querySelector('.results > .outputs > #main-output')
    this.error = function (text) {
        this.clear()
        var span = document.createElement('span')
        span.setAttribute('class', 'error')
        span.innerText = text
        this.self.appendChild(span)
    }
    this.write = function (text) {
        this.clear()
        var span = document.createElement('span')
        span.innerText = text
        this.self.appendChild(span)
    }
    this.clear = function () {
        for (var i = 0; i < this.self.children.length; i++) {
            this.self.removeChild(this.self.children[i])
        }
    }
}
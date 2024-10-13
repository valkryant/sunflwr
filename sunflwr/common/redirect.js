code = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
</head>
<style>
    body {
        top: 0;
        left: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .element {
        border: black 1px solid;
        width: 300px;
        margin: auto;
        margin-top: 30vh;
        border-radius: 10px;
        padding: 10px;
    }

    #title {
        text-align: center;
        border-bottom: blue 3px solid;
        padding-bottom: 10px;
    }
    
    #destination {
        text-align: center;
    }

    a {
        color: blue;
    }
</style>
<body>
    <div class="element">
        <h1 id="title">Redirecting...</h1>
        <p id="destination">Traveling to </p>
    </div>
</body>
<script>redirect()</script>
</html>
`;


var dest = document.children[0].textContent.replace(/(^["'])|(["']$)/gi, '');
document.write(code);

function redirect() {
    var link = document.createElement('span');
    link.innerHTML = `<a href="` + dest + `">` + dest + `</a>`;

    document.querySelector('#destination').appendChild(link);
    console.log('Redirecting to ' + dest);
    window.location.href = dest
}

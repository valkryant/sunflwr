code = `
<style>
    .fixed-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        z-index: -1;
    }
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(black, black, black, rgb(0, 61, 78));
        opacity: 0.6;
        z-index: -1;
    }
</style>
<div class="fixed-background"></div>
<div class="overlay"></div>
`;

var bg = document.createElement('div');
bg.innerHTML = code;
document.body.appendChild(bg);
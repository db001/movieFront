var menuBtn = document.getElementById('menu');

var menuVisible = false;

function menuToggle() {
    var dropMenu = document.getElementById('js-dropdown');
    if(menuVisible) {
        dropMenu.style.display = 'none';
        menuVisible = false;
    } else if (!menuVisible) {
        dropMenu.style.display = 'flex';
        menuVisible = true;
    }
}

menuBtn.addEventListener('click', menuToggle);

// Image popout for gallery
var images;

window.onload(function() {
    images = document.getElementsByClassName('js-img');
}) 

function imagePop() {
    console.log(images);    
}

for (var i = 0; i < images.length; i++) {
    images.addEventListener('click', imagePop);
}
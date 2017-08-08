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

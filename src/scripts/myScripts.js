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

// Image popout for gallery logic
var images;
var modal = document.getElementById('image-modal');
var closeIcon = document.getElementsByClassName('close')[0];
var modalImg = document.getElementById('js-modal-img');

function getImages() {
    images = document.getElementsByClassName('js-img');
    // console.log(images);
    for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('click', imagePop);
    }
        
}

window.onload = getImages; 

function imagePop(e) {
    var targetSrc = e.target.currentSrc;
    modalImg.setAttribute('src', targetSrc);
    modal.style.display = 'flex';
}

closeIcon.addEventListener('click', function() {
    modal.style.display = 'none';
})

window.onclick = function(ev) {
    if (ev.target == modal) {
        modal.style.display = 'none';
    } 
}
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

// Gallery image popout for logic
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

// Scroll to section logic
// Sections: about, services, find-us, gallery, testimonials

function getData(e) {

    // Current position
    var docScroll = document.documentElement.scrollTop || document.body.scrollTop;

    // Get data-link from target div
    var eleLink = e.target.parentNode.dataset.link;

    // Assign target to variable and get position
    var eleTarget = document.getElementById(eleLink)
    var eleRect = eleTarget.getBoundingClientRect();

    // Get height of navbar
    var navHeight = document.getElementsByTagName('nav')[0].clientHeight;

    window.scrollTo(0, eleRect.top - navHeight + docScroll);
}

var links = document.getElementsByClassName('nav-item-container');

for(var j = 0; j < links.length; j++) {
    links[j].addEventListener('click', getData);
}

// Clicking the brand returns to the top of the page
 
function toTop() {
    window.scrollTo(0, 0);
}

document.getElementById('brand').addEventListener('click', toTop);
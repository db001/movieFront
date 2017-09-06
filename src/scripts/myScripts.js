// Dropdown menu logic
var menuBtn = document.getElementById('menu');

var menuVisible = false;

function menuToggle() {
    var dropMenu = document.getElementById('js-dropdown');
    if (menuVisible) {
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

// Call function once window has loaded all images
window.onload = getImages;

function imagePop(e) {
    var targetSrc = e.target.currentSrc;
    modalImg.setAttribute('src', targetSrc);
    modal.style.display = 'flex';
}

closeIcon.addEventListener('click', function () {
    modal.style.display = 'none';
})

window.onclick = function (ev) {
    if (ev.target == modal) {
        modal.style.display = 'none';
    }
}

// Scroll to section logic
// Sections: about, services, find-us, gallery, testimonials

function jumpToSection(e) {

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

for (var j = 0; j < links.length; j++) {
    links[j].addEventListener('click', jumpToSection);
}

// Clicking the brand returns to the top of the page
function toTop() {
    window.scrollTo(0, 0);
}

document.getElementById('brand').addEventListener('click', toTop);

// Map link in jumbo navigate to map
document.getElementById('map-link').addEventListener('click', jumpToSection);

// Testimonials slide show
var customerQuotes = [{
        quote: "I love them, they are the best",
        customer: "A. Jolie"
    },
    {
        quote: "My car feels amazing",
        customer: "A. A. Milne"
    },
    {
        quote: "Always take my car there and they've been great, never found anywhere that beats them on service or price",
        customer: "Jane Smith"
    },
    {
        quote: "Went there expecting a lot of work to be needed, fixed the problem within half an hour and only charged me for the part",
        customer: "Bill Murray"
    }
];

var custQuote = document.getElementById('customer-quote');
var custName = document.getElementById('customer-name');

var quoteIndex = 0;

function showQuote() {
    if (quoteIndex > customerQuotes.length - 1) {
        quoteIndex = 0;
    }
    custQuote.innerText = customerQuotes[quoteIndex].quote;
    custName.innerText = customerQuotes[quoteIndex].customer;
    quoteIndex++;
}

// Call function to avoid blank box for first 3 seconds
showQuote();

setInterval(showQuote, 3000);

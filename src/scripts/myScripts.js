const API_KEY = `REMOVED`;

let GBCerts = [];
let certEles = [];

// `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&region=GB&sort_by=popularity.desc&certification_country=GB&certification=18&include_adult=false&include_video=false&page=1`

const baseURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=en-US&region=GB`;

let certURL = '';
let yearURL = '';

$(document).ready(function() {
  
  certPromise.then(function() {

    certEles = document.getElementsByClassName('cert');
  
    for(let j = 0; j < certEles.length; j++) {
      certEles[j].addEventListener('mouseover', showCertMeaning);
      certEles[j].addEventListener('mouseleave', hideCertMeaning);
      certEles[j].addEventListener('click', selectCert);      
    }
  }, function(error) {
    console.error(`Error: ${error}`);
  });

  genrePromise.then(function() {
    let genreElements = document.getElementsByClassName('genre');

    for (let j = 0; j < genreElements.length; j++) {
      genreElements[j].addEventListener('click', selectGenre);
    }
  }, function(error) {
    console.error(`Genre: ${error}`);
  })

  $('#searchButton').click(searchForFilms);  
  $('#resetButton').click(reset);
})

let certPromise = new Promise(function(resolve, reject) {

  $.getJSON(`https://api.themoviedb.org/3/certification/movie/list?api_key=${API_KEY}`, function(data) {
    
    // Get certifications for GB - returns array of objects
    let certs = data.certifications.GB;
    
    // Loop through certs to put in order and push to GBCerts array
    for(let i = 1; i <= certs.length; i++) {
      let x = certs.filter((obj) => obj.order == i);
      GBCerts.push(...x);
    }
    
    // Append certification to DOM
    GBCerts.map(ele => {
      $('#certSelect').append(`<li class='cert' data-certValue='${ele.certification}'>${ele.certification}<span class='certDescription'>${ele.meaning}</span></li>`);
    })
  })

  // It's hacky and I don't like it but my promise gets rejected otherwise
  // To do: practice Promises

  if(certEles.length == 0) {
    resolve('Yay')
  } else {
    reject('Boo');
  }
})

// Show certification meaning, to be fired on mouseover
function showCertMeaning() {
  let certText = this.getElementsByClassName('certDescription')[0];
  certText.style.display = 'block';
}

// Hide certification meaning on mouseleave
function hideCertMeaning() {
  let certText = this.getElementsByClassName('certDescription')[0];
  certText.style.display = 'none';
}

// Let user select a certification and return URL addition
function selectCert() {
  let lesserCerts = document.getElementById('includeLesserCerts');
  certURL = `&certification_country=GB&certification`;

  // Check to see if user wants certifications lower than selection included
  if(lesserCerts.checked) {
    certURL += `.lte=${this.dataset.certvalue}`;
  } else {
    certURL += `=${this.dataset.certvalue}`;
  }

  // Add active class to selected certification
  Array.from(document.getElementsByClassName('cert')).forEach(function(ele) {
    ele.classList.remove('active');
  });
  this.classList.add('active');
}

let genrePromise = new Promise(function(resolve, reject) {

  $.getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`, function(data) {
    
    // Get genres with ids - returns array of objects
    let genres = data.genres;

    // Add genres to DOM
    genres.map(ele => {
      $('#genreSelect').append(`<li class='genre' data-genreId='${ele.id}'>${ele.name}</li>`);
    })
  })

  /* eslint-disable */
  if(true) {
    resolve('Yay');
  } else {
    reject('Boo');
  }
  /* eslint-enable */  
});

function selectGenre() {
  $(this).toggleClass('active');
}

function getReleaseYear() {  
  yearURL = `&primary_release_year=`;
}

function searchForFilms() {
  let selectedGenres = $('.genre.active');
  let genreURL = '';

  if (selectedGenres.length >= 1) {
    genreURL = `&with_genres=${selectedGenres[0].dataset.genreid}`;
    for (let k = 1; k < selectedGenres.length; k++) {
      genreURL += `,${selectedGenres[k].dataset.genreid}`
    }
  }

  let searchURL = baseURL + certURL + genreURL;
  console.log(searchURL);

  $.getJSON(searchURL, function(data) {
    console.log(data.results);
    let movieResults = data.results;
    
    movieResults.map(ele => {
      $('.results').append(`<div class="result">${ele.title}</div><p>${ele.overview}</p>`)
    })
  });
  
}

function reset() {
  $('.active').each(function() {
    $(this).removeClass('active');  
  })
}

/*

function showSlides(n) {
  let slides = document.getElementsByClassName('mySlides');

  if(n > slides.length) {
    slideIndex = 1;
  }
  if(n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "flex";
}

let next = document.getElementsByClassName('next')[0];
let prev = document.getElementsByClassName('prev')[0];

next.addEventListener('click', function() {
  showSlides(slideIndex += 1);
});

prev.addEventListener('click', function() {
  showSlides(slideIndex -= 1);
});

*/
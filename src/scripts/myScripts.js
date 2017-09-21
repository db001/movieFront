const API_KEY = `removed`;

let GBCerts = [];
let certEles = [];

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
  if(true) {
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

function hideCertMeaning() {
  let certText = this.getElementsByClassName('certDescription')[0];
  certText.style.display = 'none';
}

function selectCert() {
  console.log(this.dataset.certvalue);
}


/*
const genres = [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"},
    {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"},
    {"id": 80, "name": "Crime"},
    {"id": 99, "name": "Documentary"},
    {"id": 18, "name": "Drama"},
    {"id": 10751, "name": "Family"},
    {"id": 14, "name": "Fantasy"},
    {"id": 36, "name": "History"},
    {"id": 27, "name": "Horror"},
    {"id": 10402, "name": "Music"},
    {"id": 9648, "name": "Mystery"},
    {"id": 10749, "name": "Romance"},
    {"id": 878, "name": "Science Fiction"},
    {"id": 10770, "name": "TV Movie"},
    {"id": 53, "name": "Thriller"},
    {"id": 10752, "name": "War"},
    {"id": 37, "name": "Western"}
];

function createUrl() {
  let baseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&region=GB&sort_by=popularity.desc`;

  let cert = `&certification=${document.getElementById('js-cert').value}`;
  let genreURL = `with_genres=${getGenre(genres, document.getElementById('js-genre').value)}`;
  let relYear = `primary_release_year=${document.getElementById('js-releaseYear').value}`;

  let URL = `${baseURL}&certification_country=GB${cert}&include_video=false&page=1&${relYear}&${genreURL}` 

  console.log(URL);
  return URL;

}

function getGenre(arr, genre) {
  return arr.filter(obj => obj.genre);
}

let movieURL = createUrl();

let test = document.getElementById('test');

let slideIndex = 1;

fetch(movieURL)
    .then(res => res.json())
    .then((data) => {
        let results = data.results;
        for(let i = 0; i < results.length; i++) {
            test.innerHTML += formatData(results[i]);
        }
        showSlides(slideIndex);
    })      
    .catch(err => console.error(err));

function formatData(data) {
    return `
        <div class="mySlides">
            <img src="https://image.tmdb.org/t/p/w342/${data.poster_path}">
            <h3 class="caption">${data.title}</h3>
        </div>`
}

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

let date = new Date();

let yearControl = document.getElementById('js-releaseYear');
yearControl.max = date.getFullYear();
yearControl.value = "2017";

*/
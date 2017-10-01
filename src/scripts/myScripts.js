const API_KEY = `REMOVED`;

let GBCerts = [];
let certEles = [];

const baseURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=en-US&region=GB`;

let certURL = '';

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

  $('.dropdownArrow').on('click', function() {
    $(this).next().slideToggle('slow', function() {
    })
  })   
})
// End of document ready

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
  let lesserCerts = $('#includeLesserCerts')[0];
  let higherCerts = $('#includeHigherCerts')[0];
  certURL = `&certification_country=GB&certification`;

  // Check to see if user wants certifications lower than selection included
  if(lesserCerts.checked && !higherCerts.checked) {
    certURL += `.lte=${this.dataset.certvalue}`;
  } else if (!lesserCerts.checked && higherCerts.checked) {
    certURL += `.gte=${this.dataset.certvalue}`;
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

function getReleaseYear(year) {
  // primary_release_date.gte
  // primary_release_date.lte

  let yearsBefore = $('#yearsBefore')[0];
  let yearsAfter = $('#yearsAfter')[0];

  if (year && yearsBefore.checked && !yearsAfter.checked) {
    return `&primary_release_date.lte=${year}-12-31`;
  } else if (year && yearsAfter.checked && !yearsBefore.checked) {
    return `&primary_release_date.gte=${year}-01-01`;
  } else if (year) {
    return `&primary_release_year=${year}`;
  } else {
    return '';
  } 
}

function searchForFilms() {

  $('.results').empty();

  let selectedGenres = $('.genre.active');
  let genreURL = '';

  if (selectedGenres.length >= 1) {
    genreURL = `&with_genres=${selectedGenres[0].dataset.genreid}`;
    for (let k = 1; k < selectedGenres.length; k++) {
      genreURL += `,${selectedGenres[k].dataset.genreid}`
    }
  }

  let yearURL = getReleaseYear($('#releaseYearInput').val());


  let searchURL = baseURL + certURL + genreURL + yearURL;

  $.getJSON(searchURL, function(data) {
    let movieResults = data.results;

    if (data.results.length === 0) {
      $('.results').append(`<div>No results match your search</div>`);
    } else {
      movieResults.map(ele => {
        $('.results').append(`
          <div class="result" data-film_id="${ele.id}">
            <img src="https://image.tmdb.org/t/p/w92/${ele.poster_path}">
            <div>
              <h4 class="film-title">${ele.title}</h4>
              <p class="film_description">${ele.overview}</p>
            </div>
          </div>`);
      })
    }    
  });  
}

function reset() {
  $('.active').each(function() {
    $(this).removeClass('active');  
  });
  $('#releaseYearInput').val('') === 0;

  $('#yearsBefore').prop('checked', false);
  $('#yearsAfter').prop('checked', false);
  $('#includeLesserCerts').prop('checked', false);
  $('#includeHigherCerts').prop('checked', false);
  
  certURL = '';
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
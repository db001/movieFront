const mmbjdb = `019825fa58fb7940e7912b45ae59d036`;

let GBCerts = [];
let certEles = [];
let certDesc = [];

const baseURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${mmbjdb}&language=en-US&region=GB`;

let certURL = '';

$(document).ready(function() {
  
  certPromise.then(function() {

    certEles = document.getElementsByClassName('cert');
  
    for(let j = 0; j < certEles.length; j++) {
      certEles[j].addEventListener('mouseover', showCertMeaning);
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
  });

  let checkCertMeanings = $('#showCertDescription')[0]; 
  checkCertMeanings.addEventListener('click', displayCertMeanings);

  $('#searchButton').click(searchForFilms);  
  $('#resetButton').click(reset);

  $('.result').on('click', showMovie);

  $('#newSearch').on('click', function() {
    $('.searchContainer').slideDown('slow');
    reset();
    $('#newSearch').slideUp('slow');
  })
    
})
// End of document ready

let certPromise = new Promise(function(resolve, reject) {

  $.getJSON(`https://api.themoviedb.org/3/certification/movie/list?api_key=${mmbjdb}`, function(data) {
    
    // Get certifications for GB - returns array of objects
    let certs = data.certifications.GB;
    
    // Loop through certs to put in order and push to GBCerts array
    for(let i = 1; i <= certs.length; i++) {
      let x = certs.filter((obj) => obj.order == i);
      GBCerts.push(...x);
    }
    
    // Append certification to DOM
    GBCerts.map((ele, idx) => {
      $('#certSelect').append(`
        <div class='cert' data-certValue='${ele.certification}' data-certNumber='${idx}'>${ele.certification}
        </div>`);
      certDesc.push(ele.meaning);
    })
  })

  // To do: practice Promises

  if(certEles.length == 0) {
    resolve('Yay')
  } else {
    reject('Boo');
  }
})

// Show certification meanings box depending on checkbox
function displayCertMeanings() {
  let certCheckBox = $('#showCertDescription')[0];
  if(certCheckBox.checked) {
    $('#certDescriptionBox').slideDown('slow');
  } else {
    $('#certDescriptionBox').slideUp('slow', function() {
      $('#certDescriptionBox').text('Hover over a certification to show its meaning');
    });
  }   
}

// Show certification meaning, to be fired on mouseover
function showCertMeaning() {
  let certCheckBox = $('#showCertDescription')[0];
  let certNumber = this.dataset.certnumber;
  let cert = this.dataset.certvalue;
  if(certCheckBox.checked) {
    $('#certDescriptionBox').text(cert + " - " + certDesc[certNumber]);    
  }
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

  $.getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${mmbjdb}&language=en-US`, function(data) {
    
    // Get genres with ids - returns array of objects
    let genres = data.genres;

    // Add genres to DOM
    genres.map(ele => {
      $('#genreSelect').append(`<div class='genre' data-genreId='${ele.id}'>${ele.name}</div>`);
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

// Add styling to selected genre
function selectGenre() {
  $(this).toggleClass('active');
}

function getReleaseYear(year) {

  // Get checkboxes for previous and following years
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

  // Add selected genres to URL
  let selectedGenres = $('.genre.active');
  let genreURL = '';

  if (selectedGenres.length >= 1) {
    genreURL = `&with_genres=${selectedGenres[0].dataset.genreid}`;
    for (let k = 1; k < selectedGenres.length; k++) {
      genreURL += `,${selectedGenres[k].dataset.genreid}`
    }
  }

  // Add year(s) selected to URL
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
            <div>
              <img src="https://image.tmdb.org/t/p/w342/${ele.poster_path}">
              <h4 class="film-title">${ele.title}</h4>
            </div>
          </div>`);
      })
    }    
  });

  certURL = '';  

  $('.results').on('click', '.result', showMovie);
  $('body').on('click', '.close', function() {
    $('#movieModal').hide();
  });

  $('.searchContainer').slideUp('slow');

  if($('#newSearch').hasClass('hidden')) {
    $('#newSearch').slideDown('slow');
  }

}

function showMovie(e) {
  $('#movieModal').remove();
  let filmId = e.currentTarget.dataset.film_id;
  let filmURL = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${mmbjdb}&language=en-US`;
  $.getJSON(filmURL, function(data) {
    let year = data.release_date.match(/^\d+/g);

    // Film may not have listed production company or homepage
    let production_co = data.production_companies.length !== 0 ? data.production_companies[0].name : '';
    let homepage = data.homepage != '' ? '<a class="movie-link" href="' + data.homepage + '" target="_blank">Homepage</a>' : '';

    $('body').append(`
    <div id="movieModal">  
      <div class="modal-content">                 
        <div class="movie-headlines">
          <span class="close">x</span>
          <div><img src="https://image.tmdb.org/t/p/w92/${data.poster_path}"></div>
          <div class="modalText">
            <h3 id="modal-heading">${data.original_title}</h3>
            <p>${data.tagline}</p>
            <p id="modal-year"><em>${year}</em></p>                      
          </div>                     
        </div>
        <p id="modal-description">${data.overview}</p>  
        <div class="movie-details">
          <p>${production_co}</p>
          ${homepage}         
        </div>
      </div>          
    </div>`);

    $('#movieModal').show();
    }
  );
}

// Reset function, clear all previous changes and reset search terms
function reset() {
  $('.active').each(function() {
    $(this).removeClass('active');  
  });
  $('#releaseYearInput').val('') === 0;

  $('#yearsBefore').prop('checked', false);
  $('#yearsAfter').prop('checked', false);
  $('#includeLesserCerts').prop('checked', false);
  $('#includeHigherCerts').prop('checked', false);

  $('.results').empty();
  
  certURL = '';
}
let movieURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY_REMOVED}&language=en-US&region=GB&sort_by=popularity.desc&certification_country=GB&include_adult=false&include_video=false&page=1&release_date.gte=2017-08-20`;

let test = document.getElementById('test');

let slideIndex = 1;

fetch(movieURL)
    .then(res => res.json())
    .then((data) => {
        let results = data.results;
        // console.log(results);
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
console.log(yearControl.max);
yearControl.value = "2017";
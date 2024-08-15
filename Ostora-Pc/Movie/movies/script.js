const apiKey = '4f599baa15d072c9de346b2816a131b8';
const itemsPerPage = 64; // Number of items to load per request
let currentPage = 1;
let imdbIDs = [];
let allMovies = [];
let displayedMovies = [];
let isFetching = false;

// Get DOM elements
const searchInput = document.getElementById('search-input');
const movieGallery = document.getElementById('movie-gallery');
const genreSelect = document.getElementById('genre');
const releaseYearSelect = document.getElementById('release-year');
const loadMoreButton = document.getElementById('load-more-button');

// Fetch and display movies
function fetchMovies(page) {
    if (isFetching) return;
    isFetching = true;

    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const movieBatch = imdbIDs.slice(start, end);

    const promises = movieBatch.map(imdbID =>
        fetch(`https://api.themoviedb.org/3/find/${imdbID}?api_key=${apiKey}&external_source=imdb_id`)
            .then(response => response.json())
            .then(data => {
                const movie = data.movie_results[0];
                if (movie) {
                    return {
                        posterPath: movie.poster_path,
                        title: movie.title,
                        imdbID: imdbID,
                        genre_ids: movie.genre_ids,
                        release_year: new Date(movie.release_date).getFullYear()
                    };
                }
                return null;
            })
    );

    Promise.all(promises)
        .then(results => {
            results.forEach(movie => {
                if (movie) {
                    allMovies.push(movie); // Store all movies
                }
            });
            applyFilters(); // Apply filters to the entire dataset
            isFetching = false;
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            isFetching = false;
        });
}

function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedGenre = genreSelect.value;
    const selectedYear = releaseYearSelect.value;

    displayedMovies = allMovies.filter(movie => {
        const genreMatch = !selectedGenre || movie.genre_ids.includes(Number(selectedGenre));
        const nameMatch = !searchQuery || movie.title.toLowerCase().includes(searchQuery);
        const yearMatch = !selectedYear || movie.release_year === Number(selectedYear);
        return genreMatch && nameMatch && yearMatch;
    });

    console.log('Displayed Movies:', displayedMovies); // Log filtered movies
    displayMovies(displayedMovies);
}

function displayMovies(movies) {
    movieGallery.innerHTML = ''; // Clear current gallery
    movies.forEach(movie => {
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
        poster.alt = movie.title;
        poster.dataset.imdbId = movie.imdbID;
        poster.loading = 'lazy';
        poster.style.width = '100%';
        poster.style.height = 'auto';
        poster.style.display = 'block';
        poster.style.borderRadius = '8px';
        poster.addEventListener('click', event => {
            const imdbId = event.target.dataset.imdbId;
            window.location.href = `view.html?id=${imdbId}`;
        });

        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.appendChild(poster);
        movieGallery.appendChild(gridItem);
    });
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        currentPage++;
        fetchMovies(currentPage);
    }
}

function initialize() {
    function fetchGenres() {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                data.genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching genres:', error));
    }

    function fetchYears() {
        for (let year = new Date().getFullYear(); year >= 1960; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            releaseYearSelect.appendChild(option);
        }
    }

    fetchGenres();
    fetchYears();

    fetch('imdb_ids.json')
        .then(response => response.json())
        .then(data => {
            imdbIDs = data.imdbIDs;
            fetchMovies(currentPage);
        })
        .catch(error => console.error('Error loading IMDb IDs:', error));

    genreSelect.addEventListener('change', () => {
        currentPage = 1;
        allMovies = [];
        fetchMovies(currentPage);
    });
    releaseYearSelect.addEventListener('change', () => {
        currentPage = 1;
        allMovies = [];
        fetchMovies(currentPage);
    });
    searchInput.addEventListener('input', () => {
        applyFilters(); // Apply filters to the already fetched data
    });

    window.addEventListener('scroll', handleScroll);
}

initialize();

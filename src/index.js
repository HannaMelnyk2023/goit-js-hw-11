import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// 	Your API key: 52609803-933344cf37d0c6144f6fe0bf2
const API_KEY = '52609803-933344cf37d0c6144f6fe0bf2';
const BASE_URL = 'https://pixabay.com/api/';

let searchQuery = '';
let page = 1;
const perPage = 40;

loadMoreBtn.computedStyleMap.display = 'none';

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(evt) {
    evt.preventDefault();
    searchQuery = evt.currentTarget.elements.searchQuery.value.trim('');
    if (searchQuery === '') {
        Notiflix.Notify.warning('Please enter a search term');
        return;
    }

    page = 1;
    gallery.innerHTML = '';
    loadMoreBtn.style.display = 'none';

    await fetchImages();
}

async function onLoadMore() {
    page += 1;
    await fetchImages();
}
// https://pixabay.com/api/?key=52609803-933344cf37d0c6144f6fe0bf2&q=cat&image_type=photo&orientation=horizontal&safesearch=true
async function fetchImages() {
    try {
        const response = await fetch(
            `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // "Sorry, there are no images matching your search query. Please try again."

        const data = await response.json();
        const hits = data.hits;
        const totalHits = data.totalHits;

        if (hits.length === 0 && page === 1) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
        }
        renderGallery(hits);
        // кнопку показує, якщо є response
        if (page * perPage < totalHits) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
            if (page !== 1) {
                Notiflix.Notify.info(
                    "We're sorry, but you've reached the end of search results."
                );
            }
        }
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure('Something went wrong. Please, try again late.');
    }
}
function renderGallery(images) {
    const markup = images
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) =>
                `<div class="photo-card">
            <a href="${largeImageURL}" target = "_blank" rel = "noopener noreferrer">
           
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`
        )
        .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
}


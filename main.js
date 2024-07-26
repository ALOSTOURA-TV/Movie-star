const movieContent = document.querySelector(".movie-content");
const filterBtns = document.querySelectorAll(".filter-btn");


window.addEventListener('DOMContentLoaded' , ()=> {
  displaymenuItem(Movie)
});


filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.currentTarget.dataset.id
    const movieCategory = Movie.filter(function(movieItem){
      if(movieItem.category === category) {
        return movieItem ;
      }  
  })

  if(category === "All") {
    displaymenuItem(Movie)
  } 
  else{
    displaymenuItem(movieCategory)
}

})

});





function displaymenuItem (movieItem) {
  let displayMovie = movieItem.map(function(part) {
    


    return ` <div class="movie-box">
                     <img src= ${part.img} alt=${part.title} class="move-box-img">
                  <div class="box-txt">
                      <h2 class="movie-title">${part.title}</h2>
                      <span class="movie-type">${part.category}</span>
                      <a href=${part.btn} class="watch-btn play-btn">
                          <i class="bx bx-right-arrow"></i>
                      </a>
                  </div>
              </div> 
    
    `
    
  });
  
  displayMovie = displayMovie.join("")
  movieContent.innerHTML = displayMovie ;
  
}







var swiper = new Swiper(".popular-content", {
  sliderPerView:1,
  spaceBetween: 10,
  
  autoplay: {
    delay: 755500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    280:{
      slidesPerView: 1,
      spaceBetween: 10,
    },
    320 :{
      slidesPerView: 2,
      spaceBetween: 10,
    },
    480 :{
      slidesPerView: 2,
      spaceBetween: 10,
    },
    640 :{
      slidesPerView: 3,
      spaceBetween: 10,
    },
    768 :{
      slidesPerView: 3,
      spaceBetween: 15,
    },
    992 :{
      slidesPerView: 4,
      spaceBetween: 20,
    },
  
  }

});






let playBtn = document.querySelector('.play-movie');
let video = document.querySelector('.video-container');
let closeBtn = document.querySelector('.close-btn');
let myVideo = document.querySelector('#myvideo');


playBtn.addEventListener('click', () => {
  video.classList.add('showVideo');
  myVideo.play()

})

closeBtn.addEventListener('click', () => {
  video.classList.remove('showVideo');
  myVideo.pause()
})

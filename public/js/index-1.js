// use strict
let slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slider-item');

const leftControl = document.querySelector('.slider-control--left');
const rightControl = document.querySelector('.slider-control--right');

// slider.style.transform = 'scale(.2)';

//-----STATE---------------------------------------------------------

let sliderState = {
  parent: slider,
  distance: 0,
  direction: 'L',
  leftControl,
  rightControl,
  transition: false,
  offset: 100,
  slides: slides,
  sliderLength: undefined,
  firstClone: slides[0].cloneNode(true),
  lastClone: slides[slides.length - 1].cloneNode(true),
  isDragging: null,
};

//============================================================================

sliderState.firstClone.id = 'first-clone';
sliderState.lastClone.id = 'last-clone';

slider.append(sliderState.firstClone);
slider.prepend(sliderState.lastClone);

sliderState.slides = sliderState.parent.querySelectorAll('.slider-item');
sliderState.sliderLength = sliderState.slides.length;

moveSlides(sliderState);
sliderState.transition = true;

//============================================================================

function moveSlides(state) {
  state.direction === 'R' && state.distance++;
  state.direction === 'L' && state.distance--;

  console.log(state);

  if (state.distance < -state.sliderLength + 1 || state.distance > 0) return;

  monitorSlides(state);

  for (let [i, slide] of state.slides.entries()) {
    if (!slide['id']) slide.id = i;
    const yesTrans = 'transform cubic-bezier(1,0,0,1) 1s';
    const noTrans = 'none';

    const transition = state.transition;
    const allowTransition = () => (slide.style.transition = yesTrans);
    const disallowTransition = () => (slide.style.transition = noTrans);

    (transition && allowTransition()) || disallowTransition();

    slide.style.transform = `translateX(${state.distance * state.offset}%)`;
  }
}

//-------------------------------------------------------------------
// EVENTS
//-------------------------------------------------------------------

sliderState.leftControl.addEventListener('click', () => {
  sliderState.direction = 'L';
  action(sliderState);
});

sliderState.rightControl.addEventListener('click', () => {
  sliderState.direction = 'R';
  action(sliderState);
});

//-------------------------------------------------------------------
// HELPERS
//-------------------------------------------------------------------

function action(state) {
  moveSlides(state);
}
//-------------------------------------------------------------------

function resetSlider(state, newDistance) {
  state.distance = newDistance;
  console.log(newDistance);
  state.direction = 'L';
  state.transition = false;
  moveSlides(state);
  state.transition = true;
}

//-------------------------------------------------------------------

function monitorSlides(state) {
  if (state.slides[Math.abs(state.distance)].id === state.lastClone.id) {
    const last = state.slides[Math.abs(state.distance)];

    const length = -(state.sliderLength - 3);
    last.addEventListener(
      'transitionend',
      () => {
        console.log('at', state.firstClone.id);
        resetSlider(state, length);
      },
      {
        once: true,
      }
    );
  }

  if (state.slides[Math.abs(state.distance)].id === state.firstClone.id) {
    const first = state.firstClone;
    first.addEventListener(
      'transitionend',
      () => {
        console.log('at', state.firstClone.id);
        resetSlider(state, 0);
      },
      {
        once: true,
      }
    );
  }
}

//----------------------  menu-logic ---------------------------

const header = document.querySelector('.header');
const navHeight = header.querySelector('nav').getBoundingClientRect().height;

const sliderBox = document.querySelector('.slider');

sliderBox.style.marginTop = `${navHeight}px`;

const iconBg = document.querySelector('.navigation-icon-bg');
const navIcon = document.querySelector('.navigation-icon');
const navigationBox = document.querySelector('.navigation');

iconBg.addEventListener('click', () => {
  navIcon.classList.toggle('navigation-icon-opened');
  iconBg.classList.toggle('navigation-icon-bg-opened');
  navigationBox.classList.toggle('navigation-opened');
});


const mapBoxToken =
  'pk.eyJ1IjoiaW1laGFwcGVuIiwiYSI6ImNsMDRiY2FjbjBhazIza253dnl0NHB2eGQifQ.dyLCD3knk54JWcKFZeDNiw';

mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  // style: 'mapbox://styles/imehappen/ckvk26izmi2ld15qqbmo497i5', // satelite
  style: 'mapbox://styles/imehappen/cl057lc3e000m14oar6dx6588', // monochromatic
  center: [36.82391043431036, -1.284907040275034], // 
  
  zoom: 14, 
});

// Create a new marker.
const marker = new mapboxgl.Marker({
  color: '#7f1416',
})
  .setLngLat([36.82391043431036, -1.284907040275034])
  .addTo(map);

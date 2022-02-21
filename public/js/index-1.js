// use strict
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slider-item");

// slider.style.transform = "scale(.2)";

const leftControl = document.querySelector(".slider-control--left");
const rightControl = document.querySelector(".slider-control--right");

//-----STATE---------------------------------------------------------

let sliderState = {
  parent: slider,
  distance: 0,
  direction: "L",
  leftControl,
  rightControl,
  transition: false,
  offset: 100,
  slides: slides,
  sliderLength: undefined,
  firstClone: slides[0].cloneNode(true),
  lastClone: slides[slides.length - 1].cloneNode(true),
};

//============================================================================

sliderState.firstClone.id = "first-clone";
sliderState.lastClone.id = "last-clone";

slider.append(sliderState.firstClone);
slider.prepend(sliderState.lastClone);

sliderState.slides = sliderState.parent.querySelectorAll(".slider-item");
sliderState.sliderLength = sliderState.slides.length - 1;

moveSlides(sliderState);
sliderState.transition = true;

//============================================================================

function moveSlides(state) {
  state.direction === "R" && state.distance++;
  state.direction === "L" && state.distance--;
  if (state.distance < -5 || state.distance > 0) return;

  monitorSlides(state);

  for (let [i, slide] of state.slides.entries()) {
    const yesTrans = "transform cubic-bezier(1,0,0,1) 1s";
    const noTrans = "none";

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

sliderState.leftControl.addEventListener("click", () => {
  sliderState.direction = "L";
  action(sliderState);
});

sliderState.rightControl.addEventListener("click", () => {
  sliderState.direction = "R";
  action(sliderState);
});

let slidetime = setInterval(() => {
  sliderState.direction = "L";
  action(sliderState);
}, 6000);

slider.addEventListener("mouseenter", () => clearInterval(slidetime));

slider.addEventListener("mouseleave", () => {
  sliderState.direction === "L"
    ? (sliderState.direction = "R")
    : (sliderState.direction = "L");
  slidetime = setInterval(() => {
    action(sliderState);
  }, 6000);
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
  state.direction = "L";
  state.transition = false;
  moveSlides(state);
  state.transition = true;
}

//-------------------------------------------------------------------

function monitorSlides(state) {
  if (state.slides[Math.abs(state.distance)].id === state.lastClone.id) {
    const last = state.lastClone;
    const length = state.slides.length;

    last.addEventListener(
      "transitionend",
      resetSlider.bind(null, state, -(length - 3)),
      {
        once: true,
      }
    );
  }

  if (state.slides[Math.abs(state.distance)].id === state.firstClone.id) {
    const first = state.firstClone;
    const length = state.slides.length;

    first.addEventListener("transitionend", resetSlider.bind(this, state, 0), {
      once: true,
    });
  }
}

//-------------------------------------------------------------------

const header = document.querySelector(".header");
const sliderBox = document.querySelector(".slider");
const navHeight = header.querySelector("nav").getBoundingClientRect().height;
sliderBox.style.marginTop = `${navHeight}px`;

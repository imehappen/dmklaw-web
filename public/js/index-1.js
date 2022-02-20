// use strict
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slider-item");

slider.style.transform = "scale(.2)";

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
  console.log(state.distance);
  // let distance = Math.abs(state.distance);

  if (state.slides[Math.abs(state.distance)].id === state.firstClone.id) {
    const first = state.firstClone;

    first.addEventListener(
      "transitionend",
      () => {
        console.log(state.firstClone.id);
        state.distance = 0;
        state.direction = "L";
        state.transition = false;
        moveSlides(state);
        state.transition = true;
      },
      { once: true }
    );
  }

  if (state.slides[Math.abs(state.distance)].id === state.lastClone.id) {
    const last = state.lastClone;

    last.addEventListener(
      "transitionend",
      () => {
        console.log(state.lastClone.id);
        state.distance = 0;
        state.direction = "L";
        state.transition = false;
        moveSlides(state);
        state.transition = true;
      },
      { once: true }
    );
  }

  for (let [i, slide] of state.slides.entries()) {
    const yesTrans = "transform cubic-bezier(1,0,0,1) 1s";
    const noTrans = "none";

    if (!slide["id"]) slide.id = i;

    (state.transition && (slide.style.transition = yesTrans)) ||
      (slide.style.transition = noTrans);

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

function action(state) {
  console.log("moving to: ", state.direction);
  moveSlides(state);
}

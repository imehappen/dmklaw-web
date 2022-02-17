// use strict
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slider-item");

// slider.style.transform = "scale(.4)";

const leftControl = document.querySelector(".slider-control--left");
const rightControl = document.querySelector(".slider-control--right");

//-----STATE---------------------------------------------------------

let sliderState = {
  parent: slider,
  distance: 0,
  direction: null,
  leftControl,
  rightControl,
  left: null,
  right: null,
  original: slides,
  edited: null,
  clonedLeft: null,
  clonedRight: null,
  transition: false,
  lastSlide: null,
  firstSlide: null,
  index: 0,
  offset: 100,
  length: null,
};

//-------------------------------------------------------------------
// must provide state direction + state transition on call

const moveSlides = (state) => {
  state.direction === "R" && state.distance++;
  state.direction === "L" && state.distance--;

  for (let [i, slide] of state[state.slidesToMove].entries()) {
    slide.setAttribute("id", i + 1);
    slide.setAttribute("distance", state.distance * state.offset);

    const yesTrans = "transform cubic-bezier(1,0,0,1) 1s";
    const noTrans = "none";

    (state.transition && (slide.style.transition = yesTrans)) ||
      (slide.style.transition = noTrans);

    slide.style.transform = `translateX(${state.distance * state.offset}%)`;
  }
};

//-------------------------------------------------------------------
// must provide position to clone(set cloneLeft/right to true)

const cloneSlide = (state) => {
  state.original = state.parent.querySelectorAll(".slider-item");
  const length = state.original.length - 1;
  const first = state.original[0].cloneNode(true);
  const last = state.original[length].cloneNode(true);

  if (!state.clonedLeft && state.left) {
    state.clonedLeft = true;
    state.parent.append(first);
  }

  if (!state.clonedRight && state.right) {
    state.clonedRight = true;
    state.parent.prepend(last);
  }

  state.edited = state.parent.querySelectorAll(".slider-item");
  state.length = state.edited.length;
  state.lastSlide = state.edited[state.length - 1];
  return state;
};

//-------------------------------------------------------------------
// must set index to be remove in state
const removeNode = (state) => {
  state.slides = state.parent.querySelectorAll(".slider-item");
  state.parent.removeChild(state.edited[state.index]);
};

//-------------------------------------------------------------------
// EVENTS
//-------------------------------------------------------------------

sliderState.leftControl.addEventListener("click", () => {
  action("L");
});

//-------------------------------------------------------------------

sliderState.rightControl.addEventListener("click", () => {
  action("R");
});

//-------------------------------------------------------------------

setInterval(() => {
  action("L");
}, 5000);

//-------------------------------------------------------------------

function action(direction) {
  sliderState.left = true;
  sliderState = cloneSlide(sliderState);

  sliderState.slidesToMove = "edited";

  if (direction === "L") {
    sliderState.direction = "L";
  }
  if (direction === "R") {
    sliderState.direction = "R";
  }

  sliderState.transition = true;
  moveSlides(sliderState);

  if (direction === "L") {
    if (sliderState.distance === -(sliderState.length - 1)) {
      sliderState.lastSlide.addEventListener("transitionend", () => {
        sliderState.index = sliderState.length - 1;
        removeNode(sliderState);
        sliderState.clonedLeft = null;
        sliderState.transition = null;
        sliderState.slidesToMove = "original";
        sliderState.distance = 1;
        moveSlides(sliderState);
      });
    }
  }
  if (direction === "R") {
  }
}

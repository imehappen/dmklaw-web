// use strict
let slider = document.querySelector(".slider");

slider.style.transform = "scale(.4)";

const leftControl = document.querySelector(".slider-control--left");
const rightControl = document.querySelector(".slider-control--right");

let slides;
let x = 1;
let child = 0;

leftControl.onclick = function () {
  slides = slider.querySelectorAll(".slider-item");

  slides.forEach((slide, i) => {
    slide.setAttribute("data-slide-number", i + 1);
    slide.style.transform = `translateX(${x * -100}%)`;
  });

  x++;

  const length = slides.length;

  slider.ontransitionend = () => {
    if (x >= length) {
      slides = slider.querySelectorAll(".slider-item");

      const firstClone = slides[child].cloneNode(true);
      child++;
      slider.append(firstClone);
    }
  };
};

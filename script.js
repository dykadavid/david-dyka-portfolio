const glow = document.querySelector(".cursor-glow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reduceMotion) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      card.classList.toggle("hide", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

const slideshow = document.querySelector("[data-slideshow]");
const slides = slideshow ? Array.from(slideshow.querySelectorAll(".slide")) : [];
const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
const prevSlide = document.querySelector("[data-slide-prev]");
const nextSlide = document.querySelector("[data-slide-next]");
let activeSlide = 0;

const showSlide = (index) => {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
};

prevSlide?.addEventListener("click", () => showSlide(activeSlide - 1));
nextSlide?.addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slideDot)));
});

if (slides.length && !reduceMotion) {
  setInterval(() => showSlide(activeSlide + 1), 5200);
}

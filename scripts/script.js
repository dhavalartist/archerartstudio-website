const toggle = document.querySelector('.aas-menu-toggle');
const menu = document.querySelector('.aas-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.aas-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}


/* Services dropdown — close when clicking outside */
document.addEventListener('click', (event) => {
  document.querySelectorAll('.aas-nav-dropdown[open]').forEach(dropdown => {
    if (!dropdown.contains(event.target)) {
      dropdown.removeAttribute('open');
    }
  });
});


/* Services dropdown — close with Escape */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.aas-nav-dropdown[open]').forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
  }
});


/* Portfolio filters */
const buttons = document.querySelectorAll('.aas-filters button');
const projects = document.querySelectorAll('.aas-project');

buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  const f = btn.dataset.filter;

  projects.forEach(p => {
    p.classList.toggle(
      'is-hidden',
      f !== 'all' && p.dataset.type !== f
    );
  });
}));

/* =========================================================
   2D GAME ART HERO SLIDER
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".aas-2d-slider");

    if (!slider) {
        return;
    }

    const slides = slider.querySelectorAll(".aas-2d-slide");
    const dots = document.querySelectorAll(".aas-2d-slider-dots button");
    const previous = slider.querySelector(".aas-2d-slider-prev");
    const next = slider.querySelector(".aas-2d-slider-next");

    if (!slides.length) {
        return;
    }

    let current = 0;
    let timer;

    let touchStartX = 0;
    let touchEndX = 0;

    function showSlide(index) {

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === current);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === current);
        });
    }

    function startSlider() {

        clearInterval(timer);

        timer = setInterval(function () {
            showSlide(current + 1);
        }, 4500);
    }

    function resetSlider() {

        clearInterval(timer);
        startSlider();
    }

    /* Previous button */

    if (previous) {

        previous.addEventListener("click", function () {
            showSlide(current - 1);
            resetSlider();
        });

    }

    /* Next button */

    if (next) {

        next.addEventListener("click", function () {
            showSlide(current + 1);
            resetSlider();
        });

    }

    /* Dots */

    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {
            showSlide(index);
            resetSlider();
        });

    });

    /* Desktop hover pause */

    slider.addEventListener("mouseenter", function () {
        clearInterval(timer);
    });

    slider.addEventListener("mouseleave", function () {
        startSlider();
    });

    /* =====================================================
       MOBILE SWIPE
       ===================================================== */

    slider.addEventListener("touchstart", function (event) {

        touchStartX = event.changedTouches[0].screenX;
        touchEndX = touchStartX;

        clearInterval(timer);

    }, { passive: true });


    slider.addEventListener("touchmove", function (event) {

        touchEndX = event.changedTouches[0].screenX;

    }, { passive: true });


    slider.addEventListener("touchend", function () {

        const swipeDistance = touchEndX - touchStartX;
        const minimumSwipeDistance = 50;

        if (Math.abs(swipeDistance) >= minimumSwipeDistance) {

            if (swipeDistance < 0) {

                /* Swipe left → next */
                showSlide(current + 1);

            } else {

                /* Swipe right → previous */
                showSlide(current - 1);

            }

        }

        resetSlider();

    }, { passive: true });


    /* Start slider */

    showSlide(0);
    startSlider();

});


document.addEventListener("DOMContentLoaded", function () {
    const processSteps = document.querySelectorAll(
        ".aas-3d-process-step"
    );

    const processImage = document.querySelector(
        "#aas-process-image"
    );

    if (!processSteps.length || !processImage) {
        return;
    }

    const processImages = [
        {
            src: "images/3d_game_art_page/Process/Concept.jpg",
            alt: "3D game art concept development by Archer Art Studio"
        },
        {
            src: "images/3d_game_art_page/Process/3D_Modeling.jpg",
            alt: "3D game asset modeling by Archer Art Studio"
        },
        {
            src: "images/3d_game_art_page/Process/3D_Texturing.jpg",
            alt: "3D game asset texturing by Archer Art Studio"
        },
        {
            src: "images/3d_game_art_page/Process/3D_Rigging.jpg",
            alt: "3D character rigging by Archer Art Studio"
        },
        {
            src: "images/3d_game_art_page/Process/3D_Animation.jpg",
            alt: "3D character animation by Archer Art Studio"
        }
    ];

    let activeIndex = 0;
    let processTimer;
    let isPaused = false;

    function activateStep(index) {
        activeIndex = index;

        processSteps.forEach(function (step, stepIndex) {
            const button = step.querySelector(
                ".aas-3d-process-step-title"
            );

            const content = step.querySelector(
                ".aas-3d-process-step-content"
            );

            const isActive = stepIndex === index;

            step.classList.toggle("is-active", isActive);
            button.setAttribute("aria-expanded", String(isActive));
            content.hidden = !isActive;
        });

        processImage.style.opacity = "0";

        setTimeout(function () {
            processImage.src = processImages[index].src;
            processImage.alt = processImages[index].alt;
            processImage.style.opacity = "1";
        }, 180);
    }

    function startProcessAnimation() {
        clearInterval(processTimer);

        processTimer = setInterval(function () {
            if (!isPaused) {
                const nextIndex =
                    (activeIndex + 1) % processSteps.length;

                activateStep(nextIndex);
            }
        }, 4500);
    }

    processSteps.forEach(function (step, index) {
        const button = step.querySelector(
            ".aas-3d-process-step-title"
        );

        button.addEventListener("click", function () {
            activateStep(index);
            startProcessAnimation();
        });
    });

    const processArea = document.querySelector(
        ".aas-3d-process-section"
    );

    if (processArea) {
        processArea.addEventListener("mouseenter", function () {
            isPaused = true;
        });

        processArea.addEventListener("mouseleave", function () {
            isPaused = false;
        });

        processArea.addEventListener("focusin", function () {
            isPaused = true;
        });

        processArea.addEventListener("focusout", function () {
            isPaused = false;
        });
    }

    activateStep(0);
    startProcessAnimation();
});
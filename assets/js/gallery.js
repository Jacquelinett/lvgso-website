// Drives the gallery's single main photo (#galleryViewer), advancing
// through window.LVGSO_GALLERY. The photo has no forced aspect ratio — it's
// capped by max-width/max-height in CSS and shrink-wraps to its own size,
// so portrait and landscape photos both display uncropped; a landscape
// photo just ends up shorter than a portrait one, since both share the same
// height cap. Prev/next buttons always flank the photo.
//
// Autoplay: a Win95-style segmented progress bar (#galleryProgressFill)
// fills up over AUTOPLAY_MS, then the gallery advances and the bar resets.
// The play/pause button (#galleryPlayPauseBtn) freezes it in place on
// demand. Autoplay also pauses (without touching the button's state) while
// a lightbox is open, resuming after it's closed — unless the user had
// manually paused, which always wins.
//
// The thumbnail filmstrip (#galleryThumbStrip) jumps straight to a given
// photo on click (and opens it in the lightbox via its own data-bs-toggle
// attribute).
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var photos = window.LVGSO_GALLERY || [];
    var viewer = document.getElementById("galleryViewer");
    if (!viewer || photos.length < 2) return;

    var AUTOPLAY_MS = 5000;

    var mainPhoto = viewer.querySelector('[data-slot="main"]');
    var prevBtn = viewer.querySelector(".gallery-nav-prev");
    var nextBtn = viewer.querySelector(".gallery-nav-next");
    var playPauseBtn = document.getElementById("galleryPlayPauseBtn");
    var progressFill = document.getElementById("galleryProgressFill");
    var thumbStrip = document.getElementById("galleryThumbStrip");
    var thumbs = thumbStrip ? thumbStrip.querySelectorAll(".gallery-thumb") : [];

    var centerIndex = photos.length > 2 ? 1 : 0;
    var timerId = null;
    var manuallyPaused = false;
    var modalOpen = false;

    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    function fillSlot(anchor, photo) {
      if (!anchor || !photo) return;
      var img = anchor.querySelector("img");
      img.src = photo.src;
      img.alt = photo.alt;
      anchor.setAttribute("data-bs-target", "#" + photo.modal);
    }

    function updateThumbs() {
      thumbs.forEach(function (thumb) {
        var isActive = Number(thumb.getAttribute("data-index")) === centerIndex;
        thumb.classList.toggle("active", isActive);
      });
    }

    function render() {
      fillSlot(mainPhoto, photos[centerIndex]);
      updateThumbs();
    }

    function resetProgress() {
      if (!progressFill) return;
      progressFill.classList.remove("is-animating");
      progressFill.style.transitionDuration = "";
      progressFill.style.width = "0%";
    }

    function startProgress() {
      if (!progressFill) return;
      resetProgress();
      progressFill.offsetWidth; // force reflow so the reset above commits first
      progressFill.style.transitionDuration = AUTOPLAY_MS + "ms";
      progressFill.classList.add("is-animating");
      progressFill.style.width = "100%";
    }

    function scheduleNext() {
      clearTimeout(timerId);
      if (manuallyPaused || modalOpen) return;
      startProgress();
      timerId = setTimeout(function () {
        goTo(centerIndex + 1);
      }, AUTOPLAY_MS);
    }

    function goTo(index) {
      centerIndex = mod(index, photos.length);
      render();
      scheduleNext();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(centerIndex + 1);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(centerIndex - 1);
      });
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        goTo(Number(thumb.getAttribute("data-index")));
      });
    });

    // Manual pause (via the play/pause button) freezes the bar exactly
    // where it is, rather than resetting it, since the user explicitly
    // asked the slideshow to stop.
    function freezeProgress() {
      if (!progressFill) return;
      var computedWidth = getComputedStyle(progressFill).width;
      progressFill.classList.remove("is-animating");
      progressFill.style.transitionDuration = "";
      progressFill.style.width = computedWidth;
    }

    function setManuallyPaused(isPaused) {
      manuallyPaused = isPaused;
      if (playPauseBtn) {
        playPauseBtn.innerHTML = isPaused ? "&#9654;" : "&#9208;";
        playPauseBtn.setAttribute("aria-label", isPaused ? "Play slideshow" : "Pause slideshow");
      }
      if (isPaused) {
        clearTimeout(timerId);
        freezeProgress();
      } else {
        scheduleNext();
      }
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", function () {
        setManuallyPaused(!manuallyPaused);
      });
    }

    function isGalleryModal(el) {
      return el && el.id && el.id.indexOf("galleryModal-") === 0;
    }

    document.addEventListener("show.bs.modal", function (e) {
      if (!isGalleryModal(e.target)) return;
      modalOpen = true;
      clearTimeout(timerId);
      resetProgress();
    });
    document.addEventListener("hidden.bs.modal", function (e) {
      if (!isGalleryModal(e.target)) return;
      modalOpen = false;
      if (!manuallyPaused) scheduleNext();
    });

    render();
    scheduleNext();
  });
})();

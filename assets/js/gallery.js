// Rotates the gallery's left/center/right slots through window.LVGSO_GALLERY,
// keeping the center slot's larger frame fixed while the photo underneath it
// changes. The two side slots are hidden on mobile via CSS; the prev/next
// buttons still rotate the center photo either way.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var photos = window.LVGSO_GALLERY || [];
    var trio = document.getElementById("galleryTrio");
    if (!trio || photos.length < 2) return;

    var slots = {
      left: trio.querySelector('[data-slot="left"]'),
      center: trio.querySelector('[data-slot="center"]'),
      right: trio.querySelector('[data-slot="right"]'),
    };
    var prevBtn = trio.querySelector(".gallery-nav-prev");
    var nextBtn = trio.querySelector(".gallery-nav-next");

    var centerIndex = photos.length > 2 ? 1 : 0;

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

    function render() {
      var n = photos.length;
      fillSlot(slots.left, photos[mod(centerIndex - 1, n)]);
      fillSlot(slots.center, photos[centerIndex]);
      fillSlot(slots.right, photos[mod(centerIndex + 1, n)]);
    }

    function next() {
      centerIndex = mod(centerIndex + 1, photos.length);
      render();
    }

    function prev() {
      centerIndex = mod(centerIndex - 1, photos.length);
      render();
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    render();
  });
})();

// Builds the tiled backdrop (used behind the Gallery section, and as the
// default hero background on pages with no provided hero photo, e.g.
// Events/Members) out of every sprite in assets/img/characters/players/
// (see window.LVGSO_PLAYER_SPRITES, populated at build time). Composites
// them onto a small canvas in a brick-offset grid — cycling through the
// list via modulo — so the pattern stays full however many sprites exist,
// and drop-in additions just work. Falls back to the static Windows 98 icon
// tile (custom.css) if sprites haven't loaded, there are none, or canvas
// isn't available.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var sprites = window.LVGSO_PLAYER_SPRITES || [];
    var targets = document.querySelectorAll(".win98-icon-pattern");
    if (!targets.length || sprites.length === 0 || !window.HTMLCanvasElement) return;

    var SLOT = 96; // px per grid cell
    var COLS = 4;
    var ROWS = 2;
    var ICON = 44; // rendered sprite size within a cell
    var ROW_SPRITE_SHIFT = 3; // sprites to skip ahead per row, for variety
    var W = SLOT * COLS;
    var H = SLOT * ROWS;

    Promise.all(
      sprites.map(function (src) {
        return new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () {
            resolve(img);
          };
          img.onerror = function () {
            resolve(null);
          };
          img.src = src;
        });
      })
    ).then(function (images) {
      images = images.filter(Boolean);
      if (images.length === 0) return;

      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;

      function drawCentered(img, cx, cy) {
        // Draw plus wrapped copies on either side so sprites straddling the
        // tile edge still tile seamlessly.
        [-W, 0, W].forEach(function (dx) {
          ctx.drawImage(img, cx + dx - ICON / 2, cy - ICON / 2, ICON, ICON);
        });
      }

      for (var row = 0; row < ROWS; row++) {
        var rowOffset = row % 2 === 1 ? SLOT / 2 : 0;
        var cy = SLOT * row + SLOT / 2;
        // Shift which sprite starts each row (rather than reusing one running
        // index) so rows don't just repeat the same left-to-right sequence.
        var rowStart = row * ROW_SPRITE_SHIFT;
        for (var col = 0; col < COLS; col++) {
          var cx = SLOT * col + SLOT / 2 + rowOffset;
          var img = images[(rowStart + col) % images.length];
          drawCentered(img, cx, cy);
        }
      }

      var tileUrl = 'url("' + canvas.toDataURL("image/png") + '")';
      targets.forEach(function (target) {
        target.style.setProperty("--icon-pattern-tile", tileUrl);
      });
    });
  });
})();

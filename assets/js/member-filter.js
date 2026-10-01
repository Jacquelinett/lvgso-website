// Filters the /members/ grid by instrument category. Each card's wrapper
// carries data-categories (space-separated slugs, from _includes/
// member-categories.html); clicking a filter button in #memberFilterBar
// shows only cards whose categories include that slug, or everything for
// "all". Also swaps which #memberInstrumentIcons row is visible, so the
// icon strip above the divider always matches the active filter.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.getElementById("memberFilterBar");
    var grid = document.getElementById("memberGrid");
    if (!bar || !grid) return;

    var buttons = bar.querySelectorAll(".member-filter-btn");
    var items = grid.querySelectorAll(".member-grid-item");
    var iconRows = document.querySelectorAll("#memberInstrumentIcons .instrument-icon-row");

    function applyFilter(filter) {
      items.forEach(function (item) {
        var categories = (item.getAttribute("data-categories") || "").split(/\s+/);
        var show = filter === "all" || categories.indexOf(filter) !== -1;
        item.style.display = show ? "" : "none";
      });
      iconRows.forEach(function (row) {
        row.style.display = row.getAttribute("data-filter") === filter ? "flex" : "none";
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  });
})();

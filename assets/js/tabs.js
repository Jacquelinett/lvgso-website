// Minimal click-to-switch tabs for .win98-tabs groups (supports more than
// one tab group per page).
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".win98-tabs").forEach(function (group) {
      var tabs = group.querySelectorAll(".win98-tab");
      var panels = group.querySelectorAll(".win98-tab-panel");

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = tab.getAttribute("data-tab");

          tabs.forEach(function (t) {
            var isActive = t === tab;
            t.classList.toggle("active", isActive);
            t.setAttribute("aria-selected", isActive ? "true" : "false");
          });

          panels.forEach(function (panel) {
            panel.classList.toggle(
              "active",
              panel.getAttribute("data-panel") === target
            );
          });
        });
      });
    });
  });
})();

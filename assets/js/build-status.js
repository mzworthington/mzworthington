(function () {
  var root = document.querySelector("[data-build-status]");
  if (!root) return;

  var label = root.querySelector("[data-build-status-label]");

  function apply(status) {
    var state = status || "unknown";
    root.dataset.state = state;
    if (!label) return;

    if (state === "PASS") {
      label.textContent = "Build status: All systems operational";
    } else if (state === "FAIL") {
      label.textContent = "Build status: A build needs attention";
    } else if (state === "RUNNING" || state === "WAITING") {
      label.textContent = "Build status: A build is running";
    } else {
      label.textContent = "Build status";
    }
  }

  fetch("https://monitor.mzworthington.co.uk/api/status")
    .then(function (response) {
      if (!response.ok) throw new Error("status");
      return response.json();
    })
    .then(function (data) {
      apply(data && data.status);
    })
    .catch(function () {
      apply("unknown");
    });
})();

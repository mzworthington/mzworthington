export function activeHeadingId(headings, line) {
  var current = null;

  for (var i = 0; i < headings.length; i += 1) {
    if (headings[i].top <= line + 1) current = headings[i].id;
  }

  return current;
}

export function chipScrollDelta(link, list, pad) {
  var inset = pad || 0;

  if (link.left < list.left + inset) return link.left - (list.left + inset);
  if (link.right > list.right - inset) return link.right - (list.right - inset);

  return 0;
}

export function bindSectionNav(doc) {
  var nav = doc.querySelector(".section-nav");
  if (!nav) return;

  var list = nav.querySelector("ul");
  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  var headings = links
    .map(function (link) {
      return doc.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);
  var lastId = null;
  var frame = 0;

  function syncOffset() {
    var header = doc.querySelector(".site-header");
    var headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    var navHeight = Math.ceil(nav.getBoundingClientRect().height);
    doc.documentElement.style.setProperty("--site-header-offset", headerHeight + "px");
    doc.documentElement.style.setProperty(
      "--section-nav-anchor",
      headerHeight + navHeight + 12 + "px",
    );
  }

  function mark(id) {
    links.forEach(function (link) {
      var on = Boolean(id) && link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    if (!id || id === lastId || !list) {
      lastId = id;
      return;
    }

    lastId = id;
    var active = nav.querySelector("a.is-active");
    if (!active) return;

    list.scrollLeft += chipScrollDelta(
      active.getBoundingClientRect(),
      list.getBoundingClientRect(),
      12,
    );
  }

  function syncActive() {
    // Headings come to rest a little below the chips, because of their
    // margin. The line has to include that resting place or the previous
    // section stays marked.
    var anchor = parseFloat(getComputedStyle(doc.documentElement).scrollPaddingTop);
    var line = anchor ? anchor + 16 : nav.getBoundingClientRect().bottom + 24;
    mark(
      activeHeadingId(
        headings.map(function (heading) {
          return { id: heading.id, top: heading.getBoundingClientRect().top };
        }),
        line,
      ),
    );
  }

  function schedule() {
    if (frame) return;
    frame = doc.defaultView.requestAnimationFrame(function () {
      frame = 0;
      syncOffset();
      syncActive();
    });
  }

  function reveal(id) {
    var target = id ? doc.getElementById(id) : null;
    if (target && headings.indexOf(target) !== -1) target.scrollIntoView();
  }

  function revealHash() {
    reveal(doc.defaultView.location.hash.slice(1));
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      var id = link.getAttribute("href").slice(1);
      if (!doc.getElementById(id)) return;
      event.preventDefault();
      if (doc.defaultView.location.hash !== "#" + id) {
        doc.defaultView.history.pushState(null, "", "#" + id);
      }
      syncOffset();
      reveal(id);
    });
  });

  syncOffset();
  syncActive();
  revealHash();
  doc.defaultView.addEventListener("scroll", schedule, { passive: true });
  doc.defaultView.addEventListener("scrollend", syncActive);
  doc.defaultView.addEventListener("resize", schedule);
  doc.defaultView.addEventListener("load", schedule);
  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(function () {
      syncOffset();
      revealHash();
      syncActive();
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindSectionNav(document);
    });
  } else {
    bindSectionNav(document);
  }
}

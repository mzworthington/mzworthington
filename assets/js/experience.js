(function () {
  var experience = document.getElementById("experience");
  if (!experience) return;

  var mobileQuery = window.matchMedia("(max-width: 799px)");
  var syncingFromScroll = false;
  var scrollRaf = null;

  function getJobSections() {
    return experience.querySelectorAll(":scope > section > section[id^='experience-']");
  }

  function getTargetFromHash() {
    var hash = window.location.hash;
    if (!hash) return null;

    var target = document.getElementById(hash.slice(1));
    if (!target || !experience.contains(target)) return null;

    return target;
  }

  function clearActiveStates() {
    experience.querySelectorAll(".is-active").forEach(function (el) {
      el.classList.remove("is-active");
    });
  }

  function markActive(anchor) {
    experience.querySelectorAll('a[href="' + anchor + '"]').forEach(function (link) {
      link.classList.add("is-active");
      var listItem = link.closest("li");
      if (listItem) listItem.classList.add("is-active");
    });
  }

  function getEmploymentStickyOffset() {
    var employmentNav = experience.querySelector(":scope > nav");

    if (employmentNav && mobileQuery.matches) {
      return employmentNav.getBoundingClientRect().bottom + 8;
    }

    return 24;
  }

  function getProjectNavOffset(panel, baseOffset) {
    var offset = baseOffset;
    var projectNav = panel.querySelector(":scope > nav");

    if (!projectNav) return offset;

    var navRect = projectNav.getBoundingClientRect();
    if (navRect.top <= offset + 2) {
      offset = Math.max(offset, navRect.bottom);
    }

    return offset + 8;
  }

  function getFocusedSectionAt(sections, offset) {
    var focused = null;

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset) {
        focused = section;
      }
    });

    return focused;
  }

  function getFocusedJobSection() {
    return getFocusedSectionAt(getJobSections(), getEmploymentStickyOffset());
  }

  function scrollTimelineToActive(panel) {
    var activeItem = panel.querySelector("nav li.is-active");
    var list = panel.querySelector("nav ul");
    if (!activeItem || !list) return;

    var listRect = list.getBoundingClientRect();
    var itemRect = activeItem.getBoundingClientRect();

    if (itemRect.left >= listRect.left && itemRect.right <= listRect.right) {
      return;
    }

    var targetLeft =
      activeItem.offsetLeft - list.clientWidth / 2 + activeItem.clientWidth / 2;

    list.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }

  function scrollToProjectSection(section) {
    var panel = section.closest(".projects-panel");
    var offset = panel
      ? getProjectNavOffset(panel, getEmploymentStickyOffset())
      : getEmploymentStickyOffset();
    var top = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top, behavior: "smooth" });
  }

  function applyActiveState(jobSection, projectSection, panel, options) {
    var scrollTimeline = options && options.scrollTimeline === true;

    clearActiveStates();
    markActive("#" + jobSection.id);

    if (projectSection) {
      markActive("#" + projectSection.id);
      if (scrollTimeline && panel) scrollTimelineToActive(panel);
    }
  }

  function setActiveProject(panel, projectSection, options) {
    var jobSection = panel.closest("section[id^='experience-']");
    var details = jobSection && jobSection.querySelector(":scope > details");

    if (options && options.openDetails && details) {
      details.open = true;
    }

    applyActiveState(jobSection, projectSection, panel, options);
  }

  function getActiveState() {
    var jobLink = experience.querySelector(":scope > nav > ul > li > a.is-active");
    var projectLink = experience.querySelector(".projects-panel > nav a.is-active");

    return {
      jobId: jobLink ? jobLink.getAttribute("href") : null,
      projectId: projectLink ? projectLink.getAttribute("href") : null,
    };
  }

  function updateActiveFromScroll() {
    if (syncingFromScroll) return;

    var jobSection = getFocusedJobSection();
    if (!jobSection) return;

    var details = jobSection.querySelector(":scope > details");
    var panel = jobSection.querySelector(":scope > details .projects-panel");
    var projectSection = null;

    if (panel && details && details.open && panel.querySelector(":scope > nav")) {
      var projectOffset = getProjectNavOffset(panel, getEmploymentStickyOffset());
      projectSection = getFocusedSectionAt(
        panel.querySelectorAll(":scope > section[id]"),
        projectOffset
      );
    }

    var nextJobId = "#" + jobSection.id;
    var nextProjectId = projectSection ? "#" + projectSection.id : null;
    var current = getActiveState();

    if (current.jobId === nextJobId && current.projectId === nextProjectId) {
      if (panel && projectSection) scrollTimelineToActive(panel);
      return;
    }

    applyActiveState(jobSection, projectSection, panel);
    if (panel && projectSection) scrollTimelineToActive(panel);
  }

  function onScroll() {
    if (scrollRaf) return;

    scrollRaf = window.requestAnimationFrame(function () {
      scrollRaf = null;
      updateActiveFromScroll();
    });
  }

  function syncFromHash() {
    clearActiveStates();

    var target = getTargetFromHash();
    if (!target) {
      updateActiveFromScroll();
      return;
    }

    var panel = target.closest(".projects-panel");

    if (panel) {
      setActiveProject(panel, target, { openDetails: true, scrollTimeline: true });
      return;
    }

    if (target.matches("section[id^='experience-']")) {
      markActive("#" + target.id);
    }
  }

  function bindProjectNav(panel) {
    var nav = panel.querySelector(":scope > nav");
    if (!nav) return;

    nav.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#experience-"]');
      if (!link || !nav.contains(link)) return;

      var projectId = link.getAttribute("href").slice(1);
      var projectSection = document.getElementById(projectId);
      if (!projectSection || !panel.contains(projectSection)) return;

      event.preventDefault();
      syncingFromScroll = true;
      history.pushState(null, "", link.getAttribute("href"));
      setActiveProject(panel, projectSection, { openDetails: true, scrollTimeline: true });
      scrollToProjectSection(projectSection);
      window.setTimeout(function () {
        syncingFromScroll = false;
      }, 600);
    });
  }

  function closeAllProjectDetails() {
    experience
      .querySelectorAll(":scope > section > section[id^='experience-'] > details")
      .forEach(function (details) {
        details.open = false;
      });
  }

  function bindDetailsToggle(details) {
    details.addEventListener("toggle", function () {
      window.requestAnimationFrame(updateActiveFromScroll);
    });
  }

  experience.querySelectorAll(".projects-panel").forEach(bindProjectNav);
  experience.querySelectorAll("section[id^='experience-'] > details").forEach(bindDetailsToggle);

  closeAllProjectDetails();
  syncFromHash();
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("scroll", onScroll, { passive: true });
  mobileQuery.addEventListener("change", syncFromHash);
})();

(function () {
  var experience = document.getElementById("experience");
  if (!experience) return;

  var mobileQuery = window.matchMedia("(max-width: 799px)");
  var syncingFromScroll = false;
  var scrollRaf = null;
  var stickyOffsetRaf = null;

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

  function getEmploymentNav() {
    return experience.querySelector(":scope > nav");
  }

  function updateStickyNavOffsets() {
    if (!mobileQuery.matches) {
      experience.style.removeProperty("--employment-sticky-nav-height");
      return;
    }

    var employmentNav = getEmploymentNav();
    if (!employmentNav) return;

    var height = Math.ceil(employmentNav.getBoundingClientRect().height);
    experience.style.setProperty("--employment-sticky-nav-height", height + "px");
  }

  function scheduleStickyNavOffsetUpdate() {
    if (stickyOffsetRaf) return;

    stickyOffsetRaf = window.requestAnimationFrame(function () {
      stickyOffsetRaf = null;
      updateStickyNavOffsets();
    });
  }

  function getEmploymentStickyOffset() {
    var employmentNav = getEmploymentNav();

    if (employmentNav && mobileQuery.matches) {
      return employmentNav.getBoundingClientRect().bottom + 8;
    }

    return 40;
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
    // Slack so a just-scrolled target still wins when sticky offset and
    // scroll position disagree by a few pixels (was marking the entry above).
    var activationLine = offset + 32;

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= activationLine) {
        focused = section;
      }
    });

    return focused || sections[0] || null;
  }

  function getFocusedJobSection() {
    return getFocusedSectionAt(getJobSections(), getEmploymentStickyOffset());
  }

  function scrollToSection(section, offset) {
    var top =
      section.getBoundingClientRect().top + window.scrollY - offset - 2;

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function scrollNavTimelineToActive(nav) {
    if (!nav) return;

    var activeItem = nav.querySelector("ul > li.is-active");
    var list = nav.querySelector("ul");
    if (!activeItem || !list) return;

    var listRect = list.getBoundingClientRect();
    var itemRect = activeItem.getBoundingClientRect();
    var edgePadding = 12;

    if (
      itemRect.left >= listRect.left + edgePadding &&
      itemRect.right <= listRect.right - edgePadding
    ) {
      return;
    }

    var targetLeft =
      activeItem.offsetLeft - list.clientWidth / 2 + activeItem.clientWidth / 2;

    list.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }

  function scrollTimelineToActive(panel) {
    scrollNavTimelineToActive(panel && panel.querySelector(":scope > nav"));
  }

  function scrollToProjectSection(section) {
    var panel = section.closest(".projects-panel");
    var offset = panel
      ? getProjectNavOffset(panel, getEmploymentStickyOffset())
      : getEmploymentStickyOffset();

    scrollToSection(section, offset);
  }

  function scrollToJobSection(section) {
    scrollToSection(section, getEmploymentStickyOffset());
  }

  function withScrollSyncLock(run) {
    syncingFromScroll = true;
    run();
    window.setTimeout(function () {
      syncingFromScroll = false;
      updateActiveFromScroll();
    }, 650);
  }

  function applyActiveState(jobSection, projectSection, panel, options) {
    var scrollTimeline = options && options.scrollTimeline === true;

    clearActiveStates();
    markActive("#" + jobSection.id);

    if (projectSection) {
      markActive("#" + projectSection.id);
      if (scrollTimeline && panel) scrollTimelineToActive(panel);
    }

    if (scrollTimeline) {
      scrollNavTimelineToActive(experience.querySelector(":scope > nav"));
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
      scrollNavTimelineToActive(experience.querySelector(":scope > nav"));
      if (panel && projectSection) scrollTimelineToActive(panel);
      return;
    }

    applyActiveState(jobSection, projectSection, panel, { scrollTimeline: true });
  }

  function onScroll() {
    if (scrollRaf) return;

    scrollRaf = window.requestAnimationFrame(function () {
      scrollRaf = null;
      updateActiveFromScroll();
    });
  }

  function syncFromHash(options) {
    var shouldScroll = options && options.scroll === true;
    clearActiveStates();

    var target = getTargetFromHash();
    if (!target) {
      updateActiveFromScroll();
      return;
    }

    var panel = target.closest(".projects-panel");

    if (panel) {
      setActiveProject(panel, target, { openDetails: true, scrollTimeline: true });
      if (shouldScroll) scrollToProjectSection(target);
      return;
    }

    if (target.matches("section[id^='experience-']")) {
      markActive("#" + target.id);
      scrollNavTimelineToActive(experience.querySelector(":scope > nav"));
      if (shouldScroll) scrollToJobSection(target);
    }
  }

  function bindEmploymentNav() {
    var nav = getEmploymentNav();
    if (!nav) return;

    nav.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#experience-"]');
      if (!link || !nav.contains(link)) return;

      var jobId = link.getAttribute("href").slice(1);
      var jobSection = document.getElementById(jobId);
      if (!jobSection || !experience.contains(jobSection)) return;
      if (jobSection.closest(".projects-panel")) return;

      event.preventDefault();
      withScrollSyncLock(function () {
        history.pushState(null, "", link.getAttribute("href"));
        clearActiveStates();
        markActive("#" + jobSection.id);
        scrollNavTimelineToActive(nav);
        scrollToJobSection(jobSection);
      });
    });
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
      withScrollSyncLock(function () {
        history.pushState(null, "", link.getAttribute("href"));
        setActiveProject(panel, projectSection, {
          openDetails: true,
          scrollTimeline: true,
        });
        scrollToProjectSection(projectSection);
      });
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
      scheduleStickyNavOffsetUpdate();
      window.requestAnimationFrame(updateActiveFromScroll);
    });
  }

  bindEmploymentNav();
  experience.querySelectorAll(".projects-panel").forEach(bindProjectNav);
  experience.querySelectorAll("section[id^='experience-'] > details").forEach(bindDetailsToggle);

  closeAllProjectDetails();
  updateStickyNavOffsets();
  syncFromHash({ scroll: Boolean(window.location.hash) });
  window.addEventListener("hashchange", function () {
    syncFromHash({ scroll: true });
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", scheduleStickyNavOffsetUpdate);
  mobileQuery.addEventListener("change", function () {
    scheduleStickyNavOffsetUpdate();
    syncFromHash();
  });

  if (typeof ResizeObserver !== "undefined") {
    var employmentNav = getEmploymentNav();
    if (employmentNav) {
      new ResizeObserver(scheduleStickyNavOffsetUpdate).observe(employmentNav);
    }
  }
})();

(() => {
  "use strict";

  /* ---------- 1. Fit the hero headline to the page width ---------- */
  const fitTargets = document.querySelectorAll("[data-fit]");

  function fitHeadlines() {
    fitTargets.forEach((el) => {
      const inner = el.firstElementChild;
      if (!inner) return;
      el.style.fontSize = "100px";                      // measure at a known size
      const measured = inner.getBoundingClientRect().width;
      const available = el.clientWidth;
      if (measured > 0 && available > 0) {
        el.style.fontSize = (100 * available / measured * 0.995) + "px";
      }
    });
  }

  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitHeadlines);
  });
  fitHeadlines();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadlines);
  window.addEventListener("load", fitHeadlines);

  /* ---------- 2. Swap the silhouette for a real photo if one exists ---------- */
  const panel = document.getElementById("panel");
  const photo = document.getElementById("portrait-img");

  function showPhoto() {
    photo.hidden = false;
    panel.classList.add("has-photo");
  }
  if (photo) {
    photo.addEventListener("load", showPhoto);
    if (photo.complete && photo.naturalWidth > 0) showPhoto();
  }

  /* ---------- 3. Draggable stickers (mouse and pen; touch keeps scrolling) ---------- */
  let topZ = 10;

  document.querySelectorAll(".stk").forEach((sticker) => {
    let startX = 0, startY = 0;
    let baseX = 0, baseY = 0;
    let curX = 0, curY = 0;
    let dragging = false;

    sticker.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      sticker.setPointerCapture(e.pointerId);
      sticker.classList.add("is-dragging");
      sticker.style.zIndex = ++topZ;
    });

    sticker.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      curX = baseX + e.clientX - startX;
      curY = baseY + e.clientY - startY;
      sticker.style.setProperty("--dx", curX + "px");
      sticker.style.setProperty("--dy", curY + "px");
    });

    const stop = () => {
      if (!dragging) return;
      dragging = false;
      baseX = curX;
      baseY = curY;
      sticker.classList.remove("is-dragging");
    };
    sticker.addEventListener("pointerup", stop);
    sticker.addEventListener("pointercancel", stop);
  });

  /* ---------- 4. Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

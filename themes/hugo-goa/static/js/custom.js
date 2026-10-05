document.addEventListener("DOMContentLoaded", () => {
  if (window.hljs) {
    window.hljs.highlightAll();
  }

  const content = document.querySelector(".content");
  if (!content) return;

  // Wide tables scroll sideways inside their own box instead of breaking the page on phones.
  content.querySelectorAll("table").forEach((table) => {
    if (table.parentElement.classList.contains("table-scroll")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    wrapper.setAttribute("tabindex", "0");
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  // Infographics are too detailed to read inline, so each image links to its full-size file.
  content.querySelectorAll("img").forEach((img) => {
    if (img.closest("a")) return;
    const link = document.createElement("a");
    link.href = img.currentSrc || img.src;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "image-zoom";
    link.setAttribute("aria-label", "Open full-size image" + (img.alt ? ": " + img.alt : ""));
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  });
});

const addItemSelections = document.querySelectorAll(".item");

addItemSelections.forEach((itemSelection) => {
  itemSelection.addEventListener("click", () => {
    const nonselected = itemSelection.querySelector(".non-selected");
    const selected = itemSelection.querySelector(".selected");
    const images = itemSelection.querySelectorAll(".mobile, .tablet, .desktop");
    const addCartbutton = itemSelection.querySelector("button");

    const isActive = itemSelection.classList.contains("active");

    if (!isActive) {
      itemSelection.classList.add("active");

      selected.style.display = "flex";
      nonselected.style.display = "none";

      images.forEach((image) => {
        if (image.style.display != "none") {
          image.style.border = "2px solid hsl(24, 78%, 43%)";
        }
      });
    } else {
      itemSelection.classList.remove("active");

      selected.style.display = "none";
      nonselected.style.display = "flex";

      images.forEach((image) => {
        image.style.border = "none";
      });
    }
  });
});

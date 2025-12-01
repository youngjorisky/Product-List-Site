// --------------------------
// Select DOM Elements
// --------------------------
const itemsContainer = document.querySelector(".items");
const itemsSelectedContainer = document.querySelector(".items-selected");
const totalOrderContainer = document.querySelector(".total-order");
const confirmBtn = document.querySelector(".your-cart .confirmed");
const orderConfirmed = document.querySelector(".order-confirmed");
const overlay = document.querySelector(".overlay");

// --------------------------
// Cart array
// --------------------------
let cart = [];

// --------------------------
// Fetch Items from JSON
// --------------------------
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => displayItems(data))
  .catch((err) => console.error("Failed to load items:", err));

// --------------------------
// Display Items on Page
// --------------------------
function displayItems(items) {
  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    let quantity = 0;

    // Create item div
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    itemDiv.innerHTML = `
      <img class="mobile" src="${item.image.mobile}" />
      <img class="tablet" src="${item.image.tablet}" />
      <img class="desktop" src="${item.image.desktop}" />

      <button class="add-cart">
        <div class="non-selected">
          <img src="./assets/images/icon-add-to-cart.svg" />
          <p>Add to Cart</p>
        </div>
        <div class="selected">
          <div class="circle decrement">
            <img src="./assets/images/icon-decrement-quantity.svg" />
          </div>
          <p class="quantity">${quantity}</p>
          <div class="circle increment">
            <img src="./assets/images/icon-increment-quantity.svg" />
          </div>
        </div>
      </button>

      <p>${item.category}</p>
      <h5>${item.name}</h5>
      <h5>$${item.price.toFixed(2)}</h5>
    `;

    itemsContainer.appendChild(itemDiv);

    const nonSelected = itemDiv.querySelector(".non-selected");
    const selected = itemDiv.querySelector(".selected");
    const images = itemDiv.querySelectorAll(".mobile, .tablet, .desktop");
    const quantityDisplay = itemDiv.querySelector(".quantity");
    const incrementBtn = itemDiv.querySelector(".increment");
    const decrementBtn = itemDiv.querySelector(".decrement");

    // --------------------------
    // Toggle Item Selection
    // --------------------------
    itemDiv.addEventListener("click", (e) => {
      if (e.target.closest(".increment") || e.target.closest(".decrement"))
        return;

      const isActive = itemDiv.classList.contains("active");
      if (!isActive) {
        itemDiv.classList.add("active");
        selected.style.display = "flex";
        nonSelected.style.display = "none";
        images.forEach(
          (img) => (img.style.border = "2px solid hsl(24, 78%, 43%)")
        );
      } else {
        itemDiv.classList.remove("active");
        selected.style.display = "none";
        nonSelected.style.display = "flex";
        images.forEach((img) => (img.style.border = "none"));
        quantity = 0;
        quantityDisplay.textContent = quantity;
        updateCart(item, 0);
      }
    });

    // --------------------------
    // Increment Quantity
    // --------------------------
    incrementBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      quantity++;
      quantityDisplay.textContent = quantity;
      updateCart(item, quantity);
    });

    // --------------------------
    // Decrement Quantity
    // --------------------------
    decrementBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (quantity > 0) {
        quantity--;
        quantityDisplay.textContent = quantity;
        updateCart(item, quantity);
      }
    });
  });
}

renderCart();

// --------------------------
// Update Cart
// --------------------------
function updateCart(item, quantity) {
  if (quantity === 0) {
    cart = cart.filter((c) => c.name !== item.name);
  } else {
    const existingItem = cart.find((c) => c.name === item.name);
    if (existingItem) existingItem.quantity = quantity;
    else
      cart.push({
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.image,
      });
  }
  renderCart();
}

// --------------------------
// Render Cart
// --------------------------
function renderCart() {
  itemsSelectedContainer.innerHTML = "";

  if (cart.length === 0) {
    itemsSelectedContainer.innerHTML = `
      <div class="cake-display">
        <img style="width:60%" src="./assets/images/illustration-empty-cart.svg" />
        <p>Your added items will appear here</p>
      </div>
    `;
    totalOrderContainer.style.display = "none";
    return;
  }

  totalOrderContainer.style.display = "flex";
  let total = 0;

  cart.forEach((cartItem) => {
    const itemTotal = cartItem.price * cartItem.quantity;
    total += itemTotal;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("item-1");
    cartItemDiv.innerHTML = `
      <div class="sub-item">
        <p class="item-name">${cartItem.name}</p>
        <div class="price-tag">
          <p class="number-of-times">${cartItem.quantity}x</p>
          <p class="one-item-price">@$${cartItem.price.toFixed(2)}</p>
          <p class="total-item-price">$${itemTotal.toFixed(2)}</p>
        </div>
      </div>
      <div class="remove-cover">
        <img src="./assets/images/icon-remove-item.svg" />
      </div>
    `;

    itemsSelectedContainer.appendChild(cartItemDiv);

    const line = document.createElement("div");
    line.classList.add("horizontal-line");
    itemsSelectedContainer.appendChild(line);

    // Remove item
    const removeBtn = cartItemDiv.querySelector(".remove-cover");
    removeBtn.addEventListener("click", () => {
      cart = cart.filter((c) => c.name !== cartItem.name);
      renderCart();
    });
  });

  document.querySelector(
    ".total-order .order-1 h3"
  ).textContent = `$${total.toFixed(2)}`;
}

// --------------------------
// Confirm Order Button
// --------------------------
confirmBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  orderConfirmed.style.display = "block";
  overlay.style.display = "block";
  buildOrderConfirmed();
});

// --------------------------
// Build Confirmed Order
// --------------------------
function buildOrderConfirmed() {
  const container = document.querySelector(".order-confirmed .one-family");
  container.innerHTML = "";
  let total = 0;

  cart.forEach((cartItem) => {
    const itemTotal = cartItem.price * cartItem.quantity;
    total += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
      <div class="left-side">
        <img src="${cartItem.image.mobile}" style="width:20px" />
        <div class="sub-item">
          <p class="item-name">${cartItem.name}</p>
          <div class="price-tag">
            <p class="number-of-times">${cartItem.quantity}x</p>
            <p class="one-item-price">@$${cartItem.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <p class="total-item-price">$${itemTotal.toFixed(2)}</p>
    `;
    itemDiv
      .appendChild(document.createElement("div"))
      .classList.add("horizontal-line");
    container.appendChild(itemDiv);
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.margin = "5px auto";
    itemDiv.style.justifyContent = "space-between";
    container.classList.add("yellow-background");
  });

  document.querySelector(".order-confirmed h3").textContent = `$${total.toFixed(
    2
  )}`;
}

// --------------------------
// Close Confirmed Order
// --------------------------
document
  .querySelector(".order-confirmed .confirmed")
  .addEventListener("click", () => {
    orderConfirmed.style.display = "none";
    overlay.style.display = "none";
    cart = [];
    renderCart();

    // RESET ALL ITEMS ON PAGE
    document.querySelectorAll(".item").forEach((itemDiv) => {
      itemDiv.classList.remove("active");

      const nonSelected = itemDiv.querySelector(".non-selected");
      const selected = itemDiv.querySelector(".selected");
      const images = itemDiv.querySelectorAll(".mobile, .tablet, .desktop");
      const quantityDisplay = itemDiv.querySelector(".quantity");

      // Reset UI
      selected.style.display = "none";
      nonSelected.style.display = "flex";
      images.forEach((img) => (img.style.border = "none"));
      quantityDisplay.textContent = 0;
    });
  });

const itemsContainer = document.querySelector(".items");

let cart = [];

// Fetch data from JSON
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    displayItems(data);
  });

// Display products on page
function displayItems(items) {
  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    let quantity = 0;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    itemDiv.innerHTML = `
      <img class="mobile" src="${item.image.mobile}">
      <img class="tablet" src="${item.image.tablet}">
      <img class="desktop" src="${item.image.desktop}">

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

    const nonselected = itemDiv.querySelector(".non-selected");
    const selected = itemDiv.querySelector(".selected");
    const images = itemDiv.querySelectorAll(".mobile, .tablet, .desktop");

    const incrementBtn = itemDiv.querySelector(".increment");
    const decrementBtn = itemDiv.querySelector(".decrement");
    const quantityDisplay = itemDiv.querySelector(".quantity");

    // Select / unselect item
    itemDiv.addEventListener("click", (e) => {
      if (e.target.closest(".increment") || e.target.closest(".decrement"))
        return;

      const isActive = itemDiv.classList.contains("active");

      if (!isActive) {
        itemDiv.classList.add("active");
        selected.style.display = "flex";
        nonselected.style.display = "none";

        images.forEach((image) => {
          if (image.style.display !== "none") {
            image.style.border = "2px solid hsl(24, 78%, 43%)";
          }
        });
      } else {
        itemDiv.classList.remove("active");
        selected.style.display = "none";
        nonselected.style.display = "flex";

        images.forEach((image) => {
          image.style.border = "none";
        });

        quantity = 0;
        quantityDisplay.textContent = 0;
        updateCart(item, 0);
      }
    });

    // Increase quantity
    incrementBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      quantity++;
      quantityDisplay.textContent = quantity;

      updateCart(item, quantity);
    });

    // Decrease quantity
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

// Update Cart Array
function updateCart(item, quantity) {
  if (quantity === 0) {
    cart = cart.filter((cartItem) => cartItem.name !== item.name);
  } else {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.push({
        name: item.name,
        price: item.price,
        quantity: quantity,
      });
    }
  }

  renderCart();
}

// Render Cart UI & Total
function renderCart() {
  const itemsSelectedContainer = document.querySelector(".items-selected");
  const orderTotalText = document.querySelector(".total-order h3");

  itemsSelectedContainer.innerHTML = "";

  if (cart.length === 0) {
    itemsSelectedContainer.innerHTML = `
      <div class="cake-display">
        <img style="width:60%" src="./assets/images/illustration-empty-cart.svg" />
        <p>Your added items will appear here</p>
      </div>
    `;

    orderTotalText.textContent = "$0.00";
    return;
  }

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

    // Remove from cart
    const removeBtn = cartItemDiv.querySelector(".remove-cover");
    removeBtn.addEventListener("click", () => {
      cart = cart.filter((item) => item.name !== cartItem.name);
      renderCart();
    });
  });

  orderTotalText.textContent = `$${total.toFixed(2)}`;
}

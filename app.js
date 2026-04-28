let products = [];
let cart = [];
let total = 0;

function loadProducts(){
  db.collection("products").onSnapshot(snapshot => {
    products = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    render(products);
  });
}

function render(list){
  let box = document.getElementById("products");
  box.innerHTML = "";

  list.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>P${p.price}</p>
        <button onclick="addCart('${p.name}', ${p.price})">Add</button>
      </div>
    `;
  });
}

function addCart(name, price){
  cart.push({name, price});
  total += price;

  document.getElementById("cartCount").innerText = cart.length;
  updateCart();
}

function updateCart(){
  let list = document.getElementById("cartItems");
  list.innerHTML = "";

  cart.forEach(i => {
    list.innerHTML += `<li>${i.name} - P${i.price}</li>`;
  });

  document.getElementById("total").innerText = total;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

function filterCategory(cat){
  if(cat === "all") return render(products);
  render(products.filter(p => p.category === cat));
}

function filterProducts(){
  let v = document.getElementById("search").value.toLowerCase();
  render(products.filter(p => p.name.toLowerCase().includes(v)));
}

function checkout(){
  alert("Stripe integration comes next (real payments)");
}

loadProducts();

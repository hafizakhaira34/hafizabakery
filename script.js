const products=[
{id:1,name:"Croissant Butter",description:"Flaky, buttery & fresh.",price:18000,image:"https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"},
{id:2,name:"Chocolate Bread",description:"Soft bread with chocolate.",price:15000,image:"https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800"},
{id:3,name:"Baguette",description:"Crispy outside, soft inside.",price:22000,image:"https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800"},
{id:4,name:"Cinnamon Roll",description:"Sweet, soft & aromatic.",price:17000,image:"https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=800"},
{id:5,name:"Fresh Bun",description:"Soft bun for every moment.",price:14000,image:"https://images.pexels.com/photos/6602821/pexels-photo-6602821.jpeg?auto=compress&cs=tinysrgb&w=800"}
];

const translations={
id:{navHome:"Home",navMenu:"Menu",navAbout:"Tentang",badge:"FRESHLY BAKED ✦ SETIAP HARI",heroTitle:"Roti hangat,<br><span>mood</span> lebih baik.",heroText:"Nikmati roti fresh dan kreasi bakery pilihan Hafiza. Sederhana, lezat, dan cocok untuk menemani hari kamu.",heroButton:"Lihat Menu →",aboutButton:"Tentang Kami",stat1:"Pilihan Roti",stat2:"Fresh Baked",stat3:"Dibuat Dengan Cinta",freshText:"Dipanggang setiap pagi",eyebrow:"FAVORIT KAMI",menuTitle:"Pilih roti favoritmu.",menuSubtitle:"Freshly baked · Simple · Delicious",recipeTitle:"Bukan cuma bakery.<br>Tempat berbagi rasa.",recipeText:"Temukan inspirasi kue, roti, dan dunia masak-memasak dalam satu tempat.",aboutTitle:"Dari dapur kecil,<br>untuk momen besar.",aboutText:"Hafiza Bakery hadir untuk pecinta roti, kue, dan memasak. Kami percaya makanan sederhana bisa membuat hari terasa lebih spesial.",point1:"Fresh setiap hari",point2:"Bahan pilihan",point3:"Dibuat dengan cinta",cartTitle:"Keranjang",total:"Total",order:"Pesan via WhatsApp",orderHint:"Pesanan akan dibuat otomatis dari isi keranjang.",empty:"Roti tidak ditemukan.",footer:"Freshly baked with love."},
en:{navHome:"Home",navMenu:"Menu",navAbout:"About",badge:"FRESHLY BAKED ✦ EVERY DAY",heroTitle:"Warm bread,<br>a better <span>mood</span>.",heroText:"Enjoy fresh bread and Hafiza's bakery creations. Simple, delicious, and made to brighten your day.",heroButton:"View Menu →",aboutButton:"About Us",stat1:"Bread Choices",stat2:"Fresh Baked",stat3:"Made With Love",freshText:"Baked every morning",eyebrow:"OUR FAVORITES",menuTitle:"Pick your favorite bread.",menuSubtitle:"Freshly baked · Simple · Delicious",recipeTitle:"More than a bakery.<br>A place to share flavor.",recipeText:"Discover cake, bread, and cooking inspiration in one place.",aboutTitle:"From a small kitchen,<br>to big moments.",aboutText:"Hafiza Bakery is made for bread, cake, and cooking lovers. We believe simple food can make an ordinary day feel special.",point1:"Fresh every day",point2:"Selected ingredients",point3:"Made with love",cartTitle:"Shopping Cart",total:"Total",order:"Order via WhatsApp",orderHint:"Your order message will be created automatically.",empty:"No bread found.",footer:"Freshly baked with love."}
};

let cart=JSON.parse(localStorage.getItem("hafizaBakeryCart")||"[]");

function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}

function renderProducts(list=products){
document.querySelector("#productGrid").innerHTML=list.map(p=>`
<article class="product">
<div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">FRESH</span></div>
<div class="product-body"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${rupiah(p.price)}</span><button class="add-btn" onclick="addToCart(${p.id})">+ Add</button></div></div>
</article>`).join("");
document.querySelector("#emptyState").hidden=list.length>0;
}

function saveCart(){localStorage.setItem("hafizaBakeryCart",JSON.stringify(cart));renderCart()}

function addToCart(id){
const item=cart.find(x=>x.id===id);
if(item)item.quantity++;else cart.push({id,quantity:1});
saveCart();openCart();
}

function changeQuantity(id,amount){
const item=cart.find(x=>x.id===id);
if(!item)return;
item.quantity+=amount;
if(item.quantity<=0)cart=cart.filter(x=>x.id!==id);
saveCart();
}

function renderCart(){
document.querySelector("#cartCount").textContent=cart.reduce((s,x)=>s+x.quantity,0);
if(!cart.length)document.querySelector("#cartItems").innerHTML='<div class="cart-empty">Keranjang masih kosong 🥐</div>';
else document.querySelector("#cartItems").innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${rupiah(p.price)}</p><div class="qty"><button onclick="changeQuantity(${p.id},-1)">−</button><b>${x.quantity}</b><button onclick="changeQuantity(${p.id},1)">+</button></div></div></div>`}).join("");
const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+p.price*x.quantity},0);
document.querySelector("#cartTotal").textContent=rupiah(total);
}

function openCart(){document.querySelector("#cartPanel").classList.add("open");document.querySelector("#overlay").classList.add("show")}
function closeCart(){document.querySelector("#cartPanel").classList.remove("open");document.querySelector("#overlay").classList.remove("show")}

function searchProducts(){
const q=document.querySelector("#searchInput").value.toLowerCase().trim();
renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)));
}

function changeLanguage(lang){
const t=translations[lang];
document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(t[key])el.innerHTML=t[key]});
document.querySelector("#searchInput").placeholder=lang==="id"?"Cari roti...":"Search bread...";
}

function orderViaWhatsApp(){
if(!cart.length){alert("Keranjang masih kosong.");return}
let message="Halo kak aku mau pesan:";
cart.forEach(x=>{const p=products.find(y=>y.id===x.id);message+=`\n${x.quantity} ${p.name}`});
const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+p.price*x.quantity},0);
message+=`\n\nTotal: ${rupiah(total)}\n\nTerima kasih kak 😊`;

// GANTI NOMOR INI dengan nomor WhatsApp Hafiza Bakery.
// Format: 628xxxxxxxxxx tanpa tanda + atau spasi.
const phoneNumber="6281234567890";
window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,"_blank");
}

document.querySelector("#cartBtn").addEventListener("click",openCart);
document.querySelector("#closeCart").addEventListener("click",closeCart);
document.querySelector("#overlay").addEventListener("click",closeCart);
document.querySelector("#searchBtn").addEventListener("click",searchProducts);
document.querySelector("#searchInput").addEventListener("input",searchProducts);
document.querySelector("#language").addEventListener("change",e=>changeLanguage(e.target.value));
document.querySelector("#orderBtn").addEventListener("click",orderViaWhatsApp);

renderProducts();
renderCart();
changeLanguage("id");

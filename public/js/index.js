const socket = io();

function sendNewProduct() {

  let newProduct = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    stock: document.getElementById("stock").value,
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
    thumbnails: "./img/monster.jpg"
  };

  socket.emit('newProduct', newProduct);

  document.getElementById("productForm").reset();
}


function deleteProduct(productId) {
  socket.emit('deleteProduct', productId);
}

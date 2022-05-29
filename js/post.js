const pintarPostHTML = document.querySelector("#pintarPost");
const templatePost = document.querySelector("#templatePost").content;

let posts = [];
document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("posts")) {
    posts = JSON.parse(localStorage.getItem("posts"));

    buscarPost();
  }
});

const buscarPost = () => {
  localStorage.setItem("posts", JSON.stringify(posts));
  pintarPostHTML.textContent = "";
  const fragment = document.createDocumentFragment();

  posts.forEach((item) => {
    if (item.irArticulo) {
      const clone = templatePost.cloneNode(true);
      clone.getElementById("nombreArticulo").textContent = item.titulo;
      clone.getElementById("cuerpoArticulo").textContent = item.cuerpo;
      clone.getElementById("catArticulo").textContent = item.categoria;
      clone.getElementById("author").textContent = "Por " + item.user;
      clone.getElementById("imgPost").src = item.imagen;
      fragment.appendChild(clone);
    }
    pintarPostHTML.appendChild(fragment);
  });
  localStorage.setItem("posts", JSON.stringify(posts));
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-dark")) {
    posts.forEach((item) => {
      if (item.irArticulo) {
        item.irArticulo = !item.irArticulo;
      }
      localStorage.setItem("posts", JSON.stringify(posts));
    });
    window.location.href = "/index.html";
  }
});

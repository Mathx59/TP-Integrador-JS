const formulario = document.querySelector("#formulario");
const pintarPostHTML = document.querySelector("#pintarPost");
const pintarSliderHTML = document.querySelector("#pintarSlider");
const templateHome = document.querySelector("#templateHome").content;
const templateSlider = document.querySelector("#templateSlider").content;
const hideSlider = document.querySelector("#slider");
const msjBuscar = document.querySelector("#msjBuscar");
const lastNews = document.querySelector("#lastNews");
const resultados = document.querySelector("#resultados");
const buscar = document.querySelector("#buscar");
const oculta = pintarPostHTML.querySelector("#articulo");
const sliderItem = new bootstrap.Carousel(document.getElementById("slider"), {
  interval: 4000,
  pause: false,
});

let posts = [];
let tempId;

buscar.addEventListener("keyup", (e) => {
  hideSlider.classList.add("d-none");
  lastNews.classList.add("d-none");
  localStorage.setItem("posts", JSON.stringify(posts));
  pintarPostHTML.textContent = "";
  msjBuscar.classList.add("d-none");
  const fragment = document.createDocumentFragment();

  if (e.target.matches("#buscar")) {
    let found = posts.map((item) => {
      msjBuscar.classList.add("d-none");
      resultados.classList.remove("d-none");

      if (item.titulo.toLowerCase().includes(e.target.value.toLowerCase())) {
        const clone = templateHome.cloneNode(true);

        clone.querySelector(".card-title").textContent = item.titulo;
        clone.getElementById("imagenArticulo").src = item.imagen;
        clone.getElementById("catArticulo").textContent = item.categoria;
        clone.querySelector(".card-text").textContent = item.cuerpo;
        clone.querySelector(".btn-outline-secondary").dataset.id = item.id;

        fragment.appendChild(clone);

        pintarPostHTML.insertBefore(fragment, pintarPostHTML.children[0]);
      } else if (!pintarPostHTML.textContent) {
        msjBuscar.classList.remove("d-none");
        resultados.classList.add("d-none");
      }

      if (!e.target.value) {
        hideSlider.classList.remove("d-none");
        lastNews.classList.remove("d-none");
        msjBuscar.classList.add("d-none");
        resultados.classList.add("d-none");
        cargaPosts();
      }
    });
  }
});

const cargaSlider = () => {
  localStorage.setItem("posts", JSON.stringify(posts));

  pintarSliderHTML.textContent = "";
  const fragment = document.createDocumentFragment();

  posts.forEach((item) => {
    if (item.slider) {
      const clone = templateSlider.cloneNode(true);

      clone.getElementById("imagenSlider").src = item.imagen;
      clone.getElementById("tituloSlider").textContent = item.titulo;
      clone.querySelector("#tituloSlider").dataset.id = item.id;

      fragment.appendChild(clone);
    }
  });
  pintarSliderHTML.appendChild(fragment);
};

const cargaPosts = () => {
  localStorage.setItem("posts", JSON.stringify(posts));
  pintarPostHTML.textContent = "";
  const fragment = document.createDocumentFragment();

  posts.forEach((item) => {
    if (!item.slider) {
      const clone = templateHome.cloneNode(true);
      clone.querySelector(".card-title").textContent = item.titulo;
      clone.getElementById("imagenArticulo").src = item.imagen;
      clone.querySelector(".badge").textContent = item.categoria;
      clone.querySelector(".card-text").textContent = item.cuerpo;
      clone.querySelector(".btn-outline-secondary").dataset.id = item.id;
      fragment.appendChild(clone);
      pintarPostHTML.insertBefore(fragment, pintarPostHTML.children[0]);
    }
  });
};

const resetPost = () => {
  posts.forEach((item) => {
    if (item.irArticulo) {
      item.irArticulo = !item.irArticulo;
    }
  });
};

document.addEventListener("click", (e) => {
  if (e.target.matches("#tituloSlider")) {
    tempId = e.target.dataset.id;
    irPost(tempId);
  }
});

const irPost = (tempId) => {
  posts.forEach((item) => {
    if (item.id === tempId) {
      item.irArticulo = true;
    }
  });
  localStorage.setItem("posts", JSON.stringify(posts));
  window.location.href = "/src/post.html";
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-secondary")) {
    tempId = e.target.dataset.id;
    irPost(tempId);
  }
});

const cargaInicial = () => {
  fetch("./db/db.json")
    .then((response) => {
      return response.json();
    })
    .then((dposts) => {
      dposts.forEach((item) => {
        localStorage.setItem("posts", JSON.stringify(dposts));
        posts = JSON.parse(localStorage.getItem("posts"));
        cargaSlider();
        cargaPosts();
      });
    });
};

document.addEventListener("DOMContentLoaded", (e) => {
  if (!localStorage.getItem("login")) {
    localStorage.setItem("login", false);
  }

  if (!localStorage.getItem("posts")) {
    cargaInicial();
    return;
  } else {
    posts = JSON.parse(localStorage.getItem("posts"));
    resetPost();
    cargaSlider();
    cargaPosts();
  }
});

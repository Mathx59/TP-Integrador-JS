const formulario = document.querySelector("#formulario");
const btnModal = document.querySelector("#acceder");
const pintarPostHTML = document.querySelector("#pintarPost");
const templatePost = document.querySelector("#templatePost").content;
const articulo = document.querySelector("#articulo");
const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const buscar = document.querySelector("#buscar");
const imgUrl = document.getElementById("imagen");
const resultados = document.querySelector("#resultados");
const cuerpo = document.getElementById("cuerpo");
const alertTitulo = document.querySelector("#alertTitulo");
const alertImg = document.querySelector("#alertImg");
const alertCuerpo = document.querySelector("#alertCuerpo");
const btnAgregar = document.querySelector("#btnAgregar");
const username = document.getElementById("username");
const msjBuscar = document.querySelector("#msjBuscar");

const modalLogin = new bootstrap.Modal(
  document.getElementById("modalLogin"),
  {}
);

let posts = [];
let found = [];
let sliderSet = false;

const regImgUrl = /(.jpg|.jpeg|.png|.gif)$/i;

const procesarFormulario = (objetoPost) => {
  posts.push(objetoPost);

  cargaPosts();
};

buscar.addEventListener("keyup", (e) => {
  localStorage.setItem("posts", JSON.stringify(posts));
  pintarPostHTML.textContent = "";
  const fragment = document.createDocumentFragment();

  if (e.target.matches("#buscar")) {
    let found = posts.map((item) => {
      resultados.classList.remove("d-none");
      formulario.classList.add("d-none");
      msjBuscar.classList.add("d-none");
      if (item.titulo.toLowerCase().includes(e.target.value.toLowerCase())) {
        const clone = templatePost.cloneNode(true);

        clone.getElementById("nombreArticulo").textContent = item.titulo;
        clone.getElementById("cuerpoArticulo").textContent = item.cuerpo;
        clone.getElementById("catArticulo").textContent = item.categoria;
        clone.getElementById("imagenArticulo").src = item.imagen;
        clone.getElementById("author").textContent = "Autor: " + item.user;
        clone.querySelector(".btn-outline-dark").dataset.id = item.id;

        fragment.appendChild(clone);

        pintarPostHTML.appendChild(fragment);
      } else if (!pintarPostHTML.textContent) {
        msjBuscar.classList.remove("d-none");
        resultados.classList.add("d-none");
      }
      if (!e.target.value) {
        resultados.classList.add("d-none");
        formulario.classList.remove("d-none");
        msjBuscar.classList.add("d-none");
        cargaPosts();
      }
    });
  }
});

const cargaPosts = () => {
  localStorage.setItem("posts", JSON.stringify(posts));
  pintarPostHTML.textContent = "";
  const fragment = document.createDocumentFragment();

  posts.forEach((item) => {
    const clone = templatePost.cloneNode(true);
    clone.getElementById("nombreArticulo").textContent = item.titulo;
    clone.getElementById("cuerpoArticulo").textContent = item.cuerpo;
    clone.getElementById("catArticulo").textContent = item.categoria;
    clone.getElementById("imagenArticulo").src = item.imagen;
    clone.getElementById("author").textContent = "Autor: " + item.user;
    clone.querySelector(".btn-outline-dark").dataset.id = item.id;

    fragment.appendChild(clone);
    pintarPostHTML.insertBefore(fragment, pintarPostHTML.children[0]);
  });

  titulo.value = "";
  cuerpo.value = "";
  imagen.value = "";
  titulo.classList.remove("is-valid");
  cuerpo.classList.remove("is-valid");
  imagen.classList.remove("is-valid");
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".form-check-input")) {
    if (document.querySelector(".form-check-input").value == "on") {
      document.querySelector(".form-check-input").value = "off";
      sliderSet = true;
      console.log(sliderSet);
    } else {
      document.querySelector(".form-check-input").value = "on";
      sliderSet = false;
      console.log(sliderSet);
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-secondary")) {
    localStorage.setItem("login", false);
    localStorage.setItem("user", "");
    window.location.href = "/index.html";
  }
});

const borraPost = () => {
  Swal.fire({
    title: "¿Seguro?",
    text: "Tu articulo se eliminará",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085da",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si ¡Eliminar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let tempId = document.querySelector("#btnBorrar").dataset.id;
      posts = posts.filter((item) => item.id !== tempId);
      cargaPosts();
      Swal.fire("¡Listo!", "El artículo ha sido borrado del sitio.", "success");
    }
  });
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-dark")) {
    let tempId = e.target.dataset.id;
    console.log(tempId);
    borraPost();
  }
});

const cargaInicial = () => {
  console.log("cargamos inicialmente");
  fetch("/db/db.json")
    .then((response) => {
      return response.json();
    })
    .then((dposts) => {
      dposts.forEach((item) => {
        localStorage.setItem("posts", JSON.stringify(dposts));
        posts = JSON.parse(localStorage.getItem("posts"));
        cargaPosts();
        console.log(dposts);
      });
    });
};

document.addEventListener("DOMContentLoaded", (e) => {
  let checkLogin = localStorage.getItem("login");
  console.log(checkLogin);
  if (checkLogin === "false") {
    console.log("no esta logueado");
    console.log(localStorage.getItem("login"));
    modalLogin.show();
  } else {
    userLogin = localStorage.getItem("user");
    document.getElementById("saludo").textContent =
      "¡Bienvenido " + userLogin + "!";
  }

  if (!localStorage.getItem("posts")) {
    posts = JSON.parse(localStorage.getItem("posts"));
    cargaInicial();
  } else {
    posts = JSON.parse(localStorage.getItem("posts"));
    cargaPosts();
  }
});

titulo.addEventListener("keyup", (e) => {
  if (!titulo.value.trim()) {
    alertTitulo.classList.remove("d-none");
    titulo.classList.add("is-invalid");
    btnAgregar.classList.add("disabled");
  } else {
    alertTitulo.classList.add("d-none");
    titulo.classList.remove("is-invalid");
    titulo.classList.add("is-valid");
  }
});
cuerpo.addEventListener("keyup", (e) => {
  if (!cuerpo.value.trim()) {
    alertCuerpo.classList.remove("d-none");
    cuerpo.classList.add("is-invalid");
    btnAgregar.classList.add("disabled");
  } else {
    alertCuerpo.classList.add("d-none");
    cuerpo.classList.remove("is-invalid");
    cuerpo.classList.add("is-valid");
    btnAgregar.classList.remove("disabled");
  }
});
cuerpo.addEventListener("change", (e) => {
  if (!cuerpo.value.trim()) {
    alertCuerpo.classList.remove("d-none");
    cuerpo.classList.add("is-invalid");
    btnAgregar.classList.add("disabled");
  } else {
    alertCuerpo.classList.add("d-none");
    cuerpo.classList.remove("is-invalid");
    cuerpo.classList.add("is-valid");
    btnAgregar.classList.remove("disabled");
  }
});

imgUrl.addEventListener("change", (e) => {
  if (!imgUrl.value.trim() || !regImgUrl.test(imgUrl.value)) {
    imgUrl.classList.add("is-invalid");
    alertImg.classList.remove("d-none");
    btnAgregar.classList.add("disabled");
  } else {
    alertImg.classList.add("d-none");
    imgUrl.classList.remove("is-invalid");
    imgUrl.classList.add("is-valid");
  }
});

btnModal.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(username.value);
  localStorage.setItem("user", username.value);
  userLogin = localStorage.getItem("user");
  localStorage.setItem("login", true);
  document.getElementById("saludo").textContent =
    "¡Bienvenido " + userLogin + "!";
  modalLogin.hide();
  console.log(localStorage.getItem("login"));
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!titulo.value.trim() || !imgUrl.value.trim() || !cuerpo.value.trim()) {
    console.log("Error, uno o más campos vacíos");
    return;
  }
  if (!regImgUrl.test(imgUrl.value)) {
    alertImg.classList.remove("d-none");
    return;
  }

  const indiceCat = categoria.selectedIndex;
  const opcionSeleccionada = categoria.options[indiceCat].text;

  const objetoPost = {
    titulo: titulo.value,
    imagen: imgUrl.value,
    cuerpo: cuerpo.value,
    categoria: opcionSeleccionada,
    user: userLogin,
    irArticulo: false,
    slider: sliderSet,
    id: `${Date.now()}`,
  };
  console.log(objetoPost);
  procesarFormulario(objetoPost);

  let toastElList = [].slice.call(document.querySelectorAll(".toast"));
  let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
  console.log(toastList);
});

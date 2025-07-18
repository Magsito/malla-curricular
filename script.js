const estados = ["pendiente", "desbloqueado", "cursando", "completado"];

// Cargar progreso desde localStorage
function cargarProgreso() {
  const guardado = JSON.parse(localStorage.getItem("progresoMalla") || "{}");
  document.querySelectorAll(".course").forEach(curso => {
    const id = curso.dataset.id;
    if (guardado[id]) {
      curso.dataset.estado = guardado[id];
    }
  });
}

// Guardar progreso actual en localStorage
function guardarProgreso() {
  const progreso = {};
  document.querySelectorAll(".course").forEach(curso => {
    progreso[curso.dataset.id] = curso.dataset.estado;
  });
  localStorage.setItem("progresoMalla", JSON.stringify(progreso));
}

function actualizarDesbloqueos() {
  const cursos = document.querySelectorAll(".course");

  cursos.forEach(curso => {
    const prereq = curso.dataset.prereq;
    if (!prereq) return;

    const requisitos = prereq.split(",");
    const todosCumplidos = requisitos.every(id => {
      const previo = document.querySelector(`.course[data-id="${id}"]`);
      return previo && previo.dataset.estado === "completado";
    });

    // Si se cumplen y el curso está pendiente → desbloquear
    if (todosCumplidos && curso.dataset.estado === "pendiente") {
      curso.dataset.estado = "desbloqueado";
    }

    // Si NO se cumplen y el curso estaba desbloqueado → volver a pendiente
    if (!todosCumplidos && curso.dataset.estado === "desbloqueado") {
      curso.dataset.estado = "pendiente";
    }
  });
}

document.querySelectorAll(".course").forEach(curso => {
  curso.addEventListener("click", () => {
    const actual = estados.indexOf(curso.dataset.estado);
    let siguiente = (actual + 1) % estados.length;
    curso.dataset.estado = estados[siguiente];
    actualizarDesbloqueos();
    guardarProgreso();
  });
});

window.addEventListener("load", () => {
  cargarProgreso();
  actualizarDesbloqueos();
});

function reiniciarMalla() {
  if (confirm("¿Estás seguro de que quieres reiniciar toda la malla?")) {
    localStorage.removeItem("progresoMalla");
    document.querySelectorAll(".course").forEach(curso => {
      curso.dataset.estado = "pendiente";
    });
    actualizarDesbloqueos();
  }
}

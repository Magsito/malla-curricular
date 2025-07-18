document.querySelectorAll(".course").forEach(course => {
  course.addEventListener("click", () => {
    const estados = ["pendiente", "cursando", "completado"];
    let actual = estados.indexOf(course.dataset.estado);
    let siguiente = (actual + 1) % estados.length;
    course.dataset.estado = estados[siguiente];
  });
});

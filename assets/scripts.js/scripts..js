const elemento_titulo = document.getElementById("elemento_titulo");
console.log(elemento_titulo);

const foto_unica_perfil = document.getElementById("foto_unica_perfil");
console.log(foto_unica_perfil);

const teste = document.getElementById("teste");
if(teste) {
    teste.innerHTML = "<h2 style='color: white; text-align: center;'> Sejam Bem Vindos ao Meu Portfólio Pessoal </h2>";
    
    // Remove após 4 segundos
    setTimeout(() => {
        teste.remove();
    }, 4000);
}

elemento_titulo.addEventListener("sclick", () => {
    elemento_titulo.style.color = "#00ff88";
});

const badge = document.querySelector(".status-badge");

badge.addEventListener("mouseover", () => {
    badge.textContent = "Vamos trabalhar juntos?";
    badge.style.backgroundColor = "#2b7509";
});

badge.addEventListener("mouseout", () => {
    badge.textContent = "Available for Projects";
    badge.style.backgroundColor = "";
});

const todosOsLinks = document.querySelectorAll(".links");
let textoOriginal = "";
todosOsLinks.forEach(link => {
    
    link.addEventListener("mouseover", (event) => {
        textoOriginal = event.target.textContent; 
        event.target.textContent = textoOriginal;;
    });

});

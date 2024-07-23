let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay =document.getElementById('overlay-menu')


btnMenu.addEventListener('click',()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')
})


const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const messageTextarea = document.querySelector("#message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Verifica se o nome está vazio
  if (nameInput.value === ""){
    alert("Please, fill in your name ");
    return;
  }

  // Se todos os campos estiverem corretamente preenchido envie o form
  form.submit();

  //Verificar se o e-mail está preenchido e se é válido
  if (emailInput.value === "" || !isEmailValid(emailInput.value)){
    alert("Please, fill in your e-mail");
    return;
  }

  if(phoneInput.value === ""){
    alert("Please, fill in your Phone Number");
    return;
  }

  if(messageTextarea.value === ""){
    alert("Please, leave your message");
    return;
  }

});

//funcao valida e-mail

function isEmailValid(email){

  // Criar um Regex para validar e-mail
  const emailRegex = new RegExp(
    // usuario012@host.com.br
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
  );

  if (emailRegex.test(email)){
    return true;
  }

  return false;
};


window.onscroll = function() {
    const voltarTopo = document.getElementById('voltarTopo');
    if (window.pageYOffset > 100) {
      voltarTopo.style.display = 'block';
    } else {
      voltarTopo.style.display = 'none';
    }
  };
  
  voltarTopo.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

// Lista de e-mails autorizados a acessar o cronograma. Edite aqui para adicionar/remover pessoas.
const ALLOWED_EMAILS = [
  "tarciunifesspa@gmail.com",
  "diana.amorim.edu@gmail.com",
];
const AUTH_LS_KEY = "norte_rios_pdi_auth_v1";

function hasValidLogin(){
  try{
    const a = JSON.parse(localStorage.getItem(AUTH_LS_KEY) || "null");
    return !!(a && a.email);
  }catch(e){ return false; }
}

if(hasValidLogin()){
  location.replace("index.html");
}

const form = document.getElementById("loginForm");
const errBox = document.getElementById("errBox");
const input = document.getElementById("inpEmail");

form.addEventListener("submit", function(e){
  e.preventDefault();
  const email = input.value.trim().toLowerCase();
  const allowed = ALLOWED_EMAILS.map(x=>x.toLowerCase());
  if(email && allowed.includes(email)){
    localStorage.setItem(AUTH_LS_KEY, JSON.stringify({email, ts: Date.now()}));
    location.href = "index.html";
  } else {
    errBox.hidden = false;
    input.focus();
  }
});

input.addEventListener("input", function(){ errBox.hidden = true; });

const AUTH_LS_KEY = "norte_rios_pdi_auth_v1";
try{
  var a = JSON.parse(localStorage.getItem(AUTH_LS_KEY) || "null");
  if(!a || !a.email){ location.replace("login.html"); }
}catch(e){ location.replace("login.html"); }
function logout(){
  localStorage.removeItem(AUTH_LS_KEY);
  location.replace("login.html");
}

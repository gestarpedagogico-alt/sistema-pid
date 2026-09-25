try{
  var a = JSON.parse(localStorage.getItem("norte_rios_pdi_auth_v1") || "null");
  if(!a || !a.email){ location.replace("login.html"); }
}catch(e){ location.replace("login.html"); }

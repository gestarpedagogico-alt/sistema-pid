/* ---------- export / import ---------- */
async function saveOrFallback(filename, text){
  try{
    if(window.claude && typeof window.claude.use === "function"){
      const downloads = await window.claude.use("downloads");
      if(downloads){ await downloads.save({filename, data:text}); return; }
    }
  }catch(e){ console.warn("download falhou", e); }
  document.getElementById("fallbackFilename").textContent = filename;
  document.getElementById("fallbackText").value = text;
  document.getElementById("fallbackModal").classList.add("show");
}
function exportJson(){ saveOrFallback("pdi_cronograma_backup_"+dstr(new Date())+".json", JSON.stringify(state, null, 2)); }
function importJsonFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const imported = JSON.parse(reader.result);
      state = Object.assign(defaultState(), imported);
      ensureDefaults(); saveState(); renderAll();
      alert("Seus dados foram restaurados.");
    }catch(e){ alert("Não foi possível ler este arquivo: "+e.message); }
  };
  reader.readAsText(file);
}
function pad(n){ return String(n).padStart(2,"0"); }
function icsDate(d, hour){ return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(hour)+"0000"; }
function exportIcs(){
  const plan = buildSessionPlan(200);
  const byDate = {};
  plan.forEach(e=>{ (byDate[dstr(e.date)] = byDate[dstr(e.date)]||[]).push(e); });
  let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Norte Rios//PDI//PT-BR\r\n";
  Object.keys(byDate).sort().forEach(k=>{
    const entries = byDate[k];
    const d = entries[0].date;
    const names = entries.map(e=>courseById(e.courseId).nome).join(" + ");
    ics += "BEGIN:VEVENT\r\nUID:"+k+"-pdi@norterios\r\nDTSTART:"+icsDate(d,16)+"\r\nDTEND:"+icsDate(d,18)+"\r\nSUMMARY:Estudo PDI: "+names.replace(/,/g,";")+"\r\nDESCRIPTION:Bloco de estudo do PDI (Norte Rios)\r\nEND:VEVENT\r\n";
  });
  ics += "END:VCALENDAR\r\n";
  saveOrFallback("pdi_agenda.ics", ics);
}

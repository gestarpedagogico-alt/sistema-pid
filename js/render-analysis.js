/* ---------- analysis tab ---------- */
function renderAnalysis(){
  const groups = {};
  allCourses().forEach(c=>{
    const st = state.courses[c.id];
    if(st.status==="concluido" && st.dataConclusao){
      const dt = new Date(st.dataConclusao+"T00:00:00");
      const key = dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0");
      if(!groups[key]) groups[key] = {courses:[], horas:0};
      groups[key].courses.push(c); groups[key].horas += courseCh(c);
    }
  });
  const tbody = document.querySelector("#monthlyAnalysisTable tbody");
  tbody.innerHTML = "";
  const keys = Object.keys(groups).sort();
  document.getElementById("noConcludedNote").style.display = keys.length? "none":"block";
  keys.forEach(k=>{
    const [y,m] = k.split("-");
    const label = MONTH_NAMES[parseInt(m,10)-1].charAt(0).toUpperCase()+MONTH_NAMES[parseInt(m,10)-1].slice(1)+"/"+y;
    const g = groups[k];
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${label}</td><td class="num">${g.courses.length}</td><td class="num">${g.horas}h</td>`;
    tbody.appendChild(tr);
  });
  const eixoDiv = document.getElementById("eixoProgress");
  eixoDiv.innerHTML = "";
  Object.keys(EIXO_NAMES).forEach(k=>{
    const list = allCourses().filter(c=>c.eixo===k);
    if(list.length===0) return;
    const total = list.length;
    const done = list.filter(c=>state.courses[c.id].status==="concluido").length;
    const pct = total? Math.round((done/total)*100):0;
    const row = document.createElement("div");
    row.className = "eixo-progress-row";
    row.innerHTML = `<div class="name">${eixoDot(k)}${EIXO_NAMES[k]}</div>
      <div class="bar-wrap"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${EIXO_COLORS[k]}"></div></div></div>
      <div class="pct">${done}/${total}</div>`;
    eixoDiv.appendChild(row);
  });
  const sessByMonth = {};
  state.sessions.forEach(s=>{
    const dt = new Date(s.date+"T00:00:00");
    const key = dt.getFullYear()+"-"+dt.getMonth();
    sessByMonth[key] = (sessByMonth[key]||0)+s.horas;
  });
  const prDiv = document.getElementById("planReal");
  const allMonthKeys = Object.keys(sessByMonth);
  if(allMonthKeys.length===0){ prDiv.innerHTML = '<div class="small-note">Sem sessões registradas ainda.</div>'; }
  else{
    let html = "<table class='an-table'><thead><tr><th>Mês</th><th>Horas estudadas</th></tr></thead><tbody>";
    allMonthKeys.sort().forEach(k=>{
      const [y,m] = k.split("-").map(Number);
      html += `<tr><td>${MONTH_NAMES[m].charAt(0).toUpperCase()+MONTH_NAMES[m].slice(1)}/${y}</td><td class="num">${sessByMonth[k]}h</td></tr>`;
    });
    html += "</tbody></table>";
    prDiv.innerHTML = html;
  }
}

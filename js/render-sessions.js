/* ---------- sessions tab ---------- */
function populateSessionCourseSelect(){
  const sel = document.getElementById("sessCourse");
  const cur = sel.value;
  sel.innerHTML = "";
  const optGeral = document.createElement("option"); optGeral.value=""; optGeral.textContent="(geral / não vinculado a um curso)";
  sel.appendChild(optGeral);
  state.order.map(id=>courseById(id)).filter(Boolean).forEach(c=>{
    if(state.courses[c.id].status==="concluido") return;
    const opt = document.createElement("option"); opt.value=c.id; opt.textContent = "["+c.eixo+"] "+c.nome;
    sel.appendChild(opt);
  });
  if(cur) sel.value = cur;
}
function nextWedFri(from){
  const d = new Date(from); d.setHours(0,0,0,0);
  while(d.getDay()!==3 && d.getDay()!==5) d.setDate(d.getDate()+1);
  return d;
}
function addSession(){
  const date = document.getElementById("sessDate").value || dstr(nextWedFri(new Date()));
  const courseId = document.getElementById("sessCourse").value;
  const horas = parseFloat(document.getElementById("sessHoras").value) || 0;
  const notas = document.getElementById("sessNotas").value.trim();
  state.sessions.push({id:"S"+Date.now(), date, courseId, horas, notas});
  document.getElementById("sessNotas").value="";
  saveState(); renderAll();
}
function markSkip(){
  const date = document.getElementById("sessDate").value || dstr(nextWedFri(new Date()));
  state.skip[date] = true;
  saveState(); renderAll();
}
function removeSkip(date){ delete state.skip[date]; saveState(); renderAll(); }
function removeSession(id){ state.sessions = state.sessions.filter(s=>s.id!==id); saveState(); renderAll(); }

function renderSessionsTab(){
  const list = document.getElementById("sessionsList");
  const sorted = state.sessions.slice().sort((a,b)=> b.date.localeCompare(a.date));
  if(sorted.length===0){ list.innerHTML = '<div class="small-note">Nenhuma sessão registrada ainda.</div>'; }
  else{
    list.innerHTML = "";
    sorted.slice(0,60).forEach(s=>{
      const c = s.courseId ? courseById(s.courseId) : null;
      const div = document.createElement("div");
      div.className = "session-item";
      div.innerHTML = `<div>📅 <strong>${fmtBR(new Date(s.date+"T00:00:00"))}</strong>: ${s.horas}h ${c?("· "+c.nome):"· (geral)"} ${s.notas?("<br><span class='small-note'>"+s.notas+"</span>"):""}</div>
                        <button class="iconbtn" data-id="${s.id}">🗑️</button>`;
      div.querySelector("button").addEventListener("click", ()=>removeSession(s.id));
      list.appendChild(div);
    });
  }
  const skipDates = Object.keys(state.skip).sort();
  const skipDiv = document.getElementById("skipList");
  document.getElementById("skipEmptyNote").style.display = skipDates.length? "none":"block";
  skipDiv.innerHTML = "";
  skipDates.forEach(d=>{
    const row = document.createElement("div");
    row.className = "skip-list-item";
    row.innerHTML = `<span>${fmtBR(new Date(d+"T00:00:00"))}</span><button class="iconbtn" data-d="${d}">remover</button>`;
    row.querySelector("button").addEventListener("click", ()=>removeSkip(d));
    skipDiv.appendChild(row);
  });
  renderStreaksAndHeatmap();
}
function renderStreaksAndHeatmap(){
  const today = new Date(); today.setHours(0,0,0,0);
  const sessByDate = {};
  state.sessions.forEach(s=>{ sessByDate[s.date] = (sessByDate[s.date]||0) + s.horas; });
  const expected = [];
  let d = new Date(START_DATE);
  while(d <= today){
    if((d.getDay()===3||d.getDay()===5) && !state.skip[dstr(d)]) expected.push(dstr(d));
    d.setDate(d.getDate()+1);
  }
  let best=0, run=0;
  expected.forEach(k=>{ if(sessByDate[k]>0){ run++; best=Math.max(best,run);} else run=0; });
  let current=0;
  for(let i=expected.length-1;i>=0;i--){ if(sessByDate[expected[i]]>0) current++; else break; }
  document.getElementById("streakCurrent").textContent = current;
  document.getElementById("streakBest").textContent = best;
  document.getElementById("totalSessions").textContent = state.sessions.length;
  const totalHoras = state.sessions.reduce((s,x)=>s+x.horas,0);
  document.getElementById("totalHorasLogadas").textContent = totalHoras+"h";
  const last40 = expected.slice(-40);
  const heat = document.getElementById("heatmap");
  heat.innerHTML = "";
  last40.forEach(k=>{
    const cell = document.createElement("div");
    const h = sessByDate[k]||0;
    let cls = "heat-cell";
    if(h>=3) cls+=" heat-4"; else if(h>=2) cls+=" heat-3"; else if(h>=1) cls+=" heat-2"; else if(h>0) cls+=" heat-1";
    cell.className = cls;
    cell.title = fmtBR(new Date(k+"T00:00:00"))+": "+h+"h";
    heat.appendChild(cell);
  });
}

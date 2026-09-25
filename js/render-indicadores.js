/* ---------- indicadores por eixo ---------- */
function renderIndicadores(){
  const grid = document.getElementById('indicadoresGrid');
  grid.innerHTML = '';
  const sessHorasByEixo = {};
  state.sessions.forEach(s=>{
    if(!s.courseId) return;
    const c = courseById(s.courseId);
    if(!c) return;
    sessHorasByEixo[c.eixo] = (sessHorasByEixo[c.eixo]||0) + s.horas;
  });
  const today = new Date();
  const monthsSinceStart = Math.max(1, (today.getFullYear()-START_DATE.getFullYear())*12 + (today.getMonth()-START_DATE.getMonth()) + 1);

  Object.keys(EIXO_NAMES).forEach(k=>{
    const list = allCourses().filter(c=>c.eixo===k);
    if(list.length===0) return;
    const total = list.length;
    const doneList = list.filter(c=>state.courses[c.id].status==='concluido');
    const andamentoList = list.filter(c=>state.courses[c.id].status==='andamento');
    const pendenteList = list.filter(c=>state.courses[c.id].status==='pendente');
    const totalHoras = list.reduce((s,c)=>s+courseCh(c),0);
    const doneHoras = doneList.reduce((s,c)=>s+courseCh(c),0);
    const pct = totalHoras? Math.round((doneHoras/totalHoras)*100):0;
    const horasReais = sessHorasByEixo[k]||0;
    const ritmo = horasReais>0 ? (horasReais/monthsSinceStart).toFixed(1) : null;
    const card = document.createElement('div');
    card.className = 'ind-card';
    card.style.borderLeftColor = EIXO_COLORS[k]||'#999';
    card.innerHTML = `
      <h4>${eixoDot(k)}${EIXO_NAMES[k]}</h4>
      <div class="progress-bar" style="margin-bottom:8px;"><div class="progress-fill" style="width:${pct}%; background:${EIXO_COLORS[k]}"></div></div>
      <div class="ind-row"><span>Cursos concluídos</span><b>${doneList.length}/${total}</b></div>
      <div class="ind-row"><span>Horas concluídas</span><b>${doneHoras}h / ${totalHoras}h</b></div>
      <div class="ind-row"><span>Em andamento</span><b>${andamentoList.length}</b></div>
      <div class="ind-row"><span>Pendentes</span><b>${pendenteList.length}</b></div>
      <div class="ind-pace">${ritmo? ('Ritmo real: ~'+ritmo+'h/mês neste eixo') : 'Ainda sem sessões registradas neste eixo'}</div>
    `;
    grid.appendChild(card);
  });

  const certDiv = document.getElementById('certList');
  const withCert = allCourses().filter(c=> (state.courses[c.id].cert||"").trim());
  document.getElementById('certEmptyNote').style.display = withCert.length? 'none':'block';
  certDiv.innerHTML = '';
  withCert.forEach(c=>{
    const st = state.courses[c.id];
    const row = document.createElement('div');
    row.className = 'session-item';
    row.innerHTML = `<div>${eixoDot(c.eixo)}<strong>${c.nome}</strong> ${st.dataConclusao? ('· concluído em '+fmtBR(new Date(st.dataConclusao+"T00:00:00"))) : ''}<br><span class="small-note">${st.cert}</span></div>`;
    certDiv.appendChild(row);
  });
}

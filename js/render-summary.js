/* ---------- summary ---------- */
function totalStats(){
  let totalHoras=0, includedCount=0, doneHoras=0, doneCount=0;
  allCourses().forEach(c=>{
    const st = state.courses[c.id];
    if(!st || !st.incluido) return;
    includedCount++;
    totalHoras += courseCh(c);
    if(st.status==="concluido"){ doneHoras += courseCh(c); doneCount++; }
  });
  return {totalHoras, includedCount, doneHoras, doneCount};
}
function renderSummary(){
  const st = totalStats();
  const pendingHoras = st.totalHoras - st.doneHoras;
  const weeks = Math.ceil(pendingHoras/4);
  const months = Math.ceil(weeks/4.345);
  const plan = buildSessionPlan(400);
  let endLabel = "concluído!";
  if(plan.length){
    const last = plan[plan.length-1].date;
    endLabel = MONTH_NAMES[last.getMonth()].slice(0,3)+"/"+last.getFullYear();
  }
  document.getElementById("summaryGrid").innerHTML = `
    <div class="stat"><div class="num">4h</div><div class="lbl">disponíveis por semana (qua+sex)</div></div>
    <div class="stat"><div class="num">${st.doneCount}/${st.includedCount}</div><div class="lbl">cursos concluídos / incluídos</div></div>
    <div class="stat"><div class="num">${pendingHoras}h</div><div class="lbl">horas pendentes (estimativa)</div></div>
    <div class="stat"><div class="num">${endLabel}</div><div class="lbl">previsão de conclusão do plano</div></div>
  `;
  document.getElementById("summaryNote").innerHTML =
    `${st.includedCount} cursos incluídos somam ~<strong>${st.totalHoras}h</strong> (parte confirmada, parte estimada em 8h). No ritmo de 4h/semana isso equivale a ~<strong>${months} meses</strong>, alternando entre os eixos.
     Desmarque "incluir" em cursos de menor prioridade na aba Cursos para enxugar o prazo.`;
  const pct = st.totalHoras? Math.round((st.doneHoras/st.totalHoras)*100) : 0;
  document.getElementById("progressRing").style.setProperty("--pct", pct);
  document.getElementById("progressRingLabel").textContent = pct+"%";

  const nextBox = document.getElementById("nextSessionBox");
  if(plan.length===0){ nextBox.innerHTML = "🎉 Nenhuma sessão pendente: todos os cursos incluídos estão concluídos."; return; }
  const upcoming = [];
  const seenDates = new Set();
  for(const e of plan){
    if(!seenDates.has(dstr(e.date))){
      seenDates.add(dstr(e.date));
      const c = courseById(e.courseId);
      upcoming.push({date:e.date, nome:c.nome});
      if(upcoming.length>=3) break;
    }
  }
  nextBox.innerHTML = "📌 <b>Próximas sessões:</b> " + upcoming.map(u=>fmtBR(u.date)+": "+u.nome).join(" &nbsp;|&nbsp; ");
}

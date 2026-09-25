/* ---------- schedule tab ---------- */
function renderSchedule(){
  const container = document.getElementById("scheduleContainer");
  const plan = buildSessionPlan(400);
  if(plan.length===0){ container.innerHTML = `<div class="card">🎉 Todos os cursos incluídos já estão concluídos!</div>`; return; }
  const months = groupPlanByMonth(plan);
  const byYear = {};
  months.forEach(mo=>{ (byYear[mo.year]=byYear[mo.year]||[]).push(mo); });
  const today = new Date();
  let html = "";
  Object.keys(byYear).sort().forEach((year,yi)=>{
    html += `<details class="year-block" ${yi===0?"open":""}><summary>${year}</summary>`;
    byYear[year].forEach(mo=>{
      const isCurrent = (mo.year===today.getFullYear() && mo.month===today.getMonth());
      const metaConcluir = mo.allocations.filter(a=>a.completes).length;
      const cap = monthCapacity(mo.year, mo.month);
      html += `<div class="month-card ${isCurrent?'current':''}">
        <div class="month-head">
          <h4>${MONTH_NAMES[mo.month].charAt(0).toUpperCase()+MONTH_NAMES[mo.month].slice(1)} ${isCurrent?'· <span class="badge alt">mês atual</span>':''}</h4>
          <div><span class="badge">${cap}h disponíveis</span> <span class="badge alt">meta: ${metaConcluir} curso${metaConcluir===1?'':'s'}</span></div>
        </div>`;
      const byCourse = {}; const orderSeen = [];
      mo.allocations.forEach(a=>{ if(!byCourse[a.courseId]){byCourse[a.courseId]=[]; orderSeen.push(a.courseId);} byCourse[a.courseId].push(a); });
      orderSeen.forEach(cid=>{
        const c = courseById(cid);
        const entries = byCourse[cid];
        const hoursThisMonth = entries.reduce((s,e)=>s+e.hours,0);
        const completesHere = entries.some(e=>e.completes);
        const ch = courseCh(c);
        const already = state.courses[cid].status === "concluido";
        html += `<div class="course-line">
          <div class="name"><span class="eixo-tag">${eixoDot(c.eixo)}${c.eixo}</span> ${c.nome}
            <div class="progress-bar"><div class="progress-fill" style="width:${completesHere?100:Math.round((hoursThisMonth/ch)*100)}%"></div></div>
          </div>
          <div style="white-space:nowrap; display:flex; align-items:center; gap:6px;">
            ${hoursThisMonth}h ${completesHere?" · <strong>conclui</strong>":" · continua"}
            <button class="complete-btn" data-quickdone-schedule="${cid}" ${already?"disabled":""}>${already?"✓":"concluir"}</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `</details>`;
  });
  container.innerHTML = html;
  container.querySelectorAll('[data-quickdone-schedule]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const cid = btn.getAttribute('data-quickdone-schedule');
      const c = courseById(cid);
      const st = state.courses[cid];
      st.status = "concluido";
      if(!st.dataConclusao) st.dataConclusao = dstr(new Date());
      saveState(); renderAll();
      showToast("🎉 \""+c.nome+"\" concluído!");
    });
  });
}

/* ---------- courses tab (card based, draggable, always-editable) ---------- */
function populateEixoSelects(){
  const sel = document.getElementById("filterEixo");
  sel.querySelectorAll("option:not(:first-child)").forEach(o=>o.remove());
  Object.keys(EIXO_NAMES).forEach(k=>{
    if(k==="CUSTOM") return;
    const opt = document.createElement("option"); opt.value=k; opt.textContent=EIXO_NAMES[k]; sel.appendChild(opt);
  });
  const sel2 = document.getElementById("newCourseEixo");
  sel2.innerHTML = "";
  Object.keys(EIXO_NAMES).forEach(k=>{
    const opt = document.createElement("option"); opt.value=k; opt.textContent=EIXO_NAMES[k]; sel2.appendChild(opt);
  });
}
function renderCoursesCards(){
  const eixoF = document.getElementById("filterEixo").value;
  const statusF = document.getElementById("filterStatus").value;
  const searchF = document.getElementById("searchCourse").value.trim().toLowerCase();
  let list = state.order.map(id=>courseById(id)).filter(Boolean);
  if(eixoF) list = list.filter(c=>c.eixo===eixoF);
  if(statusF) list = list.filter(c=>state.courses[c.id].status===statusF);
  if(searchF) list = list.filter(c=> (c.nome+" "+c.inst).toLowerCase().includes(searchF));

  const container = document.getElementById("coursesCards");
  container.innerHTML = "";
  list.forEach(c=>{
    const st = state.courses[c.id];
    const ch = courseCh(c);
    const card = document.createElement("div");
    card.className = "course-card" + (st.status==="concluido" ? " card-done" : "");
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="course-card-head">
        <span class="drag-handle" title="arraste para reordenar">☰</span>
        <input type="checkbox" data-role="incluido" ${st.incluido?"checked":""} title="incluir no cronograma">
        <span class="eixo-tag">${eixoDot(c.eixo)}${c.eixo}</span>
        <span class="course-name">${c.nome}</span>
        <input type="number" class="ch-input" data-role="ch" value="${ch}" min="1" title="carga horária (editável)">h
        <button class="complete-btn" data-act="quickdone" ${st.status==="concluido"?"disabled":""}>${st.status==="concluido"?"✓ concluído":"✅ concluir"}</button>
        ${c.eixo==="CUSTOM"?'<button class="iconbtn" data-act="del">🗑️</button>':""}
      </div>
      <div class="inst-line">${c.inst}${c.ch==null?" · carga horária estimada":""}</div>
      <div class="course-card-body">
        <div>
          <label>Status</label>
          <select data-role="status" class="status-select ${st.status==='concluido'?'st-concluido':''}">
            <option value="pendente" ${st.status==="pendente"?"selected":""}>Pendente</option>
            <option value="andamento" ${st.status==="andamento"?"selected":""}>Em andamento</option>
            <option value="concluido" ${st.status==="concluido"?"selected":""}>Concluído</option>
          </select>
        </div>
        <div>
          <label>Concluído em</label>
          <input type="date" data-role="data" value="${st.dataConclusao||""}" ${st.status!=="concluido"?"disabled":""}>
        </div>
        <div style="grid-column:span 2;">
          <label>Certificado (link ou nota)</label>
          <input type="text" data-role="cert" placeholder="cole aqui o link do certificado" value="${(st.cert||"").replace(/"/g,'&quot;')}">
        </div>
        <div style="grid-column:1/-1;">
          <label>Notas</label>
          <textarea data-role="notas" placeholder="anotações sobre este curso...">${st.notas||""}</textarea>
        </div>
      </div>
    `;
    card.querySelector('[data-role=incluido]').addEventListener("change", e=>{ st.incluido=e.target.checked; saveState(); renderAll(); });
    card.querySelector('[data-role=ch]').addEventListener("change", e=>{
      const v = parseFloat(e.target.value); st.chOverride = isNaN(v)?null:v; saveState(); renderAll();
    });
    card.querySelector('[data-role=status]').addEventListener("change", e=>{
      st.status = e.target.value;
      if(st.status==="concluido"){
        if(!st.dataConclusao) st.dataConclusao = dstr(new Date());
        showToast("🎉 \""+c.nome+"\" concluído!");
      }
      saveState(); renderAll();
    });
    card.querySelector('[data-role=data]').addEventListener("change", e=>{ st.dataConclusao=e.target.value; saveState(); renderAnalysis(); });
    card.querySelector('[data-role=cert]').addEventListener("input", e=>{ st.cert=e.target.value; saveState(); });
    card.querySelector('[data-role=notas]').addEventListener("input", e=>{ st.notas=e.target.value; saveState(); });
    card.querySelector('[data-act=quickdone]').addEventListener("click", ()=>{
      st.status = "concluido";
      if(!st.dataConclusao) st.dataConclusao = dstr(new Date());
      saveState(); renderAll();
      showToast("🎉 \""+c.nome+"\" concluído!");
    });
    const delBtn = card.querySelector('[data-act=del]');
    if(delBtn) delBtn.addEventListener("click", ()=>{
      state.custom = state.custom.filter(cc=>cc.id!==c.id);
      delete state.courses[c.id];
      state.order = state.order.filter(id=>id!==c.id);
      saveState(); renderAll();
    });

    card.addEventListener("dragstart", e=>e.preventDefault()); // fallback native DnD disabled; pointer-based below
    card.querySelector(".drag-handle").addEventListener("pointerdown", e=>startDrag(e, card));
    container.appendChild(card);
  });
  populateSessionCourseSelect();
}
function addCustomCourse(){
  const nome = document.getElementById("newCourseNome").value.trim();
  const inst = document.getElementById("newCourseInst").value.trim() || "Não informada";
  const eixo = document.getElementById("newCourseEixo").value;
  const chv = parseFloat(document.getElementById("newCourseCh").value);
  if(!nome){ alert("Digite o nome do curso."); return; }
  const id = "CUSTOM_"+Date.now();
  state.custom.push({id, eixo:eixo||"CUSTOM", nome, inst, ch: isNaN(chv)?null:chv});
  state.courses[id] = {incluido:true, status:"pendente", dataConclusao:"", cert:"", notas:"", chOverride:null};
  state.order.push(id);
  document.getElementById("newCourseNome").value="";
  document.getElementById("newCourseInst").value="";
  document.getElementById("newCourseCh").value="";
  saveState(); renderAll();
}

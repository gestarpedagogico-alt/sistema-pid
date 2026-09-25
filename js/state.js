/* ---------- state: single source of truth, persisted to localStorage ---------- */
function defaultState(){
  const st = {courses:{}, custom:[], order:[], sessions:[], skip:{}};
  BASE_COURSES.forEach(c=>{
    st.courses[c.id] = {incluido:true, status:"pendente", dataConclusao:"", cert:"", notas:"", chOverride:null};
    st.order.push(c.id);
  });
  return st;
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return Object.assign(defaultState(), JSON.parse(raw));
    const oldRaw = localStorage.getItem("norte_rios_pdi_cronograma_v2");
    if(oldRaw) return Object.assign(defaultState(), JSON.parse(oldRaw));
  }catch(e){ console.warn("storage indisponível", e); }
  return defaultState();
}
let state = loadState();

function ensureDefaults(){
  const all = allCourses();
  all.forEach(c=>{
    if(!state.courses[c.id]) state.courses[c.id] = {incluido:true, status:"pendente", dataConclusao:"", cert:"", notas:"", chOverride:null};
    if(!state.order.includes(c.id)) state.order.push(c.id);
  });
  const validIds = new Set(all.map(c=>c.id));
  state.order = state.order.filter(id=>validIds.has(id));
}
function allCourses(){ return BASE_COURSES.concat(state.custom); }
function courseById(id){ return allCourses().find(c=>c.id===id); }
function courseCh(c){
  const st = state.courses[c.id];
  if(st && st.chOverride != null) return st.chOverride;
  return c.ch == null ? ESTIMATED_CH : c.ch;
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); flashSaved(); }
  catch(e){ console.warn("não foi possível salvar", e); }
}
function flashSaved(){
  const el = document.getElementById("savedFlag");
  el.classList.add("show");
  clearTimeout(flashSaved._t);
  flashSaved._t = setTimeout(()=>el.classList.remove("show"), 1400);
}
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove("show"), 2400);
}
function dstr(d){ return d.toISOString().slice(0,10); }
function fmtBR(d){ return d.toLocaleDateString("pt-BR"); }

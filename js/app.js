/* ---------- wiring ---------- */
function renderAll(){
  ensureDefaults();
  renderSummary();
  renderSchedule();
  renderCoursesCards();
  renderSessionsTab();
  renderIndicadores();
  renderAnalysis();
}
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
  });
});
["filterEixo","filterStatus"].forEach(id=>document.getElementById(id).addEventListener("change", renderCoursesCards));
document.getElementById("searchCourse").addEventListener("input", renderCoursesCards);
document.getElementById("btnAddCourse").addEventListener("click", addCustomCourse);
document.getElementById("btnAddSession").addEventListener("click", addSession);
document.getElementById("btnMarkSkip").addEventListener("click", markSkip);
document.getElementById("btnExportJson").addEventListener("click", exportJson);
document.getElementById("btnExportIcs").addEventListener("click", exportIcs);
document.getElementById("btnPrint").addEventListener("click", ()=>window.print());
document.getElementById("btnImportJson").addEventListener("click", ()=>document.getElementById("fileImport").click());
document.getElementById("fileImport").addEventListener("change", e=>{ if(e.target.files[0]) importJsonFile(e.target.files[0]); });
document.getElementById("toolsToggle").addEventListener("click", ()=>document.getElementById("toolsPanel").classList.toggle("show"));
document.getElementById("sessDate").value = dstr(nextWedFri(new Date()));

populateEixoSelects();
renderAll();

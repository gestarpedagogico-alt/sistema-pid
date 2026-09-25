/* ---------- pointer-based drag reordering: works with mouse, touch and pen ---------- */
let dragCtx = null;
function startDrag(e, card){
  e.preventDefault();
  dragCtx = {id: card.dataset.id, cardEl: card};
  card.classList.add("dragging");
  try{ e.target.setPointerCapture(e.pointerId); }catch(err){}
  document.addEventListener("pointermove", onDragMove);
  document.addEventListener("pointerup", onDragEnd);
  document.addEventListener("pointercancel", onDragEnd);
}
function onDragMove(e){
  if(!dragCtx) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const targetCard = el && el.closest(".course-card");
  document.querySelectorAll(".course-card.drag-over").forEach(c=>c.classList.remove("drag-over"));
  if(targetCard && targetCard.dataset.id !== dragCtx.id){
    targetCard.classList.add("drag-over");
    dragCtx.overId = targetCard.dataset.id;
  } else {
    dragCtx.overId = null;
  }
}
function onDragEnd(){
  if(dragCtx){
    dragCtx.cardEl.classList.remove("dragging");
    document.querySelectorAll(".course-card.drag-over").forEach(c=>c.classList.remove("drag-over"));
    if(dragCtx.overId){
      const from = state.order.indexOf(dragCtx.id);
      const to = state.order.indexOf(dragCtx.overId);
      if(from>=0 && to>=0){
        state.order.splice(from,1);
        state.order.splice(to,0,dragCtx.id);
        saveState(); renderAll();
      }
    }
  }
  dragCtx = null;
  document.removeEventListener("pointermove", onDragMove);
  document.removeEventListener("pointerup", onDragEnd);
  document.removeEventListener("pointercancel", onDragEnd);
}

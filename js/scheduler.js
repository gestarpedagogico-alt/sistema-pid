/* ---------- round-robin session plan: alternates across eixos each session ---------- */
function buildSessionPlan(limitSessions){
  limitSessions = limitSessions || 400;
  const orderedIds = state.order.filter(id=>{
    const c = courseById(id); const st = state.courses[id];
    return c && st.incluido && st.status !== "concluido";
  });
  const groups = {}; const eixoOrder = [];
  orderedIds.forEach(id=>{
    const c = courseById(id);
    if(!groups[c.eixo]){ groups[c.eixo] = []; eixoOrder.push(c.eixo); }
    groups[c.eixo].push({id, remaining: courseCh(c)});
  });
  const today = new Date(); today.setHours(0,0,0,0);
  let cursor = new Date(Math.max(START_DATE.getTime(), today.getTime()));
  const plan = [];
  let guard = 0;
  function anyPending(){ return eixoOrder.some(k=>groups[k] && groups[k].length); }
  // "um curso por vez": current only advances to a NEW course when the one in
  // progress finishes, and the next course is always drawn from a DIFFERENT
  // eixo than the one that just completed (round-robin only at course switches).
  let rotIdx = 0;
  let current = null; // {id, remaining, eixo}
  function pickNext(avoidEixo){
    for(let tries=0; tries<eixoOrder.length; tries++){
      const idx = rotIdx % eixoOrder.length;
      rotIdx++;
      const eixoKey = eixoOrder[idx];
      if(eixoKey === avoidEixo && eixoOrder.length > 1) continue;
      const group = groups[eixoKey];
      if(group && group.length){
        const head = group.shift();
        return {id:head.id, remaining:head.remaining, eixo:eixoKey};
      }
    }
    // fallback: any eixo with pending work (covers the "only one eixo left" case)
    for(const eixoKey of eixoOrder){
      const group = groups[eixoKey];
      if(group && group.length){
        const head = group.shift();
        return {id:head.id, remaining:head.remaining, eixo:eixoKey};
      }
    }
    return null;
  }
  while(guard < 4000 && plan.length < limitSessions){
    guard++;
    if(!current){
      if(!anyPending()) break;
      current = pickNext(null);
      if(!current) break;
    }
    const day = cursor.getDay();
    const key = dstr(cursor);
    if((day===3||day===5) && !state.skip[key]){
      let capLeft = 2;
      while(capLeft > 0.001){
        if(!current){
          if(!anyPending()) break;
          current = pickNext(plan.length? plan[plan.length-1].eixo : null);
          if(!current) break;
        }
        const use = Math.min(capLeft, current.remaining);
        current.remaining -= use; capLeft -= use;
        const completes = current.remaining <= 1e-9;
        plan.push({date:new Date(cursor), courseId:current.id, hours:use, completes, eixo:current.eixo});
        if(completes) current = null;
      }
    }
    cursor.setDate(cursor.getDate()+1);
  }
  return plan;
}
function groupPlanByMonth(plan){
  const map = {};
  plan.forEach(entry=>{
    const y = entry.date.getFullYear(), m = entry.date.getMonth();
    const key = y+"-"+m;
    if(!map[key]) map[key] = {year:y, month:m, allocations:[]};
    map[key].allocations.push(entry);
  });
  return Object.values(map).sort((a,b)=> a.year-b.year || a.month-b.month);
}
function monthCapacity(year, monthIdx){
  let wed=0, fri=0;
  const days = new Date(year, monthIdx+1, 0).getDate();
  for(let d=1; d<=days; d++){
    const dt = new Date(year, monthIdx, d);
    const key = dstr(dt);
    if(state.skip[key]) continue;
    if(dt.getDay()===3) wed++;
    if(dt.getDay()===5) fri++;
  }
  return (wed+fri)*2;
}

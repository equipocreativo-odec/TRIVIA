
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const imgPool = [
  "assets/img/580915181_849940857428540_2714141130565720723_n.jpg",
  "assets/img/559529476_825585593197400_3294917634817482577_n.jpg",
  "assets/img/583323897_854630316959594_7417263474783017644_n.jpg",
  "assets/img/565376069_825548933201066_3488401400450194433_n.jpg",
  "assets/img/559958364_819749707114322_4315409342045096452_n.jpg",
  "assets/img/561617403_825574629865163_8654281400579803506_n.jpg"
];

const state = { total: 10, timePerQuestion: 20, qIndex: 0, score: 0, current: null, order: [], answers: [] };
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
function pickBackground(){ const img = imgPool[Math.floor(Math.random()*imgPool.length)]; const el = document.getElementById('bg'); if(el) el.src = img; }
function renderHUD(){ document.getElementById('stat-q').textContent = `Pregunta ${state.qIndex+1}/${state.total}`; document.getElementById('stat-score').textContent = `Puntaje: ${state.score}`; document.getElementById('progress-bar').style.width = `${Math.round((state.qIndex)/state.total*100)}%`; }
let timerId=null;
function startTimer(){ let t=state.timePerQuestion; document.getElementById('stat-timer').textContent = `${t}s`; clearInterval(timerId); timerId=setInterval(()=>{ t--; document.getElementById('stat-timer').textContent = `${t}s`; if(t<=0){ clearInterval(timerId); lockQuestion(null); setTimeout(nextQuestion,600);} },1000); }
function showScreen(id){ $$('.screen').forEach(s=>{ const active=s.id===id; s.classList.toggle('active',active); s.setAttribute('aria-hidden', active? 'false':'true'); }); }
function startGame(){ state.order = shuffle([...QUESTIONS]).slice(0, state.total); state.qIndex=0; state.score=0; state.answers=[]; showScreen('screen-quiz'); loadQuestion(); }
function loadQuestion(){ pickBackground(); renderHUD(); const q = state.order[state.qIndex]; state.current=q; const choicesEl=document.getElementById('choices'); document.getElementById('question').textContent=q.question; choicesEl.innerHTML=''; q.choices.forEach((txt,i)=>{ const li=document.createElement('li'); li.setAttribute('tabindex','0'); li.setAttribute('role','button'); li.textContent=txt; li.addEventListener('click',()=>lockQuestion(i)); li.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); lockQuestion(i);} }); choicesEl.appendChild(li); }); const skip=document.getElementById('btn-skip'); skip.disabled=false; skip.onclick=()=>{ lockQuestion(null); setTimeout(nextQuestion,400); }; startTimer(); }
function lockQuestion(choiceIndex){ clearInterval(timerId); const q=state.current; const items=$$('#choices li'); items.forEach((li,idx)=>{ if(idx===q.answerIndex) li.classList.add('correct'); if(choiceIndex!==null && idx===choiceIndex && idx!==q.answerIndex) li.classList.add('wrong'); li.style.pointerEvents='none'; }); const correct = choiceIndex===q.answerIndex; state.answers.push({ question:q.question, correctAnswer:q.choices[q.answerIndex], yourAnswer: choiceIndex===null? 'Sin respuesta': q.choices[choiceIndex], correct, source:q.source||null }); if(correct) state.score+=1; document.getElementById('stat-score').textContent=`Puntaje: ${state.score}`; document.getElementById('btn-skip').disabled=true; }
function nextQuestion(){ state.qIndex++; if(state.qIndex>=state.total){ endGame(); return; } loadQuestion(); }
function endGame(){ showScreen('screen-result'); document.getElementById('result-score').textContent=state.score; document.getElementById('result-total').textContent=state.total; document.getElementById('result-msg').textContent = state.score<=4? '¡Sigue explorando la ODEC!' : state.score<=7? '¡Vas por buen camino!' : '¡Crack de la cultura!'; const container=document.getElementById('review-list'); container.innerHTML=''; state.answers.forEach((a,i)=>{ const div=document.createElement('div'); div.className='review-item'; div.innerHTML = `<strong>${i+1}. ${a.question}</strong><br>Tu respuesta: ${a.yourAnswer}<br>Correcta: <span style="color:var(--odec-success)">${a.correctAnswer}</span>${a.source? `<div class="src">Fuente: <a href="${a.source}" target="_blank" rel="noopener">ver</a></div>`: ''}`; container.appendChild(div); }); }

document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-retry').addEventListener('click', startGame);
document.getElementById('btn-copy').addEventListener('click', ()=>{ const text=`Jugué Trivia ODEC: ${state.score}/${state.total} correctas.`; navigator.clipboard.writeText(text).then(()=>alert('Resultado copiado. ¡Compártelo!')); });

const scenes=[...document.querySelectorAll('.scene')];
const go=id=>{scenes.forEach(s=>s.classList.toggle('active',s.id===id));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const bar=document.getElementById('bootBar');
  const status=document.getElementById('bootStatus');
  for(let p=0;p<=100;p+=5){bar.style.width=p+'%';await sleep(18)}
  status.textContent='sinal estabelecido.';
  await sleep(420);
  go('signal');
})();

function enterSignal(){
  if(navigator.vibrate) navigator.vibrate(18);
  go('reveal');
}
const orb=document.getElementById('orbButton');
orb.addEventListener('pointerup',enterSignal);
orb.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterSignal()}});

document.getElementById('acceptBtn').addEventListener('click',()=>go('scan'));
document.getElementById('nextBtn').addEventListener('click',()=>go('teaser'));
document.getElementById('restartBtn').addEventListener('click',()=>go('signal'));

const scanner=document.getElementById('scanner');
const hidden=document.getElementById('hiddenMessage');
const counter=document.getElementById('scanCounter');
let lastX=0,lastY=0,coverage=0,active=false;
const seen=new Set();
function revealAt(e){
  const r=scanner.getBoundingClientRect();
  const x=Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100));
  const y=Math.max(0,Math.min(100,((e.clientY-r.top)/r.height)*100));
  scanner.style.setProperty('--x',x+'%');scanner.style.setProperty('--y',y+'%');
  const gx=Math.floor(x/10),gy=Math.floor(y/10),key=gx+':'+gy;
  if(!seen.has(key)){seen.add(key);coverage=Math.min(100,Math.round(seen.size/60*100));counter.textContent=coverage+'%';}
  lastX=e.clientX;lastY=e.clientY;
  if(seen.size>=60 || coverage>=100){
    scanner.classList.add('revealed');
    document.getElementById('scanHint').textContent='achou.';
    setTimeout(()=>go('found'),850);
  }
}
scanner.addEventListener('pointerdown',e=>{active=true;scanner.setPointerCapture?.(e.pointerId);revealAt(e)});
scanner.addEventListener('pointermove',e=>{if(active) revealAt(e)});
scanner.addEventListener('pointerup',()=>active=false);
scanner.addEventListener('pointercancel',()=>active=false);

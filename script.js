// ---------------------- Starfield ----------------------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars=[], numStars=100;
function resizeCanvas(){canvas.width=window.innerWidth; canvas.height=window.innerHeight;}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
for(let i=0;i<numStars;i++){stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:Math.random()*1.5+0.5,speed:Math.random()*0.5+0.2});}
function animateStars(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="white";stars.forEach(star=>{ctx.beginPath();ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);ctx.fill();star.y-=star.speed;if(star.y<0) star.y=canvas.height;});requestAnimationFrame(animateStars);}
animateStars();

// ---------------------- Card Navigation ----------------------
const tools = document.querySelectorAll(".card");
const sections = document.querySelectorAll(".tool-section");
const backBtns = document.querySelectorAll(".backBtn");

tools.forEach(card=>{
  card.addEventListener("click", ()=>{
    sections.forEach(sec=>sec.classList.remove("active"));
    backBtns.forEach(btn=>btn.parentElement.classList.remove("active"));
    if(card.id=="percentageCard") document.getElementById("percentageSection").classList.add("active");
    if(card.id=="cgpaCard") document.getElementById("cgpaSection").classList.add("active");
    if(card.id=="ageCard") document.getElementById("ageSection").classList.add("active");
    if(card.id=="studyTimerCard") document.getElementById("studyTimerSection").classList.add("active");
    document.querySelector(".tools").style.display="none";
  });
});

backBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    btn.parentElement.classList.remove("active");
    document.querySelector(".tools").style.display="grid";
  });
});

// ---------------------- Age Calculator ----------------------
document.getElementById("calculateAgeBtn")?.addEventListener("click", ()=>{
  const birth = new Date(document.getElementById("birthdate").value);
  const today = new Date();
  if(!birth.getTime()){document.getElementById("ageResult").innerText="Please select a date!"; return;}
  let age = today.getFullYear()-birth.getFullYear();
  const m = today.getMonth()-birth.getMonth();
  if(m<0||(m===0 && today.getDate()<birth.getDate())) age--;
  document.getElementById("ageResult").innerText=`Your Age: ${age} years`;
});

// ---------------------- Study Timer ----------------------
const timerDisplay=document.getElementById("timerDisplay");
const startPauseBtn=document.getElementById("startPauseBtn");
const resetBtn=document.getElementById("resetBtn");
const addTimeBtn=document.getElementById("addTimeBtn");
const timerSvg=document.querySelector("#timerSvg circle");
const sessionCounter=document.getElementById("sessionCounter");
const quoteDisplay=document.getElementById("quoteDisplay");

let totalTime=25*60, remainingTime=totalTime, timerInterval=null, session=1;
const motivationalQuotes=["Stay focused and keep learning!","One step at a time!","Your effort counts!","Concentrate and conquer!"];

function updateDisplay(){ 
  const mins=Math.floor(remainingTime/60).toString().padStart(2,"0");
  const secs=(remainingTime%60).toString().padStart(2,"0");
  timerDisplay.textContent=`${mins}:${secs}`;
  const circumference=2*Math.PI*90;
  const offset=circumference-(remainingTime/totalTime)*circumference;
  timerSvg.style.strokeDashoffset=offset;
}

function startPauseTimer(){
  if(timerInterval){clearInterval(timerInterval); timerInterval=null; startPauseBtn.textContent="Start";}
  else{
    startPauseBtn.textContent="Pause";
    timerInterval=setInterval(()=>{
      if(remainingTime>0){remainingTime--; updateDisplay();}
      else{
        clearInterval(timerInterval); timerInterval=null;
        session++; sessionCounter.textContent=`Session ${session} of 4`;
        remainingTime=totalTime;
        quoteDisplay.textContent=motivationalQuotes[Math.floor(Math.random()*motivationalQuotes.length)];
        startPauseBtn.textContent="Start";
        updateDisplay();
        const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
        const oscillator=audioCtx.createOscillator();
        oscillator.type="sine"; oscillator.frequency.setValueAtTime(440,audioCtx.currentTime);
        oscillator.connect(audioCtx.destination); oscillator.start(); oscillator.stop(audioCtx.currentTime+0.2);
      }
    },1000);
  }
}

startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", ()=>{
  remainingTime=totalTime; updateDisplay();
  if(timerInterval){clearInterval(timerInterval); timerInterval=null;}
  startPauseBtn.textContent="Start";
});
addTimeBtn.addEventListener("click", ()=>{
  remainingTime+=60; updateDisplay();
});
updateDisplay();
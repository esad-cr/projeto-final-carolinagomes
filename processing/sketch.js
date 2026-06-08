let imgInspira, imgExpira;
let iconsWhite = [], iconsGreen = [];
let iconsState = [false, false, false];
let breathing = false;
let breathTimer = 0;
let bpm_ideal = 80, bpm_atual = bpm_ideal; // valor inicial simulado
let fade = 0; // controlo da opacidade do ecrã de respiração
let reduz_bpm = false;
let num_segundo_inspira = 0;
let lastphase_ = null;
let fadeProgress = 0;
let iconSize = 100

function preload() {
  imgInspira = loadImage('icons respiracao-02.png');
  imgExpira = loadImage('icons respiracao-01.png');
   for (let i = 1; i <= 3; i++) {
  iconsWhite.push(loadImage(`icons brancos-0${i}.png`));
  iconsGreen.push(loadImage(`icons verdes-0${i}.png`));
  }
}

function setup() {
  createCanvas(450, 450);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() 
{
  background('#FFFFFF');

  // === CRIAR MÁSCARA ARREDONDADA ===
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(25, 25, 400, 400, 50);
  drawingContext.clip();
  

  // === RELÓGIO DIGITAL ===
  let h = hour();
  let m = minute();
  
  // Corpo arredondado
    fill('#181818');
    rect(width / 2, height / 2, 430, 430, 60);

  // === BARRA DE PROGRESSO ===
  let totalMin = h * 60 + m;
  let periods = [
    { start: 600, end: 690 }, 
    { start: 690, end: 710 }, 
    { start: 710, end: 750 },
    { start: 750, end: 840 }, 
    { start: 840, end: 900 }, 
    { start: 900, end: 910 },
    { start: 910, end: 960 }, 
    { start: 960, end: 970 }, 
    { start: 970, end: 1020 },
    { start: 1020, end: 1030 }, 
    { start: 1030, end: 1080 }
  ];

  let progress = 0; 
  let activePeriod = false;
  
  for (let p of periods) 
  {
    if (totalMin >= p.start && totalMin < p.end) 
    {
      activePeriod = true;
      progress = map(totalMin, p.start, p.end, 0, 1);
    }
  }

  if (totalMin >= 1200) 
  {
    progress = 1;
    activePeriod = false;
  }
  
  if (activePeriod == true) 
  {
    let fillHeight = 430 * progress;
    let grad = drawingContext.createLinearGradient(0, height/2 + 215, 0, height/2 - 215);
    grad.addColorStop(0, '#1CA9A6');
    grad.addColorStop(1, '#40E0D0');
    drawingContext.fillStyle = grad;
    
    rect(width/2, height/2 + 215 - fillHeight/2, 430, fillHeight);
  }
  
  
  // === RELÓGIO DIGITAL ===
    fill('#FFFFFF');
    textFont('Helvetica');
    textSize(64);
    text(nf(h, 2) + ":" + nf(m, 2), width/2, height/2 - 80);
    
    // === VALOR DE BPM ===
    textSize(24);
    fill('#FFFFFF');
    text(int(bpm_atual) + " bpm", width / 2, height / 2 - 35);
  
  // === Desenho dos ícones (mantendo tamanho e posição iguais) ===
let iconsY = height / 3.5 + 100; // posição fixa para todos os ícones
let spacing = 50; // espaço entre os ícones
let iconsX = width / 2 - spacing; // centro do primeiro ícone
for (let i = 0; i < 3; i++) {
  if (iconsState[i]) {
    image(iconsGreen[i], iconsX + i * spacing, iconsY, 40, 40); // ícone verde
  } else {
    image(iconsWhite[i], iconsX + i * spacing, iconsY, 40, 40); // ícone branco
  }
}
  // === SIMULAÇÃO DO BPM ===
  
  if (bpm_atual >= 120)
  {
    fill('#181818');
    rect(width / 2, height / 2, 430, 430, 60);
    
    if (frameCount%60===0) 
    {
     
      num_segundo_inspira = num_segundo_inspira + 1;
    }
    
    let transicao = false;
    
    //if (num_segundo_inspira >= 3 && num_segundo_inspira <= 5) 
    if (num_segundo_inspira > 10) 
    {
      num_segundo_inspira = 0;
    }
    
    let phase_ = (num_segundo_inspira >=0 && num_segundo_inspira <= 4) ? 'inspira' : 'expira';
    
    if (phase_ !== lastphase_) 
    {
      fadeProgress = 0;
      lastphase_ = phase_;
    }
    
    fadeProgress = min(fadeProgress+8, 255);
    tint(255, fadeProgress);
    
    if (transicao) 
    {
      fade = map(sin(frameCount*0.1), -1, 1, 0, 255);
    }
    else 
    {
      fade = 255;
    }
    
   
    if (phase_ === 'inspira') 
    {
      image (imgInspira, width/2, height/2, 450, 450);
    }
    else 
    {
      image (imgExpira, width/2, height/2, 450, 450);
    }
    
    noTint();
    
    if (num_segundo_inspira > 10)
    {
      num_segundo_inspira = 0;
    }
  }
  
  if (bpm_atual >= 120 + 10)
  {
    reduz_bpm = true;
  }
  
  if (reduz_bpm == true && bpm_atual >= 65) 
  {
    if (frameCount%60===0) bpm_atual -= 0.3;
  }
  
  if (bpm_atual <= 65)
  {
    reduz_bpm = false;
  }
  
  if (reduz_bpm == false) 
  {
    bpm_atual += 0.03;
  }
}
function mousePressed() {
  let iconsY = height / 3.5 + 100; // mesma posição Y fixa
  let spacing = 50;
  let iconsX = width / 2 - spacing; 
  let iconWidth = 40; // largura do ícone conforme draw
  let iconHeight = 40; // altura do ícone conforme draw

  for (let i = 0; i < 3; i++) {
    let x = iconsX + i * spacing;
    let y = iconsY;
    if (mouseX > x - iconWidth/2 && mouseX < x + iconWidth/2 &&
        mouseY > y - iconHeight/2 && mouseY < y + iconHeight/2) {
      iconsState[i] = !iconsState[i]; // alterna cor
    }
  }
}
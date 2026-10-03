(function() {
  'use strict';
  const D=window.OuroData, E=window.OuroEngine;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=n=>Math.round(n||0).toLocaleString('pt-BR');
  const color=(s,f='#bcec6f')=>/^#[\da-f]{6}$/i.test(s||'')?s:f;
  const hash=s=>[...String(s||'11')].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,19);
  const paths={
    trophy:['M18 8H46V27Q46 42 32 43Q18 42 18 27Z','M27 43H37V51H45V57H19V51H27Z','M18 13H8V22Q8 33 20 33M46 13H56V22Q56 33 44 33'],
    boot:['M11 13H28L30 28L41 35L55 39Q61 43 58 51H8Q4 51 5 43L9 33Z','M9 51V57H17V52M27 51V57H35V52M46 51V57H54V51','M17 25L28 23M20 31L31 28M26 36L36 32'],
    ball:['M32 5A26 26 0 1 1 31.99 5Z','M32 18L44 27L39 41H25L20 27Z','M32 5V18M8 23L20 27M16 51L25 41M48 51L39 41M56 23L44 27']
  };
  function prizeShape(type='trophy') {
    return `<g fill="#f5c64d" stroke="#684b23" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${paths[type].map((p,i)=>`<path d="${p}" ${i>0?'fill="none"':''}/>`).join('')}<path d="M23 13h5" stroke="#fff1b4" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  function symbol(type='trophy',css='') {
    return `<svg class="prize-icon ${css}" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">${prizeShape(type)}</svg>`;
  }
  function face(seed, expression='happy') {
    const h=hash(seed), skin=['#efb484','#b9714e','#d49568','#8d553d','#f5c89e'][h%5], hair=['#33231e','#151f29','#64402a','#b58142'][h%4];
    return `<g stroke="#28322c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="-17" cy="0" r="5" fill="${skin}"/><circle cx="17" cy="0" r="5" fill="${skin}"/><path d="M-17-15Q0-26 17-15V5Q15 23 0 24Q-15 23-17 5Z" fill="${skin}"/><path d="M-18-9Q-22-29 0-29Q22-27 19-8L10-17Q0-9-8-15Z" fill="${hair}"/><path d="M-10 1h1M8 1h1" stroke-width="4"/><path d="${expression==='sad'?'M-6 14Q0 8 7 14':expression==='neutral'?'M-5 13h11':'M-6 10Q0 19 7 10Z'}" fill="${expression==='happy'?'#fff':'none'}"/>${expression==='sad'?'<path d="M12 7q-5 8 1 8q5-1-1-8" fill="#83cced" stroke="none"/>':''}</g>`;
  }
  function avatar(seed) {
    const h=hash(seed), shirt=['#699dc6','#669269','#c78181','#9382bd','#d6a04f'][h%5];
    return `<svg class="player-avatar-svg" viewBox="0 0 90 90" aria-hidden="true"><circle cx="45" cy="44" r="41" fill="#fff5"/><path d="M12 90V77Q15 59 45 59Q75 59 78 77V90" fill="${shirt}" stroke="#29352e" stroke-width="3"/><path d="M36 64l9 10 9-10M45 74v16" fill="none" stroke="#fff8" stroke-width="3"/><g transform="translate(45 36) scale(.96)">${face(seed)}</g><path d="M23 80h9" stroke="#fff" stroke-width="3"/></svg>`;
  }
  function person(seed, kit, mood='happy', pose='stand', prize='') {
    const shirt=color(kit), body=pose==='kneel'?'<path d="M-17 63l-12 20h27M17 63l12 20H2"/>':'<path d="M-13 58v35M13 58v35"/>';
    const arms=pose==='lift'?'<path d="M-19 26L-37-8M19 26L37-8"/>':pose==='kneel'?'<path d="M-19 27L-10 3M19 27L10 3"/>':prize?'<path d="M-20 28L-36 40L-8 40M20 28L36 40L8 40"/>':'<path d="M-20 26L-31 52M20 26L32 47"/>';
    return `<g class="cartoon-person"><g stroke="#26372e" stroke-width="12" stroke-linecap="round" fill="none">${body}</g><path d="M-22 20Q0 10 22 20L20 61H-20Z" fill="${shirt}" stroke="#26372e" stroke-width="3"/><path d="M-6 18l6 10 6-10" fill="#fff"/><path d="M0 28v31" stroke="#fff7" stroke-width="3"/><g fill="none" stroke="${shirt}" stroke-width="12" stroke-linecap="round">${arms}</g><g transform="translate(0 -8)">${face(seed,mood)}</g>${prize?`<g transform="translate(-24 19) scale(.75)">${prizeShape(prize)}</g>`:''}</g>`;
  }
  function scene(kind, options={}) {
    const kit=color(options.color), seed=options.seed||'coach', happy=['champion','boot','ball','good'].includes(kind);
    const confetti=happy?Array.from({length:20},(_,i)=>`<rect class="confetti" x="${30+i*29}" y="${20+(i*43)%100}" width="6" height="12" rx="2" fill="${['#f6c855','#8dcfeb','#ec8476','#c5f48d'][i%4]}" style="animation-delay:${-(i%7)*.31}s;transform:rotate(${i*24}deg);transform-origin:${30+i*29}px ${20+(i*43)%100}px"/>`).join(''):'';
    let figures='';
    if(kind==='champion') {
      figures=[-2,-1,0,1,2].map((i)=>`<g transform="translate(${320+i*76} ${i===0?168:185}) scale(${i===0?1.1:.87})"><g class="celebrate" style="animation-delay:${i*.13}s">${person(seed+i,kit,'happy','lift')}${i===0?`<g transform="translate(-34 -92)">${prizeShape('trophy')}</g>`:''}</g></g>`).join('');
    } else if(kind==='boot'||kind==='ball') {
      figures=`<path d="M216 278h208v28H216Z" fill="#d3ad64" stroke="#26372e" stroke-width="3"/><g transform="translate(320 156) scale(1.3)"><g class="prize-holder">${person(seed,kit,'happy','stand',kind)}</g></g><path class="sparkle" d="M237 126v20m-10-10h20m155 15v20m-10-10h20" stroke="#f6cf66" stroke-width="4" stroke-linecap="round"/>`;
    } else {
      const mood=kind==='bad'?'sad':kind==='medium'?'neutral':'happy';
      figures=`<g transform="translate(320 ${kind==='bad'?182:167}) scale(1.25)"><g class="coach-${kind}">${person(seed,kit,mood,kind==='bad'?'kneel':'stand')}${kind==='medium'?'<g transform="translate(16 30) rotate(-12)"><rect width="30" height="38" rx="3" fill="#f7ead0" stroke="#28342d" stroke-width="2"/><path d="M5 12h20M5 20h20M5 28h14" stroke="#7b8871" stroke-width="2"/></g>':''}</g></g>${kind==='bad'?'<g fill="#91adbb"><path d="M198 44q-20-23-45-3q-16-4-19 13h80q0-14-16-10Z"/><path d="m155 70-4 12m28-12-4 12m27-12-4 12" stroke="#91adbb" stroke-width="3"/></g>':''}`;
    }
    const label={champion:'Elenco levantando a taça',boot:'Jogador segurando a Chuteira de Ouro',ball:'Jogador recebendo a Bola de Ouro',bad:'Treinador ajoelhado após uma temporada difícil',medium:'Treinador revendo sua prancheta',good:'Treinador comemorando a temporada'}[kind]||'Cena do clube';
    return `<svg class="story-scene" viewBox="0 0 640 320" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="320" rx="20" fill="${happy?'#28483e':'#293e46'}"/><circle cx="320" cy="97" r="122" fill="${happy?'#efd57a18':'#91c6d315'}"/><path d="M0 131Q320 13 640 131V245H0Z" fill="#152d2d"/><path d="M0 167Q320 63 640 167M0 193Q320 90 640 193" fill="none" stroke="#456356" stroke-width="17" stroke-dasharray="4 9"/><path d="M0 248Q320 176 640 248V320H0Z" fill="#628360"/><path d="M0 287Q320 210 640 287" fill="none" stroke="#a1bc85" stroke-width="3"/><ellipse cx="320" cy="290" rx="169" ry="16" fill="#182f2545"/>${confetti}${figures}</svg>`;
  }
  function cabinet(c,compact=false) {
    return `<div class="prize-cabinet ${compact?'compact':''}" aria-label="Troféus da carreira">${[['trophy',c.titles,'Títulos'],['boot',c.goldenBoots,'Chuteiras de Ouro'],['ball',c.goldenBalls,'Bolas de Ouro']].map(([type,count,label])=>`<div>${symbol(type)}<strong>${count}</strong><span>${label}</span></div>`).join('')}</div>`;
  }
  function paper(s,h) {
    const own=h.table.find(t=>t.id==='user'), gap=h.table[0].pts-own.pts;
    const mood=h.position===1?'champion':h.position<=4?'good':h.position<=10?'medium':'bad';
    let headline,copy;
    if(h.position===1){headline='A cidade veste a cor do campeão!';copy=`${s.club.name} ergueu a taça com ${own.pts} pontos. O trabalho virou festa e o elenco entrou para a história.`;}
    else if(h.position<=4&&gap<=3){headline='Por um detalhe. Por muito pouco.';copy=`A taça escapou por ${gap} ponto${gap===1?'':'s'}. ${s.club.name} terminou em ${h.position}º: faltou sorte em momentos decisivos, mas sobrou futebol para sonhar.`;}
    else if(h.position<=4){headline='Sem taça, mas de cabeça erguida.';copy=`O ${h.position}º lugar e as ${own.w} vitórias fizeram a torcida acreditar. O projeto ganha força para o próximo desafio.`;}
    else if(h.position<=10){headline='Nem festa, nem terra arrasada.';copy=`${s.club.name} ficou em ${h.position}º, com ${own.pts} pontos. A campanha teve boas ideias e tropeços: a prancheta vai trabalhar nas férias.`;}
    else {headline='A temporada que a torcida quer esquecer.';copy=`O ${h.position}º lugar deixou o treinador de joelhos. Com ${own.l} derrotas, ${s.club.name} precisa aprender com o fracasso e reconstruir a confiança.`;}
    return `<article class="season-paper"><div class="paper-masthead"><span>EDIÇÃO ESPECIAL · T${h.season}</span><b>Jornal do XI</b><span>FUTEBOL, DRAMA & GLÓRIA</span></div><div class="paper-headline"><span>APITO FINAL</span><h2 id="dialog-title">${esc(headline)}</h2><p>${esc(copy)}</p></div>${scene(mood,{color:s.club.color,seed:s.captain})}<div class="paper-caption">${esc(s.club.name)} · ${h.position}º lugar · Avaliação do técnico: ${h.score}/100</div><div class="paper-notes"><p><b>DONO DA LIGA</b>${esc(h.champion.name)} levou o título.</p><p><b>NOITE DE PRÊMIOS</b>${h.bootWon?'Chuteira de Ouro para o nosso clube. ':'A Chuteira ficou com '+esc(h.scorer?.club||'a liga')+'. '}${h.ballWon?'E a Bola de Ouro também é nossa!':h.ballWinner?'Bola de Ouro: '+esc(h.ballWinner.name)+'.':''}</p></div></article>`;
  }
  function summary(s,h) {
    const own=h.table.find(t=>t.id==='user');
    return `<div class="story-heading"><span class="eyebrow">Temporada ${h.season} encerrada</span><h2 id="dialog-title">${h.position===1?'A taça é nossa!':'Apito final. Hora do balanço.'}</h2><p>${esc(h.champion.name)} é o campeão. Seu clube terminou em <strong>${h.position}º lugar</strong>.</p></div>${scene('champion',{color:h.champion.color,seed:h.champion.captain||h.champion.name})}<div class="season-numbers">${[[h.position+'º','Colocação'],[own.pts,'Pontos'],[own.gf,'Gols'],[h.score+'/100','Técnico']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div><p class="story-coach">${esc(E.coachLabel(h.score))} · + ${number(h.prize)} moedas de premiação${h.automatic?' · + '+number(h.automatic)+' de objetivos':''}</p><details class="season-details" open><summary>Classificação final · 20 clubes</summary><div class="season-scroll"><table><thead><tr><th>Pos.</th><th>Clube</th><th>PTS</th><th>V</th><th>SG</th></tr></thead><tbody>${h.table.map((r,i)=>`<tr class="${r.id==='user'?'user-row':''}"><td>${i+1}º</td><td>${esc(r.name||D.teams.find(t=>t.id===r.id)?.name||s.club.name)}</td><td><b>${r.pts}</b></td><td>${r.w}</td><td>${r.gf-r.ga}</td></tr>`).join('')}</tbody></table></div></details><details class="season-details"><summary>Artilharia · ${h.scorers.length} destaques</summary><div class="season-scroll"><table><thead><tr><th>Jogador</th><th>Clube</th><th>Gols</th></tr></thead><tbody>${h.scorers.map(p=>`<tr class="${p.team==='user'?'user-row':''}"><td>${esc(p.name)}</td><td>${esc(p.club)}</td><td><b>${p.g}</b></td></tr>`).join('')}</tbody></table></div></details><details class="season-details"><summary>Desempenho do elenco · gols, passes e notas</summary><div class="season-scroll"><table><thead><tr><th>Jogador</th><th>J</th><th>G</th><th>A</th><th>Nota</th></tr></thead><tbody>${[...h.stats].sort((a,b)=>b.g-a.g||b.ratingSum/b.apps-a.ratingSum/a.apps).map(p=>`<tr><td>${esc(D.byId[p.id].name)}</td><td>${p.apps}</td><td>${p.g}</td><td>${p.a}</td><td>${(p.ratingSum/p.apps).toFixed(2)}</td></tr>`).join('')}</tbody></table></div></details>`;
  }
  function award(s,h,type) {
    const p=type==='boot'?h.scorer:h.ballWinner, label=type==='boot'?'Chuteira de Ouro':'Bola de Ouro';
    if(!p)return `<div class="story-heading"><h2 id="dialog-title">${label}</h2><p>Os dados deste prêmio não estão disponíveis para esta temporada antiga.</p></div>`;
    return `<div class="story-heading"><span class="eyebrow">Gala do XI · Temporada ${h.season}</span><h2 id="dialog-title">${label}</h2><p>${type==='boot'?'A rede balançou. O nome ficou.':'O melhor da liga, eleito pelos números.'}</p></div>${scene(type,{color:p.color,seed:p.id})}<div class="award-winner">${symbol(type)}<div><span>${p.team==='user'?'PRÊMIO DO SEU CLUBE':'VENCEDOR DA LIGA'}</span><h3>${esc(p.name)}</h3><p>${esc(p.club)} · ${p.g} gols · nota ${(p.average||p.ratingSum/p.apps).toFixed(2)}</p></div></div>${type==='ball'?`<div class="finalist-grid">${h.finalists.map((f,i)=>`<div class="finalist ${i===0?'winner':''}">${avatar(f.id)}<b>${i+1}º · ${esc(f.name)}</b><small>${f.awardScore.toFixed(2)} pontos</small><span>${f.g} gols · nota ${f.average.toFixed(2)}</span></div>`).join('')}</div><p class="award-rule">Mínimo de 8 jogos. Pontuação: 60% nota média, 35% gols e 5% assistências. Gols e passes são comparados aos líderes da liga. Desempate: gols, nota, menos minutos e identificador.</p>`:'<p class="award-rule">Mais gols na liga. Desempate por assistências, depois menos minutos jogados.</p>'}<p class="award-earned">${p.team==='user'?'Mais um prêmio na coleção do clube!':'A disputa continua. Quem sabe o próximo seja seu?'}</p>`;
  }
  function eventView(s,h) {
    const event=h.event;
    if(!event)return '';
    const playerChoice=id=>{const p=D.byId[id];return `<button class="event-player" data-action="resolve-season-event" data-choice="${id}">${avatar(id)}<b>${esc(p.name)}</b><span>${p.pos} · ${p.ovr} OVR</span><small>Liberar por 0 moedas</small></button>`;};
    let content='';
    if(event.resolved) {
      const o=event.outcome;
      content=`<div class="event-receipt"><h3>Decisão registrada</h3>${o.departed.length?`<p><b>Deixaram o clube:</b> ${o.departed.map(id=>esc(D.byId[id].name)).join(', ')}.</p>`:''}<p><b>Moedas perdidas:</b> ${number(o.coinsLost)} · <b>Compensação pelas saídas:</b> 0.</p>${o.added.length?`<p><b>Reposições de emergência:</b> ${o.added.map(id=>esc(D.byId[id].name)+' ('+D.byId[id].ovr+')').join(', ')}.</p>`:''}<p>As vagas dos titulares foram preenchidas pelo elenco disponível. Confira o time antes de voltar a jogar.</p></div>`;
    } else if(event.kind==='choice') content=`<div class="event-options">${event.targets.map(playerChoice).join('')}</div>`;
    else if(event.kind==='dilemma') content=`<div class="event-options dilemma"><button class="event-player" data-action="resolve-season-event" data-choice="coins"><span class="event-coin">$</span><b>Quitar com o caixa</b><span>Perder ${number(s.coins)} moedas</span></button><button class="event-player" data-action="resolve-season-event" data-choice="player">${avatar(event.targets[0])}<b>Liberar ${esc(D.byId[event.targets[0]].name)}</b><span>${D.byId[event.targets[0]].ovr} OVR · 0 moedas recebidas</span></button></div>`;
    else content=`${event.targets.length?`<div class="event-departures">${event.targets.map(id=>`<div>${avatar(id)}<b>${esc(D.byId[id].name)}</b><span>${D.byId[id].ovr} OVR</span></div>`).join('')}</div>`:''}<button class="btn event-confirm" data-action="resolve-season-event">Confirmar consequências</button>`;
    return `<div class="story-heading"><span class="eyebrow">Entre temporadas · ${h.season} → ${h.season+1}</span><h2 id="dialog-title">${esc(event.title)}</h2><p>${esc(event.description)}</p></div><div class="event-illustration">${scene(event.resolved?'medium':'bad',{color:s.club.color,seed:'coach'})}</div><div class="event-impact"><b>Impacto no clube</b><p>${esc(event.effect)}</p></div>${content}<p class="award-rule">Um evento por transição, sem repetir nesta carreira. Se faltar elenco, chegam reposições de 68–72 OVR para manter pelo menos 18 jogadores e dois goleiros.</p>`;
  }
  function render(s,h,step=0) {
    const current=h.season===s.season&&s.phase!=='active', names=['Balanço','Chuteira','Bola','Jornal'];
    if(current&&h.season<5)names.push('Evento');
    step=Math.max(0,Math.min(step,names.length-1));
    const body=step===0?summary(s,h):step===1?award(s,h,'boot'):step===2?award(s,h,'ball'):step===3?paper(s,h):eventView(s,h);
    const more=step<names.length-1, locked=step===4&&!h.event?.resolved;
    const action=more?'story-next':current?(h.season===5?'finish-career':'next-season'):'close';
    const label=more?['Ver Chuteira de Ouro','Ver Bola de Ouro','Ler o jornal','Ver evento das férias'][step]:current?(h.season===5?'Ver minha carreira':s.autoCareer?'Continuar simulação':'Iniciar temporada '+(h.season+1)):'Voltar ao clube';
    return `<div class="season-story"><header class="story-nav"><div class="story-steps">${names.map((n,i)=>`<span class="${i===step?'current':i<step?'done':''}">${i+1}<small>${n}</small></span>`).join('')}</div><button class="icon-btn" data-action="close" aria-label="Voltar ao clube">×</button></header>${body}<footer class="story-actions">${step>0?'<button class="btn secondary" data-action="story-back">Voltar</button>':''}${s.autoCareer?'<button class="text-button" data-action="stop-auto">Parar simulação</button>':''}<button class="btn" data-action="${action}" ${locked?'disabled':''}>${locked?'Resolva o evento para continuar':label}</button></footer>${s.autoCareer?'<p class="auto-explanation">Simulação em andamento: as partidas avançam automaticamente. Prêmios e eventos fazem uma pausa para você acompanhar.</p>':''}</div>`;
  }

  function drawSymbol(ctx,type,x,y,size) {
    ctx.save();ctx.translate(x,y);ctx.scale(size/64,size/64);ctx.lineWidth=3;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#775523';ctx.fillStyle='#f5c64d';
    paths[type].forEach((d,i)=>{const p=new Path2D(d);if(i===0)ctx.fill(p);ctx.stroke(p);});ctx.restore();
  }
  function drawFinal(canvas,s) {
    if(!canvas)return;
    const c=E.career(s),ctx=canvas.getContext('2d');canvas.width=1080;canvas.height=1350;
    const rect=(x,y,w,h,fill,r=18)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
    const text=(str,x,y,max,size,fill='#f7f4de',weight=700)=>{ctx.fillStyle=fill;ctx.font=`${weight} ${size}px Arial`;while(ctx.measureText(str).width>max&&size>14){size--;ctx.font=`${weight} ${size}px Arial`;}ctx.fillText(str,x,y);};
    rect(0,0,1080,1350,'#122d2a',0);rect(28,28,1024,1294,'#1e3f35',28);ctx.strokeStyle='#c3e77a';ctx.lineWidth=3;ctx.strokeRect(49,49,982,1252);
    text('XI',80,127,90,62,'#c3e77a',900);text('XI, É CRAQUE',183,99,600,24);text('CINCO TEMPORADAS. UM LEGADO.',183,130,800,18,'#bfd2bf');
    text(s.club.name,80,231,920,59);text(E.coachLabel(c.score),80,282,900,29,'#c3e77a');
    [['trophy',c.titles,'TÍTULOS'],['boot',c.goldenBoots,'CHUTEIRAS DE OURO'],['ball',c.goldenBalls,'BOLAS DE OURO']].forEach(([type,n,label],i)=>{const x=80+i*315;rect(x,327,294,184,'#f5e8bb');drawSymbol(ctx,type,x+24,346,72);text(String(n),x+122,412,146,58,'#26392d',900);text(label,x+23,475,251,18,'#42513b');});
    [['MELHOR POSIÇÃO',c.best+'º'],['VITÓRIAS',String(c.wins)],['GOLS',String(c.goals)],['FORÇA FINAL',String(c.overall)]].forEach(([label,v],i)=>{const x=80+i*236;rect(x,539,217,125,'#315544');text(v,x+19,597,180,42,'#fff2ce',850);text(label,x+19,634,180,16,'#bfd5bc');});
    text('OS CAPÍTULOS DO CLUBE',80,719,900,22,'#c3e77a');
    s.history.forEach((h,i)=>{const y=749+i*66;rect(80,y,923,57,i%2?'#284a3c':'#315544',8);text('TEMP. '+h.season,96,y+37,135,18,'#bbd2bc');text(h.position+'º LUGAR',252,y+37,207,23,h.position===1?'#ffd66b':'#f3f3db');text(h.table.find(t=>t.id==='user').pts+' PTS',474,y+37,150,20);text(h.score+'/100',671,y+37,130,20,'#c3e77a');if(h.scorer?.team==='user')drawSymbol(ctx,'boot',837,y+9,37);if(h.ballWinner?.team==='user')drawSymbol(ctx,'ball',920,y+9,37);});
    text('NOME PARA A HISTÓRIA',80,1140,610,18,'#f2ce71');text(c.star?D.byId[c.star.id].name:'Seu elenco',80,1183,610,34);text(c.star?c.star.g+' gols · '+c.star.a+' assistências':'Uma história coletiva',80,1220,650,22,'#bdd3bd');text(c.score+'/100',803,1175,190,40,'#c3e77a');text('AVALIAÇÃO FINAL',791,1213,220,16,'#bdd3bd');text('Meu clube. Meu XI de craques.',80,1274,900,18,'#a9c6ad');
    return canvas;
  }
  window.OuroStory={symbol,avatar,scene,cabinet,render,drawFinal};
})();

const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../js/data.js');
const E=require('../js/engine.js');
const clone=s=>JSON.parse(JSON.stringify(s));
function club(seed=42,captain=D.captains[0],starter='balanced'){return E.createClub({name:'Resenha FC',short:'RFC',captain,starter,slot:'bot',color:'#bcf269'},seed);}
function ready(seed=42){const s=club(seed);E.openPack(s,'welcome');E.finishPack(s);E.optimize(s);return s;}
function checkLeague(s){
 const rows=E.ranked(s),totalGoals=rows.reduce((a,r)=>a+r.gf,0);
 assert.equal(totalGoals,rows.reduce((a,r)=>a+r.ga,0));
 assert.equal(totalGoals,Object.values(s.stats).reduce((a,p)=>a+p.g,0));
 assert.equal(rows.reduce((a,r)=>a+r.w,0),rows.reduce((a,r)=>a+r.l,0));
 for(const r of rows){assert.equal(r.played,s.round);assert.equal(r.pts,3*r.w+r.d);assert.equal(r.played,r.w+r.d+r.l);}
 for(const matches of s.results)for(const m of matches){assert.equal(m.events.length,m.hg+m.ag);for(const event of m.events){const scorer=m.ratings.find(p=>p.team===event.team&&p.id===event.scorer);assert.ok(scorer);assert.ok(event.minute>scorer.from&&event.minute<=scorer.to);if(event.assist){assert.notEqual(event.assist,event.scorer);const assist=m.ratings.find(p=>p.team===event.team&&p.id===event.assist);assert.ok(event.minute>assist.from&&event.minute<=assist.to);}}}
}
test('507 cartas base e edições especiais com IDs, posições e países válidos',()=>{assert.equal(D.basePlayers.length,507);assert.ok(D.players.length>=518);assert.equal(new Set(D.players.map(p=>p.id)).size,D.players.length);for(const p of D.players){assert.ok(D.nations[p.nation],p.name);assert.ok(p.ovr>=68&&p.ovr<=99);}});
test('todos os capitães e elencos iniciais são utilizáveis',()=>{for(const captain of D.captains)for(const style of ['balanced','attack','defense']){let s=club(41,captain,style);assert.equal(s.squad.length,18);assert.equal(s.lineup.length,11);assert.equal(s.bench.length,7);assert.ok(s.lineup.includes(captain));assert.equal(s.captain,captain);assert.ok(s.squad.filter(id=>D.byId[id].pos==='GOL').length>=2);assert.ok(E.validate(s));}});
test('calendário: todos enfrentam todos uma vez, sem jogos duplicados',()=>{for(let seed=0;seed<15;seed++){let s=club(seed),pairs=new Set();assert.equal(s.fixtures.length,19);for(const round of s.fixtures){assert.equal(round.length,10);assert.equal(new Set(round.flatMap(m=>[m.home,m.away])).size,20);for(const m of round){let key=[m.home,m.away].sort().join(':');assert.ok(!pairs.has(key));pairs.add(key);}}assert.equal(pairs.size,190);const homeGames=s.fixtures.flat().filter(m=>m.home==='user').length;assert.ok(homeGames===9||homeGames===10);}});
test('pacote inicial garantido, compra atômica e recuperação após recarregar',()=>{let s=club();const coins=s.coins;let pack=E.openPack(s,'welcome');assert.equal(s.coins>=coins,true);assert.ok(pack.cards.some(c=>D.byId[c.id].ovr>=80));let snapshot=JSON.stringify(s);assert.throws(()=>E.openPack(s,'welcome'));assert.equal(JSON.stringify(s),snapshot);s=clone(s);assert.ok(E.validate(s));E.reveal(s);assert.equal(s.pendingPack.revealed,1);E.finishPack(s);assert.throws(()=>E.openPack(s,'welcome'));s.coins=0;snapshot=JSON.stringify(s);assert.throws(()=>E.openPack(s,'gold'));assert.equal(JSON.stringify(s),snapshot);});
test('todos os pacotes cumprem suas garantias e posições',()=>{for(const p of D.packs){let s=ready();s.season=5;s.coins=1e7;if(p.id==='welcome')s.welcomeOpened=false;for(let i=0;i<120;i++){const before=new Set(s.squad),oldCoins=s.coins;const pack=E.openPack(s,p.id);assert.equal(pack.cards.length,p.count);assert.equal(new Set(pack.cards.map(c=>c.id)).size,p.count);assert.ok(pack.cards.some(c=>D.byId[c.id].ovr>=p.min));for(const c of pack.cards){assert.equal(c.duplicate,before.has(c.id));if(p.positions)assert.ok(p.positions.includes(D.byId[c.id].pos));if(p.mode!=='choice')assert.ok(s.squad.includes(c.id));}if(p.mode==='choice'){assert.deepEqual(new Set(s.squad),before);pack.revealed=3;E.choosePackCard(s,pack.cards[0].id);}const credited=p.mode==='choice'?[pack.cards[0]]:pack.cards;assert.equal(s.coins,oldCoins-p.price+credited.reduce((a,c)=>a+c.refund,0));E.finishPack(s);if(p.id==='welcome')s.welcomeOpened=false;}}});
test('revenda não cria uma fonte infinita de moedas no valor esperado',()=>{for(const p of D.packs.filter(p=>p.price)){let s=ready(75);s.season=5;s.coins=1e8;s.squad=D.players.map(p=>p.id);let received=0;for(let i=0;i<600;i++){const pack=E.openPack(s,p.id);if(p.mode==='choice'){pack.revealed=3;const c=[...pack.cards].sort((a,b)=>b.refund-a.refund)[0];E.choosePackCard(s,c.id);received+=c.refund;}else received+=pack.cards.reduce((a,c)=>a+c.refund,0);E.finishPack(s);}assert.ok(received/600<p.price*.95,`${p.name}: revenda ${received/600}, preço ${p.price}`);}});
test('escalação e banco sem duplicatas nas seis formações',()=>{let s=ready();for(const formation of Object.keys(D.formations)){E.changeFormation(s,formation);assert.equal(new Set(s.lineup).size,11);assert.equal(s.bench.length,7);assert.ok(!s.bench.some(id=>s.lineup.includes(id)));const out=s.lineup[9],incoming=s.bench.find(id=>D.byId[id].pos!=='GOL');E.swap(s,9,incoming);assert.ok(s.bench.includes(out));assert.ok(!s.bench.includes(incoming));assert.ok(E.validate(s));}});
test('venda preserva titulares, capitão, 18 cartas e dois goleiros',()=>{let s=ready();assert.throws(()=>E.sell(s,s.lineup[0]));let sold=0;for(const id of [...s.squad]){if(!E.saleReason(s,id)){let old=s.coins,v=E.sell(s,id);assert.equal(s.coins,old+v);assert.ok(!s.squad.includes(id));sold++;}}assert.ok(sold>0);assert.equal(s.squad.length,18);assert.equal(s.bench.length,7);assert.ok(s.squad.filter(id=>D.byId[id].pos==='GOL').length>=2);assert.ok(E.validate(s));});
test('objetivos pagam uma vez e são coletados no fechamento',()=>{let s=ready();for(let i=0;i<3;i++)E.advanceRound(s);const before=s.coins;assert.equal(E.claim(s,'play'),650);assert.equal(s.coins,before+650);assert.throws(()=>E.claim(s,'play'));for(let i=3;i<19;i++)E.advanceRound(s);assert.ok(s.objectives.every(o=>o.progress<o.target||o.claimed));});
test('cinco temporadas completas, gols, calendário, progressão e limite final',()=>{let s=ready(100),careerGoals=0;for(let year=1;year<=5;year++){for(let r=0;r<19;r++){for(const o of s.objectives)if(!o.claimed&&o.progress>=o.target)E.claim(s,o.id);const p=s.season>=3&&s.coins>=D.packs.find(p=>p.id==='legend').price?'legend':s.season>=2&&s.coins>=D.packs.find(p=>p.id==='elite').price?'elite':s.coins>=D.packs.find(p=>p.id==='gold').price?'gold':null;if(p){E.openPack(s,p);E.finishPack(s);E.optimize(s);}E.advanceRound(s);s=clone(s);assert.ok(E.validate(s));}checkLeague(s);assert.equal(s.history.length,year);const summary=s.history.at(-1);assert.equal(summary.table.length,20);assert.equal(summary.prize,[6500,4200,2800,1600][summary.position===1?0:summary.position<=4?1:summary.position<=10?2:3]);careerGoals+=s.table.find(t=>t.id==='user').gf;if(year<5){const event=E.pendingEvent(s);assert.ok(event);assert.throws(()=>E.nextSeason(s));E.resolveSeasonEvent(s,event.kind==='choice'?event.targets.at(-1):event.kind==='dilemma'?'coins':undefined);let ids=[...s.squad],coins=s.coins;E.nextSeason(s);assert.deepEqual(s.squad,ids);assert.equal(s.coins,coins);assert.equal(s.round,0);}}assert.equal(E.career(s).goals,careerGoals);assert.equal(s.phase,'finished');assert.equal(E.career(s).matches,95);assert.throws(()=>E.nextSeason(s));assert.throws(()=>E.advanceRound(s));assert.throws(()=>E.openPack(s,'base'));});
test('atributos, posição, mando e tática mudam as chances',()=>{let s=ready(),t=E.team(s,'user'),op=E.team(s,s.teams.find(t=>t.id!=='user').id),base=E.expected(t,op,true);assert.ok(base>E.expected(t,op,false));let bad=clone(t);[bad.lineup[0],bad.lineup[9]]=[bad.lineup[9],bad.lineup[0]];assert.ok(E.metrics(bad).overall<E.metrics(t).overall);assert.ok(E.metrics(bad).keeper<E.metrics(t).keeper);let press=clone(t);press.tactic='press';assert.notEqual(E.expected(press,op,true),base);let elite={...t,...E.autoLineup(D.players.filter(p=>p.ovr>=84).map(p=>p.id),t.formation)};assert.ok(E.expected(elite,op,true)>base);assert.ok(E.expected(op,elite,false)<E.expected(op,t,false));});
test('salvar/carregar preserva exatamente o resultado e evita reroll',()=>{let a=ready(1789),b=clone(a);assert.deepEqual(E.advanceRound(a),E.advanceRound(b));assert.deepEqual(a,b);});

test('capitães sorteados variam os nomes, mantêm seis posições e não repetem cartas',()=>{
 const seen=new Set();for(let seed=1;seed<=30;seed++){const ids=E.drawCaptains(seed);assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);assert.ok(ids.some(id=>D.byId[id].pos==='GOL'));for(const id of ids){assert.ok(D.captains.includes(id));seen.add(id);}}
 assert.ok(seen.size>40);assert.deepEqual(E.drawCaptains(72),E.drawCaptains(72));
});

test('os 16 eventos têm impacto, sobrevivem ao reload e não duplicam perdas',()=>{
 const seen=new Set();
 for(let seed=1;seed<=240&&seen.size<E.seasonEvents.length;seed++){
   let s=ready(seed);for(const id of [...s.squad])if(!E.saleReason(s,id))E.sell(s,id);
   for(let r=0;r<19;r++)E.advanceRound(s);
   const e=E.pendingEvent(s);if(seen.has(e.id))continue;seen.add(e.id);
   const before=clone(s),targets=[...e.targets],originalCaptain=s.captain;
   assert.equal(s.history.length,1);assert.throws(()=>E.nextSeason(s));assert.throws(()=>E.openPack(s,'base'));
   s=clone(s);assert.ok(E.validate(s));assert.deepEqual(E.pendingEvent(s),e);
   let choice=e.kind==='choice'?targets.at(-1):e.kind==='dilemma'?'player':undefined;
   if(e.id==='financial')assert.deepEqual(targets,[...s.squad].sort((a,b)=>D.byId[b].ovr-D.byId[a].ovr||a.localeCompare(b)).slice(0,3));
   if(e.kind==='choice'){const snap=JSON.stringify(s);assert.throws(()=>E.resolveSeasonEvent(s,'bad'));assert.equal(JSON.stringify(s),snap);}
   const result=E.resolveSeasonEvent(s,choice),o=result.outcome;
   assert.equal(s.coins,before.coins-o.coinsLost);assert.equal(s.sales,before.sales);assert.equal(s.coinsEarned,before.coinsEarned);
   assert.ok(E.validate(s),e.id);assert.ok(s.squad.length>=18);assert.equal(s.bench.length,7);assert.ok(s.squad.filter(id=>D.byId[id].pos==='GOL').length>=2);
   for(const id of o.departed){assert.ok(!s.squad.includes(id));assert.ok(!s.lineup.includes(id));assert.ok(!s.bench.includes(id));}
   for(const id of o.added)assert.ok(D.byId[id].ovr<=72);
   assert.ok(s.lineup.includes(s.captain));
   if(e.id==='mutiny'){assert.equal(o.departed.length,3);assert.ok(o.departed.includes(originalCaptain));}
   if(e.id==='transferban')assert.equal(s.coins,0);
   if(e.id==='retirement')assert.ok(s.retiredPlayers.includes(targets[0]));
   if(e.kind==='choice'){assert.deepEqual(o.departed,[choice]);assert.ok(targets.filter(id=>id!==choice).every(id=>s.squad.includes(id)));}
   const snap=JSON.stringify(s);assert.throws(()=>E.resolveSeasonEvent(s,choice));assert.equal(JSON.stringify(s),snap);
   E.nextSeason(s);assert.ok(E.validate(s));assert.equal(s.season,2);E.advanceRound(s);assert.equal(s.round,1);
 }
 assert.equal(seen.size,16);
});

test('quatro transições sem repetição, quinta temporada sem evento e prêmios persistentes',()=>{
 const s=ready(731),ids=[];for(let year=1;year<=5;year++){
   for(let r=0;r<19;r++)E.advanceRound(s);
   const h=s.history.at(-1);assert.equal(h.scorers.length,10);assert.equal(h.finalists.length,3);
   assert.ok(h.finalists.every(p=>p.apps>=8));assert.deepEqual(h.ballWinner,h.finalists[0]);
   const totals=E.career(s);assert.equal(totals.goldenBoots,s.history.filter(h=>h.scorer.team==='user').length);assert.equal(totals.goldenBalls,s.history.filter(h=>h.ballWinner.team==='user').length);
   const snap=JSON.stringify(h);E.ensureSeason(s);assert.equal(JSON.stringify(h),snap);
   if(year<5){const e=E.pendingEvent(s);assert.ok(!ids.includes(e.id));ids.push(e.id);E.resolveSeasonEvent(s,e.kind==='choice'?e.targets[0]:e.kind==='dilemma'?'coins':undefined);E.nextSeason(s);}else{assert.equal(h.event,undefined);assert.equal(E.pendingEvent(s),null);}
 }
 assert.equal(ids.length,4);assert.equal(s.history.length,5);assert.ok(E.validate(clone(s)));
});

test('Bola de Ouro considera gols e notas, exige 8 jogos e desempata de forma estável',()=>{
 const s=ready(),[a,b,c]=s.lineup.filter(id=>D.byId[id].pos!=='GOL');
 s.stats={a:{id:a,team:'user',g:15,a:3,apps:19,minutes:1500,ratingSum:152,clean:0},b:{id:b,team:'user',g:2,a:2,apps:19,minutes:1500,ratingSum:161.5,clean:0},c:{id:c,team:'user',g:25,a:6,apps:7,minutes:500,ratingSum:70,clean:0}};
 const ranked=E.ballRanking(s);assert.equal(ranked.length,2);assert.equal(ranked[0].id,a);assert.ok(ranked[0].awardScore>ranked[1].awardScore);
 assert.deepEqual(E.ballRanking(clone(s)),ranked);
});

test('A Escolha preserva opções no reload, entrega só a escolhida e bloqueia confirmação dupla',()=>{
 let s=ready(92);s.coins=10000;
 const before=clone(s),pack=E.openPack(s,'choice');
 assert.deepEqual(s.squad,before.squad);assert.equal(s.coins,before.coins-3500);
 assert.equal(pack.cards.length,3);assert.ok(pack.cards.every(c=>D.byId[c.id].ovr>=80&&D.byId[c.id].ovr<=85));
 assert.throws(()=>E.finishPack(s));assert.throws(()=>E.choosePackCard(s,pack.cards[0].id));assert.throws(()=>E.advanceRound(s));
 const options=clone(pack.cards);s=clone(s);assert.ok(E.validate(s));assert.deepEqual(s.pendingPack.cards,options);
 s.pendingPack.revealed=3;let snap=JSON.stringify(s);assert.throws(()=>E.choosePackCard(s,'bad'));assert.equal(JSON.stringify(s),snap);
 const chosen=options.find(c=>!c.duplicate)||options[0],coins=s.coins;
 E.choosePackCard(s,chosen.id);assert.equal(s.squad.length,before.squad.length+(chosen.duplicate?0:1));assert.equal(s.coins,coins+chosen.refund);
 for(const c of options.filter(c=>c.id!==chosen.id&&!c.duplicate))assert.ok(!s.squad.includes(c.id));
 s=clone(s);assert.ok(E.validate(s));snap=JSON.stringify(s);assert.throws(()=>E.choosePackCard(s,options[1].id));assert.equal(JSON.stringify(s),snap);
 E.finishPack(s);E.advanceRound(s);assert.equal(s.round,1);
});

test('A Escolha paga apenas a repetida confirmada e rejeita saves inconsistentes',()=>{
 const s=ready();s.squad=D.basePlayers.map(p=>p.id);s.coins=10000;
 const pack=E.openPack(s,'choice'),coins=s.coins;pack.revealed=3;E.choosePackCard(s,pack.cards[1].id);
 assert.equal(s.coins,coins+pack.cards[1].refund);assert.equal(s.squad.length,D.basePlayers.length);assert.ok(E.validate(s));
 for(const corrupt of [x=>x.pendingPack.selected='bad',x=>x.pendingPack.revealed=1,x=>x.pendingPack.mode='normal',x=>x.pendingPack.cards[0].id=D.players.at(-1).id]){const bad=clone(s);corrupt(bad);assert.equal(E.validate(bad),false);}
});

test('edição semanal cobre o campo, melhora cartas sem alterar as comuns e guarda fontes',()=>{
 assert.equal(D.weekly.cards.length,11);assert.equal(new Set(D.weekly.cards.map(p=>p.baseId)).size,11);
 for(const pos of ['GOL','LE','LD','ZAG','VOL','MC','MEI','PE','PD','ATA'])assert.ok(D.weekly.cards.some(p=>p.pos===pos));
 for(const p of D.weekly.cards){const base=D.byId[p.baseId];assert.notEqual(p.id,base.id);assert.ok(p.ovr>base.ovr);assert.ok(!base.special);assert.equal(E.tier(p),'totw');assert.match(p.source.url,/^https:\/\//);for(const k of ['vel','fin','pas','def','fis','gol'])assert.ok(p[k]>=base[k]&&p[k]<=99);}
 const gabi=D.editions.get('2026-10-03').cards.find(p=>p.name==='Gabigol'),base=D.byId[gabi.baseId];assert.equal(gabi.ovr,84);assert.equal(base.ovr,78);assert.ok(gabi.fin>base.fin&&gabi.vel>base.vel);
});

test('Time da Semana entrega uma preta, permite a comum junto e preserva IDs no save',()=>{
 const s=ready(187);s.coins=1e7;
 for(let i=0;i<100;i++){
   const pack=E.openPack(s,'totw');assert.equal(pack.edition,D.weekly.id);assert.equal(pack.cards.filter(c=>D.byId[c.id].special==='totw').length,1);
   const special=D.byId[pack.cards[0].id];assert.ok(D.weekly.cards.some(p=>p.id===special.id));
   if(!s.squad.includes(special.baseId))s.squad.push(special.baseId);
   assert.ok(s.squad.includes(special.id)&&s.squad.includes(special.baseId));assert.ok(E.validate(clone(s)));E.finishPack(s);
 }
 for(const id of ['base','silver','gold','elite','legend','choice']){s.season=5;const pack=E.openPack(s,id);assert.ok(pack.cards.every(c=>!D.byId[c.id].special));if(id==='choice'){pack.revealed=3;E.choosePackCard(s,pack.cards[0].id);}E.finishPack(s);}
 assert.ok(s.teams.filter(t=>t.id!=='user').every(t=>t.squad.every(id=>!D.byId[id].special)));
});

test('edições anteriores continuam disponíveis após a troca da semana ativa',()=>{
 const vm=require('node:vm'),fs=require('node:fs'),weekly=require('../js/weekly.js'),config=clone(weekly),oldId=D.weekly.cards[0].id;
 const next=clone(config.editions.find(e=>e.id===config.activeId));next.id='teste-proxima-semana';next.label='Próxima semana';next.players[0].boost.ovr++;config.editions.push(next);config.activeId=next.id;
 const sandbox={module:{exports:{}},require:path=>{assert.equal(path,'./weekly.js');return config;}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../js/data.js'),'utf8'),sandbox);
 const future=sandbox.module.exports;assert.equal(future.weekly.id,next.id);assert.ok(future.byId[oldId]);assert.equal(JSON.stringify(future.byId[oldId]),JSON.stringify(D.byId[oldId]));assert.ok(future.weekly.cards.every(p=>!D.weekly.cards.some(old=>old.id===p.id)));
});

test('preços novos, bloqueios e bordões por pacote/overall',()=>{
 const price=id=>D.packs.find(p=>p.id===id).price;
 assert.equal(price('elite'),4200*2);assert.equal(price('legend'),7500*3);assert.equal(price('totw'),price('elite'));assert.ok(price('gold')>1850);
 const s=ready();s.coins=1e6;assert.throws(()=>E.openPack(s,'elite'));assert.throws(()=>E.openPack(s,'legend'));
 for(const id of ['base','silver'])assert.equal(E.revealLabel({id},{ovr:85}),'XI, é bagre!');
 assert.equal(E.revealLabel({id:'gold'},{ovr:79}),'XI, é Braque!');assert.equal(E.revealLabel({id:'gold'},{ovr:80}),'XI, é Craque!');assert.equal(E.revealLabel({id:'totw'},{ovr:83}),'XI, é Craque!');
});

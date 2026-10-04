const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../js/engine.js'),D=require('../js/data.js');
const clone=s=>JSON.parse(JSON.stringify(s));
const ney=D.basePlayers.find(p=>p.name==='Neymar Jr.').id;
function club(selected=[],seed=41,extra={}){return E.createClub({name:'Selos FC',short:'SFC',slot:'bot',careerGoals:selected,...extra},seed);}
function ready(selected=[],seed=41,extra={}){const s=club(selected,seed,extra);E.openPack(s,'welcome');E.finishPack(s);return s;}
function end(s){while(s.round<19)E.advanceRound(s);return s.history.at(-1);}
function next(s){const e=E.pendingEvent(s);E.resolveSeasonEvent(s,e.kind==='choice'?e.targets.at(-1):e.kind==='dilemma'?'coins':undefined);E.nextSeason(s);}
const earned=(s,id)=>Boolean(s.careerGoals.earned[id]);

test('20 desafios únicos; só zero ou três podem iniciar uma carreira',()=>{
 assert.equal(E.careerGoalDefinitions.length,20);assert.equal(new Set(E.careerGoalDefinitions.map(g=>g.id)).size,20);
 for(const ids of [[],['scorer','coach','hundred']])assert.ok(E.validate(club(ids)));
 for(const ids of [['scorer'],['scorer','coach'],['scorer','coach','hundred','sales'],['scorer','scorer','coach'],['scorer','coach','fake']])assert.throws(()=>club(ids),/três/);
 const s=ready();s.careerStats[s.lineup[0]]={id:s.lineup[0],g:200};E.updateCareerGoals(s);assert.equal(E.careerGoalStatus(s).gold,false);
});

test('carreiras antigas carregam sem inventar objetivos ou apagar progresso',()=>{
 const s=ready();E.advanceRound(s);delete s.careerGoals;const rng=s.rng,coins=s.coins;
 assert.ok(E.validate(s));E.updateCareerGoals(s);assert.deepEqual(s.careerGoals.selected,[]);assert.equal(s.rng,rng);assert.equal(s.coins,coins);assert.ok(E.validate(s));
});

test('premiações exigem o clube certo e o capitão registrado na última rodada',()=>{
 const s=ready(['captain_ball','scorer','coach']),h=end(s),captain=h.goalSnapshot.captain;
 s.careerGoals.earned={};s.careerGoals.gold=false;
 h.scorer={...h.scorer,team:'fla'};h.ballWinner={...h.ballWinner,id:captain,team:'fla'};h.score=99;
 E.updateCareerGoals(s);assert.equal(earned(s,'captain_ball'),false);assert.equal(earned(s,'scorer'),false);assert.equal(earned(s,'coach'),false);
 h.scorer.team='user';h.ballWinner.team='user';h.score=100;
 s.captain=s.lineup.find(id=>id!==captain);E.updateCareerGoals(s);
 assert.ok(earned(s,'captain_ball'));assert.ok(earned(s,'scorer'));assert.ok(earned(s,'coach'));assert.equal(E.careerGoalStatus(s).gold,true);
 const record=clone(s.careerGoals),news=s.news.length;E.updateCareerGoals(s);assert.deepEqual(s.careerGoals,record);assert.equal(s.news.length,news);
 assert.ok(E.validate(clone(s)));
});

test('títulos são cumulativos e três conquistas liberam uma única carta permanente',()=>{
 const s=ready(['first_title','three_titles','five_titles']);
 for(let year=1;year<=5;year++){
   const h=end(s);h.position=1;E.updateCareerGoals(s);
   assert.equal(earned(s,'first_title'),true);assert.equal(earned(s,'three_titles'),year>=3);assert.equal(earned(s,'five_titles'),year>=5);
   if(year<5)next(s);
 }
 let profile=E.unlockLegacyProfile({version:1,unlocked:false,card:null},s);
 assert.ok(profile.unlocked);profile=E.createLegacyReward(profile,{name:'Miguel Craque',pos:'MEI',nation:'BR'});
 assert.ok(E.validLegacyProfile(profile));assert.equal(profile.card.ovr,88);assert.throws(()=>E.createLegacyReward(profile,{name:'Outra',pos:'ATA',nation:'BR'}));
 const other=club([],9,{legacyCard:profile.card});assert.ok(other.squad.includes(profile.card.id));assert.ok(other.bench.includes(profile.card.id));assert.ok(E.validate(other));
 assert.equal(E.careerGoalStatus(other).gold,false);assert.equal(E.unlockLegacyProfile(profile,other).card.id,profile.card.id);
 assert.throws(()=>club(['silver','hundred','sales'],7,{legacyCard:profile.card}),/prata/);
});

test('metas de fim de carreira aguardam a quinta temporada e contam todos os pacotes',()=>{
 const s=ready(['five_packs','textor','squad90']);
 // Controlled final standings isolate the goal rules from random match results.
 s.history=[{position:1},{position:1}];s.coins=0;s.packsOpened=5;s.squad=D.basePlayers.filter(p=>p.ovr>=90).map(p=>p.id);
 E.updateCareerGoals(s);assert.equal(Object.keys(s.careerGoals.earned).length,0);
 s.phase='finished';s.season=5;s.round=19;E.updateCareerGoals(s);
 assert.ok(earned(s,'five_packs'));assert.ok(earned(s,'textor'));assert.ok(earned(s,'squad90'));
 const fail=ready(['five_packs','textor','squad90']);fail.history=[{position:1},{position:1}];fail.phase='finished';fail.season=5;fail.round=19;fail.packsOpened=6;
 E.updateCareerGoals(fail);assert.equal(earned(fail,'five_packs'),false);assert.equal(earned(fail,'textor'),false);assert.equal(earned(fail,'squad90'),false);
 fail.coins=12543;assert.equal(E.settleFinalCoins(fail),12543);assert.equal(fail.coins,0);assert.equal(fail.careerGoals.baseDonation,12543);assert.ok(earned(fail,'textor'));assert.throws(()=>E.settleFinalCoins(fail));
 const initial=ready(['five_packs','textor','squad90']);assert.equal(initial.packsOpened,1);assert.throws(()=>E.settleFinalCoins(initial));
});

test('Neymar nos pacotes não conta capitão inicial nem opção recusada',()=>{
 const initial=ready(['neymar_pack','neymar_ball','neymar_scorer'],11,{captain:ney});
 initial.careerGoals.track.neymarPacked=false;initial.careerGoals.earned={};E.updateCareerGoals(initial);assert.equal(earned(initial,'neymar_pack'),false);
 const base=ready(['neymar_pack','neymar_ball','neymar_scorer']);base.careerGoals.track.neymarPacked=false;base.careerGoals.earned={};base.coins=99999;
 let offered;
 for(let rng=1;rng<5000;rng++){const s=clone(base);s.rng=rng;const p=E.openPack(s,'choice');if(p.cards.some(c=>c.id===ney)){offered=s;break;}}
 assert.ok(offered,'um pacote sorteado deve oferecer Neymar');assert.equal(earned(offered,'neymar_pack'),false);
 const refused=clone(offered);refused.pendingPack.revealed=3;E.choosePackCard(refused,refused.pendingPack.cards.find(c=>c.id!==ney).id);E.finishPack(refused);assert.equal(earned(refused,'neymar_pack'),false);
 const accepted=clone(offered);accepted.pendingPack.revealed=3;E.choosePackCard(accepted,ney);assert.ok(earned(accepted,'neymar_pack'));assert.ok(E.validate(accepted));
 let received;
 for(let rng=1;rng<5000;rng++){const s=clone(base);s.rng=rng;const p=E.openPack(s,'gold');if(p.cards.some(c=>c.id===ney)){received=s;break;}}
 assert.ok(received);assert.ok(earned(received,'neymar_pack'));
 const h=end(initial);initial.careerGoals.earned={};h.ballWinner={id:ney,team:'fla'};h.scorer={id:ney,team:'fla'};E.updateCareerGoals(initial);assert.equal(earned(initial,'neymar_ball'),false);assert.equal(earned(initial,'neymar_scorer'),false);
 h.ballWinner.team='user';h.scorer.team='user';E.updateCareerGoals(initial);assert.ok(earned(initial,'neymar_ball'));assert.ok(earned(initial,'neymar_scorer'));
});

test('TDS exige onze cartas especiais e o título usa o time do apito final',()=>{
 const s=ready(['totw_team','totw_title','square']);s.squad=[...new Set([...s.squad,...D.weekly.cards.map(p=>p.id)])];
 s.lineup=D.weekly.cards.map(p=>p.id);s.bench=s.squad.filter(id=>!s.lineup.includes(id)).slice(0,7);s.captain=s.lineup[0];
 E.updateObjectives(s);assert.ok(earned(s,'totw_team'));assert.equal(earned(s,'totw_title'),false);
 const h=end(s);assert.equal(h.goalSnapshot.allTotw,true);h.position=1;
 s.lineup[0]=s.bench[0];E.updateCareerGoals(s);assert.ok(earned(s,'totw_title'));assert.ok(earned(s,'totw_team'));
 h.goalSnapshot.fit=51;E.updateCareerGoals(s);assert.equal(earned(s,'square'),false);h.goalSnapshot.fit=50;E.updateCareerGoals(s);assert.ok(earned(s,'square'));
});

test('prata inclui reservas e snapshots não mudam quando o elenco muda após a temporada',()=>{
 const s=ready(['silver','first_title','hundred']);s.squad=D.basePlayers.filter(p=>p.ovr<80).slice(0,150).map(p=>p.id);E.optimize(s);
 const h=end(s);assert.equal(h.goalSnapshot.allSilver,true);const snapshot=clone(h.goalSnapshot);
 h.position=1;s.squad.push(D.basePlayers.find(p=>p.ovr>=90).id);E.updateCareerGoals(s);assert.ok(earned(s,'silver'));E.ensureSeason(s);assert.deepEqual(h.goalSnapshot,snapshot);
 const other=ready(['silver','first_title','hundred']);other.squad=D.basePlayers.filter(p=>p.ovr<80).map(p=>p.id);other.squad.push(D.basePlayers.find(p=>p.ovr>=90).id);E.optimize(other);const x=end(other);x.position=1;E.updateCareerGoals(other);assert.equal(x.goalSnapshot.allSilver,false);assert.equal(earned(other,'silver'),false);
});

test('extras acumulam gols, vendas, goleadas e sequências sem premiar derrotas',()=>{
 const s=ready(['big_win','streak','hundred']);s.careerGoals.track.bestStreak=4;s.careerGoals.track.biggestWin=3;
 s.careerStats[s.lineup[0]]={id:s.lineup[0],g:99};E.updateCareerGoals(s);assert.equal(Object.keys(s.careerGoals.earned).length,0);
 s.careerGoals.track.bestStreak=5;s.careerGoals.track.biggestWin=4;s.careerStats[s.lineup[0]].g=100;E.updateCareerGoals(s);assert.equal(Object.keys(s.careerGoals.earned).length,3);
 const sales=ready(['sales','hundred','first_title']);sales.squad=[...new Set([...sales.squad,...D.basePlayers.slice(0,30).map(p=>p.id)])];
 for(const id of [...sales.squad])if(!E.saleReason(sales,id)&&sales.sales<10)E.sell(sales,id);
 assert.equal(sales.sales,10);assert.ok(earned(sales,'sales'));assert.ok(E.validate(sales));
 // Compare accumulated streaks against every actual simulated score.
 const actual=ready(['big_win','streak','hundred']);let streak=0,best=0,margin=0;
 for(let year=1;year<=2;year++){
   for(let r=0;r<19;r++){const m=E.advanceRound(actual),d=m.home==='user'?m.hg-m.ag:m.ag-m.hg;streak=d>0?streak+1:0;best=Math.max(best,streak);margin=Math.max(margin,d);assert.equal(actual.careerGoals.track.streak,streak);assert.equal(actual.careerGoals.track.bestStreak,best);assert.equal(actual.careerGoals.track.biggestWin,margin);}
   if(year<2)next(actual);
 }
});

test('lenda sobrevive aos 16 eventos, vendas, banco, reload e exportação',()=>{
 const card=E.makeLegacyCard({name:'Lenda da Resenha',pos:'ATA',nation:'BR'},'legacy-test-protected'),seen=new Set();
 for(let seed=1;seed<=240&&seen.size<16;seed++){
   let s=ready(['first_title','sales','hundred'],seed,{legacyCard:card});E.optimize(s);const slot=s.lineup.findIndex(id=>D.byId[id].pos==='ATA');E.swap(s,slot,card.id);s.captain=card.id;
   assert.throws(()=>E.sell(s,card.id),/permanente/);end(s);const e=E.pendingEvent(s);if(seen.has(e.id))continue;seen.add(e.id);
   assert.ok(!e.targets.includes(card.id),e.id);s=clone(s);delete D.byId[card.id];assert.ok(E.validate(s));assert.ok(D.byId[card.id]);
   E.resolveSeasonEvent(s,e.kind==='choice'?e.targets[0]:e.kind==='dilemma'?'player':undefined);
   assert.ok(s.squad.includes(card.id),e.id);assert.ok(!s.retiredPlayers?.includes(card.id));assert.ok(E.validate(s));E.nextSeason(s);assert.ok(s.squad.includes(card.id));
 }
 assert.equal(seen.size,16);assert.ok(!D.basePlayers.some(p=>p.id===card.id));assert.ok(!D.weekly.cards.some(p=>p.id===card.id));
});

test('save rejeita selos e cartas inválidos, mantém antigos e não contamina o catálogo',()=>{
 const s=ready(['scorer','coach','hundred']);assert.ok(E.validate(s));
 for(const change of [x=>x.careerGoals.selected=['scorer'],x=>x.careerGoals.gold=true,x=>x.careerGoals.track.streak=-1,x=>x.careerGoals.earned.scorer={season:6,round:19},x=>x.careerGoals.earned.fake={season:1,round:0}]){const bad=clone(s);change(bad);assert.equal(E.validate(bad),false);}
 const card=E.makeLegacyCard({name:'Meu craque',pos:'GOL',nation:'BR'},'legacy-test-validate');
 const good=ready([],8,{legacyCard:card});assert.ok(E.validate(good));
 const bad=clone(good);bad.legacyCard.ovr=99;assert.equal(E.validate(bad),false);assert.equal(D.byId[card.id].ovr,88);
 const missing=clone(good);delete missing.legacyCard;assert.equal(E.validate(missing),false);
 assert.throws(()=>E.createLegacyReward({version:1,unlocked:false,card:null},{name:'Teste',pos:'MEI',nation:'BR'}));
 assert.equal(E.validLegacyProfile({version:1,unlocked:false,card}),false);
});

test('avaliação 100 é atingível por uma temporada perfeita com elenco elite',()=>{
 const s=ready(['coach','first_title','hundred']);s.squad=D.basePlayers.filter(p=>p.ovr>=88).map(p=>p.id);E.optimize(s);
 for(let r=0;r<18;r++)E.advanceRound(s);
 // Search only the final match's seeded randomness until the user wins;
 // the table fixture models 18 wins, so 57 points is a perfect season.
 let final;
 for(let rng=1;rng<=200;rng++){
   const candidate=clone(s);candidate.rng=rng;
   candidate.table.forEach(row=>{row.played=18;row.w=row.id==='user'?18:0;row.d=0;row.l=row.id==='user'?0:18;row.pts=row.w*3;});
   const match=E.advanceRound(candidate);if((match.home==='user'?match.hg>match.ag:match.ag>match.hg)){final=candidate;break;}
 }
 assert.ok(final);assert.equal(final.history[0].score,100);assert.ok(earned(final,'coach'));
});

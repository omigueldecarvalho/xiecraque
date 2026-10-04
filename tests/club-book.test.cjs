const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../js/engine.js'),D=require('../js/data.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const options={name:'Resenha FC',short:'RFC',slot:'bot',rival:'fla'};
function ready(seed=42,extra={}){const s=E.createClub({...options,...extra},seed);E.openPack(s,'welcome');E.finishPack(s);return s;}
function season(s){while(s.round<19)E.advanceRound(s);return s.history.at(-1);}
function next(s){const e=E.pendingEvent(s);E.resolveSeasonEvent(s,e.kind==='choice'?e.targets[0]:e.kind==='dilemma'?'coins':undefined);E.nextSeason(s);}
function complete(seed=42){const s=ready(seed);for(let year=1;year<=5;year++){season(s);if(year<5)next(s);}return s;}
const stat=(id,overrides={})=>({id,g:0,a:0,apps:1,minutes:90,ratingSum:7,clean:0,...overrides});

test('rival é um dos 19 adversários e fica fixo durante a carreira',()=>{
 assert.throws(()=>E.createClub({...options,rival:'bot'}),/19 adversários/);
 assert.throws(()=>E.createClub({...options,rival:'inexistente'}),/19 adversários/);
 const s=ready();assert.equal(s.lore.rivalId,'fla');assert.throws(()=>E.declareRival(s,'pal'),/fixo/);assert.ok(E.validate(s));
});
test('rivalidade registra os cinco clássicos, placares e gols sem duplicar após reload',()=>{
 let s=ready(),expected=[];
 for(let year=1;year<=5;year++){
   while(s.round<19){const m=E.advanceRound(s);if(E.isDerby(s,m))expected.push({season:year,round:m.round,gf:m.home==='user'?m.hg:m.ag,ga:m.home==='user'?m.ag:m.hg});s=clone(s);assert.ok(E.validate(s));}
   assert.equal(s.lore.derbies.length,year);assert.deepEqual(s.history.at(-1).derby,s.lore.derbies.at(-1));assert.ok(Array.isArray(s.history.at(-1).nicknames));
   if(year<5)next(s);
 }
 assert.deepEqual(s.lore.derbies.map(({season,round,gf,ga})=>({season,round,gf,ga})),expected);
 const r=E.rivalryStats(s);assert.equal(r.matches,5);assert.equal(r.wins+r.draws+r.losses,5);assert.equal(r.gf,expected.reduce((n,m)=>n+m.gf,0));
 for(const m of s.lore.derbies)assert.equal(m.scorers.length,m.gf);
});
test('rival, apelidos e álbum não mudam sorteios nem resultados da simulação',()=>{
 const a=ready(812),b=ready(812,{rival:null});
 for(let i=0;i<19;i++){assert.deepEqual(E.advanceRound(a),E.advanceRound(b));assert.equal(a.rng,b.rng);}
 assert.deepEqual(a.table,b.table);assert.deepEqual(a.stats,b.stats);
});
test('save antigo recupera cartas identificadas e pode declarar rival uma vez',()=>{
 const old=ready(17,{rival:null});for(let i=0;i<5;i++)E.advanceRound(old);delete old.lore;
 const a=clone(old),b=clone(old);assert.ok(E.validate(a));E.ensureClubLore(a);E.ensureClubLore(b);assert.equal(a.lore.id,b.lore.id);
 assert.ok(a.squad.every(id=>a.lore.collected[id]?.source==='recovered'));
 const match=a.results[0].find(m=>m.home==='user'||m.away==='user'),rival=match.home==='user'?match.away:match.home;
 E.declareRival(a,rival);assert.equal(a.lore.derbies.length,1);assert.equal(a.lore.derbies[0].round,1);assert.throws(()=>E.declareRival(a,rival));assert.ok(E.validate(a));
});
test('álbum recebe apenas as cartas creditadas e continua após venda e nova carreira',()=>{
 const s=ready();assert.equal(Object.keys(s.lore.collected).length,3);assert.ok(Object.values(s.lore.collected).every(x=>x.packId==='welcome'));
 s.coins=100000;const before=clone(s.lore.collected),pack=E.openPack(s,'choice');assert.deepEqual(s.lore.collected,before);
 const selected=pack.cards[1];pack.revealed=3;E.choosePackCard(s,selected.id);E.finishPack(s);assert.ok(s.lore.collected[selected.id]);
 for(const p of pack.cards.filter(p=>p.id!==selected.id))assert.equal(Boolean(s.lore.collected[p.id]),Boolean(before[p.id]));
 let book=E.syncClubBook(E.newClubBook(),s).book;const owned=Object.keys(book.album);assert.ok(E.validClubBook(book));
 const sold=s.squad.find(id=>book.album[id]&&!E.saleReason(s,id));if(sold){E.sell(s,sold);book=E.syncClubBook(book,s).book;assert.ok(book.album[sold]);}
 const other=ready(992);const oldSquad=[...other.squad];book=E.syncClubBook(book,other).book;assert.ok(owned.every(id=>book.album[id]));assert.deepEqual(other.squad,oldSquad);assert.ok(E.validClubBook(book));
});
test('álbum inclui repetidas e separa versões comuns, TDS e edições antigas',()=>{
 const s=ready();s.coins=1e6;s.squad=D.players.map(p=>p.id);E.openPack(s,'totw');const pending=clone(s.pendingPack);assert.ok(pending.cards.every(c=>c.duplicate));
 let book=E.syncClubBook(E.newClubBook(),s).book;assert.ok(pending.cards.every(c=>book.album[c.id]));const special=D.byId[pending.cards[0].id];
 E.finishPack(s);E.openPack(s,'gold');assert.ok(s.lore.collected[special.id]);assert.equal(D.byId[special.baseId].special,undefined);
 const archived=clone(book.album[special.id]);archived.player.id='totw-archived-card';book.album[archived.player.id]=archived;
 assert.ok(E.validClubBook(book));assert.ok(E.albumCatalog(book).some(p=>p.id==='totw-archived-card'));
 const again=E.syncClubBook(book,s).book;assert.equal(new Set(Object.keys(again.album)).size,Object.keys(again.album).length);
});
test('apelidos respeitam limiares, ficam na carreira e priorizam títulos positivos',()=>{
 const s=ready(),gk=s.lineup.find(id=>D.byId[id].pos==='GOL'),field=s.lineup.find(id=>D.byId[id].pos!=='GOL');
 s.careerStats[gk]=stat(gk,{clean:4,apps:4});s.careerStats[field]=stat(field,{a:4,g:19,apps:49});E.updateNicknames(s);
 assert.equal(E.playerNicknames(s,gk).length,0);assert.equal(E.playerNicknames(s,field).length,0);
 s.careerStats[gk].clean=5;s.careerStats[field].a=5;s.careerStats[field].g=20;s.careerStats[field].apps=50;
 s.lore.derbies=[{season:1,round:1,home:true,gf:3,ga:0,scorers:[field,field,field]}];E.updateNicknames(s);
 assert.equal(E.playerNicknames(s,gk)[0].name,'Paredão');assert.equal(E.playerNicknames(s,field)[0].name,'Rei dos Clássicos');assert.equal(E.playerNicknames(s,field).length,4);
 const saved=clone(s.lore.nicknames),news=s.news.length;E.updateNicknames(s);assert.deepEqual(s.lore.nicknames,saved);assert.equal(s.news.length,news);
 delete s.careerStats[field];assert.equal(E.playerNicknames(s,field).length,4);assert.equal(E.playerNicknames(ready(45),field).length,0);
});
test('Craque do Treino só sai no encerramento e exige posição, jogos e minutos',()=>{
 const s=ready(),p=D.basePlayers.find(p=>p.pos==='ATA'&&p.ovr>=85);s.stats['user:'+p.id]={...stat(p.id,{apps:8,minutes:450,g:1}),team:'user'};
 E.updateNicknames(s);assert.equal(E.playerNicknames(s,p.id).length,0);
 s.round=19;s.phase='seasonEnd';s.stats['user:'+p.id].minutes=449;E.updateNicknames(s);assert.equal(E.playerNicknames(s,p.id).length,0);
 s.stats['user:'+p.id].minutes=450;E.updateNicknames(s);assert.equal(E.playerNicknames(s,p.id)[0].name,'Craque do Treino');
 s.careerStats[p.id]=stat(p.id,{g:20});E.updateNicknames(s);assert.equal(E.playerNicknames(s,p.id)[0].name,'Matador');
});
test('Hall só arquiva carreira completa; reload e importação não duplicam',()=>{
 const active=ready();season(active);let book=E.syncClubBook(E.newClubBook(),active).book;assert.equal(Object.keys(book.careers).length,0);
 const s=complete(),first=E.syncClubBook(book,s);assert.ok(first.archived);assert.ok(first.newRecords.length);assert.equal(Object.keys(first.book.careers).length,1);assert.ok(E.validClubBook(first.book));
 const again=E.syncClubBook(first.book,clone(s));assert.equal(again.archived,false);assert.deepEqual(again.newRecords,[]);assert.deepEqual(again.book,first.book);
 const imported=E.mergeClubBooks(first.book,clone(first.book));assert.equal(Object.keys(imported.careers).length,1);
 const other=complete(99);assert.notEqual(other.lore.id,s.lore.id);book=E.syncClubBook(imported,other).book;assert.equal(Object.keys(book.careers).length,2);assert.ok(E.validClubBook(book));
 for(const record of E.hallRecords(book))assert.equal(record.value,Math.max(...Object.values(book.careers).map(c=>c[record.id])));
});
test('novos recordes exigem superar a marca e resumos atualizam selos sem duplicação',()=>{
 const s=complete(13),first=E.syncClubBook(E.newClubBook(),s).book,row=first.careers[s.lore.id];
 const same=clone(s);same.lore.id+='-next';const result=E.syncClubBook(first,same);assert.deepEqual(result.newRecords,[]);assert.ok(result.archived);
 assert.equal(row.titles,E.career(s).titles);assert.equal(row.rivalWins,E.rivalryStats(s).wins);assert.equal(row.positions.length,5);
 const upgraded=clone(first);upgraded.careers[row.id].badges=3;upgraded.careers[row.id].gold=true;
 const merged=E.mergeClubBooks(upgraded,first);assert.equal(merged.careers[row.id].badges,3);assert.ok(merged.careers[row.id].gold);
 const restored=E.syncClubBook(merged,s).book;assert.equal(restored.careers[row.id].badges,3);assert.ok(restored.careers[row.id].gold);
});
test('álbum e Hall rejeitam backups malformados sem aplicar dados parciais',()=>{
 const s=complete(73),book=E.syncClubBook(E.newClubBook(),s).book,id=Object.keys(book.album)[0],career=s.lore.id;
 for(const change of [b=>b.version=99,b=>b.album[id].player.ovr=100,b=>b.album[id].source='hacked',b=>b.careers[career].positions=[],b=>b.careers[career].score=101,b=>b.careers[career].club.color='red']){const bad=clone(book);change(bad);assert.equal(E.validClubBook(bad),false);}
 for(const change of [x=>x.lore.rivalId=x.club.slot,x=>x.lore.nicknames.fake={},x=>x.lore.collected.fake={season:1,round:1,source:'pack',packId:'gold'},x=>x.lore.derbies.push(clone(x.lore.derbies[0]))]){const bad=clone(s);change(bad);assert.equal(E.validate(bad),false);}
 assert.ok(E.validClubBook(book));assert.ok(E.validate(s));
});

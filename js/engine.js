(function(root){
'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./data.js'):root.OuroData;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const copy=x=>JSON.parse(JSON.stringify(x));
function random(s){let t=s.rng=(s.rng+0x6D2B79F5)>>>0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function pick(s,list){if(!list.length)throw Error('Lista de jogadores indisponível.');return list[Math.floor(random(s)*list.length)];}
function shuffle(s,list){let a=[...list];for(let i=a.length-1;i>0;i--){let j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function weighted(s,list,weight){const total=list.reduce((a,p)=>a+weight(p),0);let r=random(s)*total;return list.find(p=>(r-=weight(p))<0)??list[list.length-1];}
function poisson(s,lambda){const l=Math.exp(-lambda);let k=0,p=1;do{k++;p*=random(s);}while(p>l&&k<12);return Math.min(9,k-1);}
function fit(player,slot){if(!player)return 0;if(player.pos===slot)return 1;if(player.pos==='GOL'||slot==='GOL')return .22;
 const groups=[['MC','VOL','MEI'],['PE','PD'],['LE','LD'],['ATA','PE','PD'],['ZAG','VOL'],['ZAG','LE','LD']];
 for(let i=0;i<groups.length;i++)if(groups[i].includes(player.pos)&&groups[i].includes(slot))return [ .91,.94,.91,.84,.83,.83][i];
 if(['PE','PD'].includes(player.pos)&&slot==='MEI'||player.pos==='MEI'&&['PE','PD'].includes(slot))return .88;
 return .67;
}
function autoLineup(ids,formation){
 const slots=D.formations[formation],n=slots.length,m=ids.length;
 if(m<n)throw Error('O elenco precisa de pelo menos 11 jogadores.');
 // Hungarian assignment: maximize total effective quality, preserving scarce roles.
 const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
 for(let i=1;i<=n;i++){p[0]=i;let j0=0,minv=Array(m+1).fill(Infinity),used=Array(m+1).fill(false);
  do{used[j0]=true;let i0=p[j0],delta=Infinity,j1=0;
   for(let j=1;j<=m;j++)if(!used[j]){const player=D.byId[ids[j-1]],cur=-player.ovr*fit(player,slots[i0-1][0])-u[i0]-v[j];if(cur<minv[j]){minv[j]=cur;way[j]=j0;}if(minv[j]<delta){delta=minv[j];j1=j;}}
   for(let j=0;j<=m;j++)if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else minv[j]-=delta;j0=j1;
  }while(p[j0]!==0);
  do{let j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0!==0);
 }
 const lineup=Array(n);for(let j=1;j<=m;j++)if(p[j])lineup[p[j]-1]=ids[j-1];
 const remaining=ids.filter(id=>!lineup.includes(id)).sort((a,b)=>D.byId[b].ovr-D.byId[a].ovr),gk=remaining.find(id=>D.byId[id].pos==='GOL');
 const bench=remaining.filter(id=>D.byId[id].pos!=='GOL').slice(0,gk?6:7);if(gk)bench.push(gk);
 return {lineup,bench};
}
function optimize(s){Object.assign(s,autoLineup(s.squad,s.formation));if(!s.lineup.includes(s.captain))s.captain=s.lineup.find(id=>D.byId[id].pos!=='GOL');}
function value(p){return Math.round((35+Math.pow(p.ovr-62,2)*.68)/10)*10;}
function tier(p){return p.special==='totw'?'totw':p.ovr>=88?'elite':p.ovr>=80?'gold':p.ovr>=75?'silver':'bronze';}
function revealLabel(pack,p){return ['base','silver'].includes(pack.id)?'XI, é bagre!':p.ovr<80?'XI, é Braque!':'XI, é Craque!';}
function packPool(s,pack){return D.basePlayers.filter(p=>(!pack.positions||pack.positions.includes(p.pos))&&(!pack.max||p.ovr<=pack.max)&&!s.retiredPlayers?.includes(p.id));}
function createClub(options,seed){
 const s={version:1,rng:(seed===undefined?Date.now():seed)>>>0,club:{name:String(options.name||'Meu Clube').trim().slice(0,26),short:String(options.short||'MFC').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3)||'MFC',color:/^#[0-9a-f]{6}$/i.test(options.color)?options.color:'#b8f36b',secondary:/^#[0-9a-f]{6}$/i.test(options.secondary)?options.secondary:'#132722',slot:D.teams.some(t=>t.id===options.slot)?options.slot:'bot'},starter:options.starter||'balanced',squad:[],lineup:[],bench:[],captain:D.captains.includes(options.captain)?options.captain:D.captains[0],formation:'4-3-3',tactic:'balanced',coins:1200,season:1,round:0,history:[],careerStats:{},stats:{},news:[],results:[],objectives:[],packsOpened:0,sales:0,coinsEarned:0,seasonWins:0,seasonGoals:0,pendingPack:null,welcomeOpened:false,phase:'active',lastMatch:null};
 s.squad.push(s.captain);
 const positions=['GOL','LE','ZAG','ZAG','LD','MC','VOL','MC','PE','ATA','PD','GOL','ZAG','LE','VOL','MEI','PD','ATA'];
 // The captain fills a compatible starting slot, preserving a full 18-player squad.
 let capPos=D.byId[s.captain].pos;let capSlot=positions.indexOf(capPos);if(capSlot<0)capSlot=positions.indexOf('MC');positions.splice(capSlot,1);
 for(const pos of positions){let upper=75;if(s.starter==='attack'&&['ATA','PE','PD'].includes(pos))upper=77;if(s.starter==='defense'&&['GOL','ZAG','LE','LD','VOL'].includes(pos))upper=77;
 let pool=D.basePlayers.filter(p=>p.pos===pos&&p.ovr>=68&&p.ovr<=upper&&!s.squad.includes(p.id));s.squad.push(pick(s,pool).id);}
 optimize(s);s.captain=options.captain&&D.captains.includes(options.captain)?options.captain:s.captain;
 if(!s.lineup.includes(s.captain)){const pos=D.byId[s.captain].pos;let index=D.formations[s.formation].map((x,i)=>({i,f:fit(D.byId[s.captain],x[0])})).sort((a,b)=>b.f-a.f)[0].i;s.lineup[index]=s.captain;s.bench=s.squad.filter(id=>!s.lineup.includes(id)).slice(0,7);}
 startSeason(s);addNews(s,'Nasce uma nova história',s.club.name+' estreia na liga. O primeiro pacote 80+ já está esperando por você.','club');return s;
}
function schedule(s,ids){let ring=shuffle(s,ids),rounds=[],order=new Map(ring.map((id,i)=>[id,i]));
 for(let r=0;r<ids.length-1;r++){let matches=[];for(let i=0;i<ring.length/2;i++){let a=ring[i],b=ring[ring.length-1-i],distance=(order.get(b)-order.get(a)+ids.length)%ids.length;
  if(distance>ids.length/2||(distance===ids.length/2&&order.get(a)>order.get(b)))[a,b]=[b,a];matches.push({home:a,away:b});}
  rounds.push(matches);ring=[ring[0],ring.at(-1),...ring.slice(1,-1)];}
 return rounds;
}
function makeAITeam(s,t){const formation=pick(s,Object.keys(D.formations)),target=clamp(t.rating+(s.season-1)*1.25,70,88),squad=[];
 for(const [pos]of D.formations[formation]){let pool=D.basePlayers.filter(p=>p.pos===pos&&!squad.includes(p.id)&&Math.abs(p.ovr-target)<5);if(!pool.length)pool=D.basePlayers.filter(p=>p.pos===pos&&!squad.includes(p.id));squad.push(pick(s,pool).id);}
 const lineup=[...squad];for(const pos of ['GOL','ZAG','LE','VOL','MEI','PD','ATA']){let pool=D.basePlayers.filter(p=>p.pos===pos&&!squad.includes(p.id)&&Math.abs(p.ovr-(target-2))<6);if(!pool.length)pool=D.basePlayers.filter(p=>p.pos===pos&&!squad.includes(p.id));squad.push(pick(s,pool).id);}
 return {...t,squad,lineup,bench:squad.slice(11),formation,tactic:pick(s,Object.keys(D.tactics)),captain:lineup[9]};
}
function startSeason(s){s.round=0;s.phase='active';s.stats={};s.results=[];s.lastMatch=null;s.seasonWins=0;s.seasonGoals=0;
 s.teams=D.teams.map(t=>t.id===s.club.slot?{id:'user',...s.club}:makeAITeam(s,t));s.fixtures=schedule(s,s.teams.map(t=>t.id));s.table=s.teams.map(t=>({id:t.id,played:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,form:[]}));
 s.objectives=[{id:'play',title:'Entrar em campo',detail:'Dispute 3 partidas',target:3,progress:0,reward:650,claimed:false},{id:'wins',title:'Mentalidade vencedora',detail:'Vença 5 partidas',target:5,progress:0,reward:1600,claimed:false},{id:'goals',title:'Ataque de respeito',detail:'Marque 20 gols',target:20,progress:0,reward:1800,claimed:false},{id:'squad',title:'Subir o nível',detail:'Alcance 80 de força no time titular',target:80,progress:0,reward:1300,claimed:false}];updateObjectives(s);
}
function team(s,id){return id==='user'?{id:'user',...s.club,lineup:s.lineup,bench:s.bench,formation:s.formation,tactic:s.tactic,captain:s.captain,squad:s.squad}:s.teams.find(t=>t.id===id);}
function metrics(t){let vals=t.lineup.map((id,i)=>{const p=D.byId[id],slot=D.formations[t.formation][i][0],f=fit(p,slot);return {p,slot,f};});const average=(set,key)=>mean(set.map(x=>x.p[key]*x.f));
 const attack=vals.filter(x=>['ATA','PE','PD','MEI'].includes(x.slot)),mid=vals.filter(x=>['MC','VOL','MEI'].includes(x.slot)),def=vals.filter(x=>['LE','LD','ZAG','VOL'].includes(x.slot));
 const cap=t.lineup.includes(t.captain)?1:0,depth=mean((t.bench||[]).map(id=>D.byId[id].ovr));
 return {overall:Math.round(mean(vals.map(x=>x.p.ovr*x.f))),attack:average(attack,'fin')*.65+average(attack,'vel')*.2+average(mid,'pas')*.15+cap,mid:average(mid,'pas')*.75+average(mid,'fis')*.25+cap,defense:average(def,'def')*.65+average(def,'fis')*.35+cap,keeper:vals[0].p.gol*vals[0].f,speed:average(attack,'vel'),physical:average(vals.slice(1),'fis'),fit:Math.round(mean(vals.map(x=>x.f))*100),depth};
}
function expected(a,b,home){let m=metrics(a),n=metrics(b);let attacking=m.attack*.72+m.mid*.28;let defending=n.defense*.74+n.keeper*.26;
 let lambda=1.24*Math.exp((attacking-defending)/35)*(home?1.13:1);
 if(a.tactic==='possession')lambda*=clamp(1+(m.mid-72)/170,.94,1.12);
 if(a.tactic==='counter')lambda*=clamp(.94+(m.speed-72)/170,.9,1.1)*(b.tactic==='press'?1.14:1);
 if(a.tactic==='press')lambda*=clamp(1.07+(m.physical-70)/220,1,1.18);
 if(b.tactic==='press')lambda*=1.12;if(b.tactic==='counter')lambda*=.94;
 lambda*=1+(m.depth-74)/420;return clamp(lambda,.25,3.6);
}
function preview(s){const fixture=s.fixtures[s.round]?.find(f=>f.home==='user'||f.away==='user');if(!fixture)return null;
 const home=team(s,fixture.home),away=team(s,fixture.away),a=expected(home,away,true),b=expected(away,home,false);let hw=0,draw=0,aw=0;
 function prob(k,l){let v=Math.exp(-l);for(let i=1;i<=k;i++)v*=l/i;return v;}
 for(let i=0;i<14;i++)for(let j=0;j<14;j++){const p=prob(i,a)*prob(j,b);if(i>j)hw+=p;else if(i<j)aw+=p;else draw+=p;}
 return {fixture,home,away,homeXG:a,awayXG:b,win:Math.round((fixture.home==='user'?hw:aw)*100),draw:Math.round(draw*100),loss:Math.round((fixture.home==='user'?aw:hw)*100)};
}
function ranked(s){return [...s.table].sort((a,b)=>b.pts-a.pts||b.w-a.w||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id));}
function participants(s,t){let list=t.lineup.map((id,i)=>({id,slot:D.formations[t.formation][i][0],from:0,to:90})),used=new Set();
 let candidates=list.map((p,i)=>({i,p})).filter(x=>x.i>0).sort((a,b)=>D.byId[a.p.id].fis-D.byId[b.p.id].fis);
 for(const {i,p} of candidates){if(used.size>=3)break;let available=(t.bench||[]).filter(id=>!used.has(id)&&D.byId[id].pos!=='GOL'&&fit(D.byId[id],p.slot)>=.84);available.sort((a,b)=>D.byId[b].ovr*fit(D.byId[b],p.slot)-D.byId[a].ovr*fit(D.byId[a],p.slot));let sub=available[0];if(!sub||D.byId[sub].ovr*fit(D.byId[sub],p.slot)<D.byId[p.id].ovr*fit(D.byId[p.id],p.slot)-13)continue;let minute=61+Math.floor(random(s)*17);list[i].to=minute;list.push({id:sub,slot:p.slot,from:minute,to:90,replaces:p.id});used.add(sub);}
 return list;
}
function scoreWeight(p){return ({ATA:8,PE:4.2,PD:4.2,MEI:3,MC:1.4,VOL:.65,LE:.4,LD:.4,ZAG:.35,GOL:.001}[p.slot])*Math.pow(D.byId[p.id].fin/70,2);}
function assistWeight(p){return ({ATA:1.8,PE:4,PD:4,MEI:5,MC:4,VOL:2,LE:2,LD:2,ZAG:.3,GOL:.01}[p.slot])*(D.byId[p.id].pas/70);}
function addStats(s,t,people,events,goalsFor,goalsAgainst){return people.map(person=>{const own=events.filter(e=>e.team===t.id);const g=own.filter(e=>e.scorer===person.id).length,a=own.filter(e=>e.assist===person.id).length,minutes=person.to-person.from;
 const rating=clamp(6.2+(goalsFor>goalsAgainst?.5:goalsFor<goalsAgainst?-.35:0)+g*.85+a*.45+(goalsAgainst===0&&['GOL','ZAG','LE','LD'].includes(person.slot)?.65:0)+(random(s)-.5)*.7,4,10);
 const key=t.id+':'+person.id;const row=s.stats[key]||(s.stats[key]={id:person.id,team:t.id,g:0,a:0,apps:0,minutes:0,ratingSum:0,clean:0});row.g+=g;row.a+=a;row.apps++;row.minutes+=minutes;row.ratingSum+=rating;if(!goalsAgainst)row.clean++;
 if(t.id==='user'){const cr=s.careerStats[person.id]||(s.careerStats[person.id]={id:person.id,g:0,a:0,apps:0,minutes:0,ratingSum:0,clean:0});cr.g+=g;cr.a+=a;cr.apps++;cr.minutes+=minutes;cr.ratingSum+=rating;if(!goalsAgainst)cr.clean++;}
 return {...person,g,a,rating:Math.round(rating*10)/10,team:t.id};});}
function simulate(s,fixture){const h=team(s,fixture.home),a=team(s,fixture.away),hx=expected(h,a,true),ax=expected(a,h,false),hg=poisson(s,hx),ag=poisson(s,ax),events=[],hp=participants(s,h),ap=participants(s,a);
 for(const [t,people,goals]of [[h,hp,hg],[a,ap,ag]])for(let j=0;j<goals;j++){let minute=1+Math.floor(random(s)*90);let active=people.filter(p=>minute>p.from&&minute<=p.to);let scorer=weighted(s,active,scoreWeight);let assist=random(s)<.81?weighted(s,active.filter(p=>p.id!==scorer.id),assistWeight).id:null;events.push({minute,team:t.id,scorer:scorer.id,assist,type:pick(s,['Finalização dentro da área','Ataque bem trabalhado','Bola na rede','Conclusão precisa','Aproveitou o espaço'])});}
 events.sort((x,y)=>x.minute-y.minute);const ratings=[...addStats(s,h,hp,events,hg,ag),...addStats(s,a,ap,events,ag,hg)];const best=[...ratings].sort((x,y)=>y.rating-x.rating||y.g-x.g)[0];
 const hm=metrics(h),am=metrics(a),possession=clamp(Math.round(50+(hm.mid-am.mid)*.5+(h.tactic==='possession'?5:0)-(a.tactic==='possession'?5:0)+(random(s)-.5)*8),28,72);
 return {...fixture,hg,ag,round:s.round+1,season:s.season,events,ratings,motm:best,subs:[...hp.map(p=>({...p,team:h.id})),...ap.map(p=>({...p,team:a.id}))].filter(p=>p.from),xg:[+hx.toFixed(2),+ax.toFixed(2)],shots:[Math.max(hg,Math.round(5+hx*4+random(s)*4)),Math.max(ag,Math.round(5+ax*4+random(s)*4))],possession:[possession,100-possession]};
}
function updateTable(s,m){let h=s.table.find(t=>t.id===m.home),a=s.table.find(t=>t.id===m.away);h.played++;a.played++;h.gf+=m.hg;h.ga+=m.ag;a.gf+=m.ag;a.ga+=m.hg;
 if(m.hg>m.ag){h.w++;a.l++;h.pts+=3;h.form.push('V');a.form.push('D');}else if(m.hg<m.ag){a.w++;h.l++;a.pts+=3;h.form.push('D');a.form.push('V');}else{h.d++;a.d++;h.pts++;a.pts++;h.form.push('E');a.form.push('E');}}
function addNews(s,title,text,kind='league'){s.news.unshift({title,text,kind,season:s.season,round:s.round});s.news=s.news.slice(0,40);}
function earnings(s,amount){s.coins+=amount;s.coinsEarned+=amount;}
function updateObjectives(s){for(const o of s.objectives){o.progress=o.id==='play'?s.round:o.id==='wins'?s.seasonWins:o.id==='goals'?s.seasonGoals:metrics(team(s,'user')).overall;}}
function claim(s,id){updateObjectives(s);const o=s.objectives.find(o=>o.id===id);if(!o||o.claimed||o.progress<o.target)throw Error('Este objetivo ainda não está disponível.');o.claimed=true;earnings(s,o.reward);return o.reward;}
function advanceRound(s){if(s.phase!=='active')throw Error('A temporada já terminou.');if(!s.welcomeOpened)throw Error('Abra seu pacote de boas-vindas antes da estreia.');if(s.pendingPack)throw Error('Conclua a abertura do pacote.');if(s.lineup.length!==11||new Set(s.lineup).size!==11||s.lineup.some(id=>!s.squad.includes(id)))throw Error('Complete os 11 titulares para jogar.');
 let matches=s.fixtures[s.round].map(f=>simulate(s,f));matches.forEach(m=>updateTable(s,m));s.results.push(matches);s.round++;
 const m=matches.find(m=>m.home==='user'||m.away==='user'),home=m.home==='user',gf=home?m.hg:m.ag,ga=home?m.ag:m.hg;const won=gf>ga;let reward=350+(won?450:gf===ga?180:0)+Math.min(gf,5)*60;
 s.seasonWins+=won?1:0;s.seasonGoals+=gf;earnings(s,reward);m.reward=reward;s.lastMatch=m;updateObjectives(s);
 const opp=team(s,home?m.away:m.home),rank=ranked(s).findIndex(t=>t.id==='user')+1;let headline=won?(gf-ga>=3?'Uma atuação para guardar':'Três pontos na conta'):gf===ga?'Tudo igual no apito final':'Hora de reorganizar o time';
 let top=m.ratings.filter(p=>p.team==='user').sort((a,b)=>b.rating-a.rating)[0];addNews(s,headline,`${s.club.name} ${gf} × ${ga} ${opp.name}. ${D.byId[top.id].name} recebeu nota ${top.rating.toFixed(1)}. O clube está em ${rank}º lugar.`,'match');
 if(s.round%4===0){const leader=ranked(s)[0];addNews(s,'A briga pela taça',`${team(s,leader.id).name} lidera com ${leader.pts} pontos. Ainda restam ${19-s.round} rodadas.`);}
 if(s.round===19)finishSeason(s);return m;
}
function leaders(s,key='g'){return Object.values(s.stats).filter(p=>p[key]>0).sort((a,b)=>b[key]-a[key]||(key==='g'?b.a-a.a:b.g-a.g)||a.minutes-b.minutes);}
function coachScore(s){const row=s.table.find(t=>t.id==='user'),position=ranked(s).findIndex(t=>t.id==='user')+1;return Math.round(clamp((21-position)*3+row.pts/57*25+Math.min(1,metrics(team(s,'user')).overall/90)*15,0,100));}
function coachLabel(score){return score>=90?'Lenda da prancheta':score>=78?'Técnico de elite':score>=63?'Projeto em ascensão':score>=45?'Em construção':'Hora de reinventar';}
function finishSeason(s){let table=ranked(s),position=table.findIndex(t=>t.id==='user')+1,champ=team(s,table[0].id),score=coachScore(s);const prize=position===1?6500:position<=4?4200:position<=10?2800:1600;earnings(s,prize);
 // Completed objectives are credited once on closure, so no reward is lost at rollover.
 let automatic=0;for(const o of s.objectives)if(!o.claimed&&o.progress>=o.target){o.claimed=true;earnings(s,o.reward);automatic+=o.reward;}
 const top=leaders(s)[0],assist=leaders(s,'a')[0],best=Object.values(s.stats).filter(p=>p.team==='user').sort((a,b)=>(b.ratingSum/b.apps)-(a.ratingSum/a.apps))[0];
 s.history.push({season:s.season,position,champion:{name:champ.name,short:champ.short,color:champ.color,id:champ.id},table:copy(table),scorer:top?{...copy(top),name:D.byId[top.id].name,club:team(s,top.team).name}:null,assist:assist?{...copy(assist),name:D.byId[assist.id].name,club:team(s,assist.team).name}:null,best:best?{...copy(best),name:D.byId[best.id].name}:null,score,prize,automatic,stats:copy(Object.values(s.stats).filter(p=>p.team==='user'))});
 s.phase=s.season===5?'finished':'seasonEnd';addNews(s,position===1?'O campeão tem nome!':'Temporada encerrada',`${champ.name} levanta a taça. ${s.club.name} termina em ${position}º, com avaliação ${score}/100.`,'trophy');
}
function nextSeason(s){if(s.phase!=='seasonEnd'||s.season>=5)throw Error('Sua carreira chegou ao fim.');s.season++;startSeason(s);addNews(s,'Uma nova temporada começa',`Seu elenco e suas moedas continuam. Os adversários chegam mais fortes à temporada ${s.season}.`,'club');}
function openPack(s,id){if(s.pendingPack)throw Error('Você já tem um pacote para revelar.');if(s.phase==='finished')throw Error('A carreira foi concluída.');let pack=D.packs.find(p=>p.id===id);if(!pack)throw Error('Pacote não encontrado.');if(id==='welcome'&&s.welcomeOpened)throw Error('Seu pacote inicial já foi aberto.');if(id!=='welcome'&&!s.welcomeOpened)throw Error('Abra primeiro o pacote de boas-vindas.');if(s.season<pack.unlock)throw Error(`Disponível na temporada ${pack.unlock}.`);if(s.coins<pack.price)throw Error('Você ainda não tem moedas suficientes.');
 const base=packPool(s,pack),received=[],drawn=new Set(),rng={rng:s.rng};
 for(let i=0;i<pack.count;i++){
   let pool;
   if(pack.id==='totw'&&i===0)pool=D.weekly.cards.filter(p=>!s.retiredPlayers?.includes(p.id));
   else if(pack.mode==='choice'||i===0)pool=base.filter(p=>p.ovr>=pack.min&&!drawn.has(p.id));
   else {const band=weighted(rng,[0,1,2,3],n=>pack.weights[n]),[min,max]=[[68,74],[75,79],[80,87],[88,99]][band];pool=base.filter(p=>p.ovr>=min&&p.ovr<=max&&!drawn.has(p.id));if(!pool.length)pool=base.filter(p=>!drawn.has(p.id));}
   if(!pool.length)throw Error('Não há cartas disponíveis para este pacote. Nenhuma moeda foi gasta.');
   const p=pack.id==='totw'&&i===0?pick(rng,pool):i===0||pack.mode==='choice'?weighted(rng,pool,p=>Math.pow(.65,p.ovr-pack.min)):pick(rng,pool);
   drawn.add(p.id);const duplicate=s.squad.includes(p.id);received.push({id:p.id,duplicate,refund:duplicate?value(p):0});
 }
 s.rng=rng.rng;s.coins-=pack.price;
 if(pack.mode!=='choice')for(const c of received)creditCard(s,c);
 s.packsOpened++;if(id==='welcome')s.welcomeOpened=true;
 s.pendingPack={packId:id,cards:received,revealed:0,...(pack.mode==='choice'?{mode:'choice',selected:null}:{}),...(id==='totw'?{edition:D.weekly.id}:{})};
 if(pack.mode!=='choice')packNews(s,received,pack);return s.pendingPack;
}
function creditCard(s,c){if(c.duplicate)earnings(s,c.refund);else s.squad.push(c.id);}
function packNews(s,cards,pack){const best=cards.map(c=>D.byId[c.id]).sort((a,b)=>b.ovr-a.ovr)[0];if(best.ovr>=85)addNews(s,'Reforço de peso',`${best.name} (${best.ovr}) chegou pelo pacote ${pack.name}.`,'transfer');}
function choosePackCard(s,id){
 const pending=s.pendingPack;
 if(!pending||pending.mode!=='choice'||pending.selected!==null)throw Error('Não há uma escolha disponível.');
 if(pending.revealed!==pending.cards.length)throw Error('Revele as três opções antes de escolher.');
 const selected=pending.cards.find(c=>c.id===id);if(!selected)throw Error('Escolha uma das três cartas oferecidas.');
 creditCard(s,selected);pending.selected=id;packNews(s,[selected],D.packs.find(p=>p.id===pending.packId));updateObjectives(s);return selected;
}
function reveal(s){if(s.pendingPack)s.pendingPack.revealed=Math.min(s.pendingPack.cards.length,s.pendingPack.revealed+1);}
function finishPack(s){if(!s.pendingPack)return;if(s.pendingPack.mode==='choice'&&!s.pendingPack.selected)throw Error('Escolha um jogador antes de concluir o pacote.');s.pendingPack=null;updateObjectives(s);}
function saleReason(s,id){if(s.phase==='finished')return 'A carreira foi concluída.';if(!s.squad.includes(id))return 'Jogador não encontrado.';if(s.pendingPack)return 'Conclua a abertura do pacote.';if(s.squad.length<=18)return 'Mantenha pelo menos 18 jogadores no elenco.';if(s.lineup.includes(id))return 'Tire o jogador dos titulares antes de vender.';if(s.captain===id)return 'Escolha outro capitão antes de vender.';if(D.byId[id].pos==='GOL'&&s.squad.filter(x=>D.byId[x].pos==='GOL').length<=2)return 'Mantenha dois goleiros no elenco.';return '';}
function sell(s,id){const reason=saleReason(s,id);if(reason)throw Error(reason);const amount=value(D.byId[id]);s.squad=s.squad.filter(x=>x!==id);s.bench=s.bench.filter(x=>x!==id);let extras=s.squad.filter(x=>!s.lineup.includes(x)&&!s.bench.includes(x)).sort((a,b)=>D.byId[b].ovr-D.byId[a].ovr);while(s.bench.length<7&&extras.length)s.bench.push(extras.shift());earnings(s,amount);s.sales++;return amount;}
function swap(s,slot,id){if(s.phase==='finished')throw Error('A carreira foi concluída.');if(!s.squad.includes(id)||slot<0||slot>10)throw Error('Escalação inválida.');const old=s.lineup[slot],other=s.lineup.indexOf(id);s.lineup[slot]=id;if(other>=0)s.lineup[other]=old;else{let bi=s.bench.indexOf(id);if(bi>=0)s.bench[bi]=old;}if(s.captain===old&&!s.lineup.includes(old))s.captain=id;updateObjectives(s);}
function benchSwap(s,out,incoming){if(!s.bench.includes(out)||s.lineup.includes(incoming)||!s.squad.includes(incoming))throw Error('Troca de banco inválida.');const other=s.bench.indexOf(incoming),i=s.bench.indexOf(out);s.bench[i]=incoming;if(other>=0)s.bench[other]=out;}
function changeFormation(s,name){if(!D.formations[name])throw Error('Formação inválida.');s.formation=name;optimize(s);updateObjectives(s);}
function validate(s){try{
 const num=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 const ids=a=>Array.isArray(a)&&a.every(id=>Boolean(D.byId[id]))&&new Set(a).size===a.length;
 if(!s||s.version!==1||!num(s.rng)||!s.club||typeof s.club.name!=='string'||s.club.name.length>26||typeof s.club.short!=='string'||!/^#[0-9a-f]{6}$/i.test(s.club.color)||!/^#[0-9a-f]{6}$/i.test(s.club.secondary)||!D.formations[s.formation]||!D.tactics[s.tactic])return false;
 if(!ids(s.squad)||s.squad.length<18||!ids(s.lineup)||s.lineup.length!==11||s.lineup.some(id=>!s.squad.includes(id))||!ids(s.bench)||s.bench.length>7||s.bench.some(id=>!s.squad.includes(id)||s.lineup.includes(id))||!s.squad.includes(s.captain))return false;
 if(!num(s.coins)||!Number.isInteger(s.season)||s.season<1||s.season>5||!Number.isInteger(s.round)||s.round<0||s.round>19||!['active','seasonEnd','finished'].includes(s.phase))return false;
 if(!Array.isArray(s.teams)||s.teams.length!==20||new Set(s.teams.map(t=>t.id)).size!==20||!s.teams.some(t=>t.id==='user'))return false;
 const teams=new Set(s.teams.map(t=>t.id));
 for(const t of s.teams)if(typeof t.name!=='string'||typeof t.short!=='string'||t.id!=='user'&&(!ids(t.lineup)||t.lineup.length!==11||!ids(t.bench)||!D.formations[t.formation]||!D.tactics[t.tactic]))return false;
 if(!Array.isArray(s.table)||s.table.length!==20||s.table.some(r=>!teams.has(r.id)||['played','w','d','l','gf','ga','pts'].some(k=>!num(r[k]))||!Array.isArray(r.form)))return false;
 if(!Array.isArray(s.fixtures)||s.fixtures.length!==19||s.fixtures.some(r=>!Array.isArray(r)||r.length!==10||r.some(m=>!teams.has(m.home)||!teams.has(m.away))))return false;
 if(!Array.isArray(s.results)||s.results.length!==s.round||s.results.some(r=>!Array.isArray(r)||r.length!==10||r.some(m=>!num(m.hg)||!num(m.ag)||!Array.isArray(m.events)||!Array.isArray(m.ratings))))return false;
 const goodStat=p=>D.byId[p.id]&&['g','a','apps','minutes','ratingSum','clean'].every(k=>num(p[k]));
 if(!s.stats||!s.careerStats||typeof s.stats!=='object'||typeof s.careerStats!=='object'||Object.values(s.stats).some(p=>!teams.has(p.team)||!goodStat(p))||Object.values(s.careerStats).some(p=>!goodStat(p)))return false;
 if(!Array.isArray(s.history)||s.history.length>5||s.history.some(h=>!h.champion||typeof h.champion.name!=='string'||!Array.isArray(h.table)||h.table.length!==20||!Array.isArray(h.stats)||!num(h.score)||!num(h.position)))return false;
 if(!Array.isArray(s.news)||s.news.some(n=>typeof n.title!=='string'||typeof n.text!=='string')||!Array.isArray(s.objectives)||s.objectives.length!==4||s.objectives.some(o=>!num(o.target)||!num(o.progress)||!num(o.reward)||typeof o.claimed!=='boolean'))return false;
 if(['packsOpened','sales','coinsEarned','seasonWins','seasonGoals'].some(k=>!num(s[k]))||typeof s.welcomeOpened!=='boolean')return false;
 if(s.pendingPack&&(!D.packs.some(p=>p.id===s.pendingPack.packId)||!Array.isArray(s.pendingPack.cards)||!num(s.pendingPack.revealed)||s.pendingPack.cards.some(c=>!D.byId[c.id]||typeof c.duplicate!=='boolean'||!num(c.refund))))return false;
 if(s.pendingPack){const p=s.pendingPack,config=D.packs.find(x=>x.id===p.packId);if(p.cards.length!==config.count||new Set(p.cards.map(c=>c.id)).size!==p.cards.length||!Number.isInteger(p.revealed)||p.revealed>p.cards.length)return false;
   if(config.mode==='choice'){if(p.mode!=='choice'||p.cards.some(c=>D.byId[c.id].special||D.byId[c.id].ovr<80||D.byId[c.id].ovr>85)||p.selected!==null&&(!p.cards.some(c=>c.id===p.selected)||p.revealed!==p.cards.length||!s.squad.includes(p.selected)))return false;}
   else if(p.mode==='choice')return false;
 }
 if(s.phase==='active'&&s.round===19||s.phase!=='active'&&s.round!==19||s.phase==='finished'&&s.season!==5)return false;
 return true;
 }catch{return false;}}
function career(s){let rows=s.history;let stats=Object.values(s.careerStats).sort((a,b)=>b.g-a.g||b.a-a.a),wins=rows.reduce((a,h)=>a+h.table.find(t=>t.id==='user').w,0);return {titles:rows.filter(h=>h.position===1).length,best:rows.length?Math.min(...rows.map(h=>h.position)):0,score:rows.length?Math.round(mean(rows.map(h=>h.score))):0,goals:stats.reduce((a,p)=>a+p.g,0),wins,matches:rows.length*19,star:stats[0],overall:metrics(team(s,'user')).overall};}
const engine={createClub,random,fit,autoLineup,optimize,value,tier,revealLabel,packPool,team,metrics,expected,preview,ranked,advanceRound,leaders,claim,updateObjectives,nextSeason,openPack,reveal,choosePackCard,finishPack,sell,saleReason,swap,benchSwap,changeFormation,validate,career,coachLabel};
if(typeof module!=='undefined'&&module.exports){require('./seasons.js')(engine,D);require('./goals.js')(engine,D);module.exports=engine;}else root.OuroEngine=engine;
})(typeof window!=='undefined'?window:globalThis);

(function(root, install) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) module.exports = install;
  else install(root.OuroEngine, root.OuroData);
})(typeof window !== 'undefined' ? window : globalThis, function(E, D) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const average = p => p.apps ? p.ratingSum / p.apps : 0;
  const bestFirst = ids => [...ids].sort((a, b) => D.byId[b].ovr - D.byId[a].ovr || a.localeCompare(b));
  const pick = (s, ids) => ids[Math.floor(E.random(s) * ids.length)];
  function shuffle(s, values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(E.random(s) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  E.drawCaptains = function(seed = Date.now()) {
    const rng = {rng: seed >>> 0}, selected = [];
    for (const positions of [['GOL'], ['ZAG', 'LE', 'LD'], ['VOL', 'MC'], ['MEI'], ['PE', 'PD'], ['ATA']]) {
      const pool = D.captains.filter(id => positions.includes(D.byId[id].pos) && !selected.includes(id));
      if (pool.length) selected.push(pick(rng, pool));
    }
    return shuffle(rng, selected);
  };

  function awardPlayer(s, row) {
    if (!row) return null;
    const club = E.team(s, row.team);
    return {...clone(row), name: D.byId[row.id].name, club: club?.name || row.team,
      color: club?.color || '#c4f06b', secondary: club?.secondary || '#19272b',
      average: +average(row).toFixed(2)};
  }

  E.ballRanking = function(s) {
    const eligible = Object.values(s.stats).filter(p => p.apps >= 8);
    const maxGoals = Math.max(1, ...eligible.map(p => p.g));
    const maxAssists = Math.max(1, ...eligible.map(p => p.a));
    return eligible.map(p => ({...awardPlayer(s, p), awardScore: +(average(p) * 6 + p.g / maxGoals * 35 + p.a / maxAssists * 5).toFixed(2)}))
      .sort((a, b) => b.awardScore - a.awardScore || b.g - a.g || b.average - a.average || a.minutes - b.minutes || (a.team + a.id).localeCompare(b.team + b.id));
  };

  E.seasonEvents = [
    {id:'retirement', title:'Pendurou as chuteiras', kind:'departure', description:'Um titular decidiu encerrar a carreira. O adeus deixa uma vaga no time.', effect:'Um titular sorteado sai sem compensação.', target:'randomStarter', count:1},
    {id:'financial', title:'Crise financeira', kind:'choice', description:'A diretoria precisa reduzir a folha. Você terá de liberar um dos três jogadores de maior overall do elenco.', effect:'Escolha um dos três maiores overalls para sair por 0 moedas.', target:'topSquad', count:1},
    {id:'transferban', title:'Transfer ban: contas bloqueadas', kind:'coins', description:'Uma punição financeira bloqueou o saldo disponível. O clube começa o próximo ano do zero.', effect:'Todas as moedas são perdidas.', fraction:1},
    {id:'mutiny', title:'Motim no vestiário', kind:'departure', description:'O capitão rompeu com a diretoria e convenceu dois titulares a sair com ele.', effect:'Capitão + dois titulares sorteados deixam o clube por 0 moedas.', target:'mutiny', count:3},
    {id:'release', title:'Oferta impossível de recusar', kind:'departure', description:'Seu melhor atacante pediu liberação para buscar outro desafio. O acordo não deixa receita.', effect:'O titular de ataque com maior overall sai sem compensação.', target:'attack', count:1},
    {id:'agent', title:'Empresário na porta', kind:'choice', description:'Três destaques querem contratos que o clube não consegue pagar. Um deles terá de partir.', effect:'Escolha um dos três melhores titulares para liberar.', target:'topStarters', count:1},
    {id:'bench', title:'Reservas querem jogar', kind:'departure', description:'Duas peças do banco não aceitaram outra temporada esperando uma chance.', effect:'Os dois reservas de maior overall saem por 0 moedas.', target:'bench', count:2},
    {id:'homesick', title:'Saudade de casa', kind:'departure', description:'Um titular pediu uma liberação por motivos pessoais. O clube decidiu respeitar o pedido.', effect:'Um titular sorteado deixa o elenco sem compensação.', target:'randomStarter', count:1},
    {id:'defender', title:'A muralha vai embora', kind:'departure', description:'A renovação do seu principal defensor fracassou. Hora de reconstruir a proteção do gol.', effect:'O defensor titular de maior overall sai por 0 moedas.', target:'defense', count:1},
    {id:'keeper', title:'Luvas em outro endereço', kind:'departure', description:'O goleiro titular encerrou seu contrato e optou por outro clube.', effect:'O goleiro titular deixa o clube sem compensação.', target:'keeper', count:1},
    {id:'sponsor', title:'Patrocinador deu no pé', kind:'coins', description:'O patrocinador rescindiu o contrato e cobrou os adiantamentos. A próxima janela ficou menor.', effect:'60% das moedas são perdidas.', fraction:.6},
    {id:'tax', title:'A conta chegou', kind:'coins', description:'Uma dívida antiga apareceu na auditoria. A diretoria terá de pagar antes da nova temporada.', effect:'40% das moedas são perdidas.', fraction:.4},
    {id:'training', title:'Temporal no centro de treino', kind:'mixed', description:'O CT precisa de reparos. Um reserva pediu rescisão, e parte do caixa vai para a obra.', effect:'25% das moedas + o melhor reserva saem do clube.', target:'bench', count:1, fraction:.25},
    {id:'board', title:'Ultimato da diretoria', kind:'choice', description:'A diretoria quer uma mudança de liderança. Um dos três melhores titulares terá o contrato encerrado.', effect:'Escolha um dos três melhores titulares para sair por 0 moedas.', target:'topStarters', count:1},
    {id:'contracts', title:'Renovações perdidas', kind:'departure', description:'Dois contratos venceram durante as férias. A negociação acabou sem acordo.', effect:'Dois titulares sorteados saem sem compensação.', target:'randomStarter', count:2},
    {id:'debt', title:'Acordo com os credores', kind:'dilemma', description:'O clube precisa escolher como quitar uma dívida: entregar todo o caixa ou liberar sua maior estrela.', effect:'Escolha: perder todas as moedas ou o jogador de maior overall.', target:'topSquad', count:1}
  ];

  function eventTargets(s, def) {
    const available = ids => ids.filter(id => id !== s.legacyCard?.id);
    const starters = available(s.lineup);
    if (def.target === 'topSquad') return bestFirst(available(s.squad)).slice(0, def.kind === 'choice' ? 3 : 1);
    if (def.target === 'topStarters') return bestFirst(starters).slice(0, 3);
    if (def.target === 'mutiny') return s.captain === s.legacyCard?.id ? shuffle(s, starters).slice(0, 3) : [s.captain, ...shuffle(s, starters.filter(id => id !== s.captain)).slice(0, 2)];
    if (def.target === 'bench') return bestFirst(available(s.bench)).slice(0, def.count);
    if (def.target === 'keeper') return [starters.find(id => D.byId[id].pos === 'GOL') || available(s.squad).find(id => D.byId[id].pos === 'GOL') || starters[0]];
    const positions = def.target === 'attack' ? ['ATA', 'PE', 'PD', 'MEI'] : ['ZAG', 'LE', 'LD', 'VOL'];
    if (def.target === 'attack' || def.target === 'defense') {
      const pool = starters.filter(id => positions.includes(D.byId[id].pos));
      return bestFirst(pool.length ? pool : starters).slice(0, def.count);
    }
    return def.target ? shuffle(s, starters).slice(0, def.count) : [];
  }

  function prepareEvent(s, h) {
    if (h.season >= 5 || h.event || h.season !== s.season || s.phase !== 'seasonEnd') return;
    const used = new Set(s.history.filter(x => x.event).map(x => x.event.id));
    const def = pick(s, E.seasonEvents.filter(x => !used.has(x.id)));
    h.event = {...clone(def), season:h.season, targets:eventTargets(s, def), resolved:false};
    if (s.legacyCard) {
      h.event.description += ' Sua lenda é permanente e fica protegida; os alvos são os demais jogadores elegíveis.';
      if (def.id === 'mutiny' && s.captain === s.legacyCard.id) h.event.effect = 'Sua lenda permanece: três outros titulares saem por 0 moedas.';
      if (def.id === 'keeper' && s.lineup[0] === s.legacyCard.id) {
        h.event.description = 'Sua lenda está protegida. Outro goleiro do elenco decidiu não renovar o contrato.';
        h.event.effect = 'O goleiro indicado sai por 0 moedas. Sua lenda permanece no clube.';
      }
    }
  }

  E.ensureSeason = function(s, h = s.history.at(-1)) {
    if (!h) return null;
    if (!h.storyVersion) {
      const current = h.season === s.season && s.round === 19;
      const clubInfo = row => ({...clone(row), name:E.team(s, row.id)?.name || row.id});
      h.table = h.table.map(row => row.name ? row : clubInfo(row));
      h.scorer = h.scorer ? {...h.scorer, average:average(h.scorer), color:E.team(s,h.scorer.team)?.color || '#c4f06b'} : null;
      h.scorers = current ? E.leaders(s).slice(0, 10).map(p => awardPlayer(s, p)) : h.scorer ? [h.scorer] : [];
      h.finalists = current ? E.ballRanking(s).slice(0, 3) : [];
      h.ballWinner = h.finalists[0] || null;
      h.bootWon = h.scorer?.team === 'user';
      h.ballWon = h.ballWinner?.team === 'user';
      h.champion = {...h.champion, ...(current ? clone(E.team(s, h.champion.id)) : {})};
      h.teamOverall = current ? E.metrics(E.team(s, 'user')).overall : null;
      h.storyVersion = 2;
      h.reviewStep = 0;
      h.reviewDone = h.season !== s.season;
    }
    prepareEvent(s, h);
    return h;
  };

  // Departure events bypass sale income, then preserve a usable 18-player club.
  // Only vacant starting slots change. The rest of the user's lineup is kept.
  function removePlayers(s, ids) {
    const departed = [...new Set(ids)].filter(id => s.squad.includes(id) && id !== s.legacyCard?.id);
    const originalLineup = [...s.lineup], originalBench = [...s.bench], added = [];
    s.squad = s.squad.filter(id => !departed.includes(id));
    const recruit = position => {
      let pool = D.players.filter(p => p.ovr <= 72 && (!position || p.pos === position) && !s.squad.includes(p.id) && !departed.includes(p.id) && !s.retiredPlayers?.includes(p.id));
      if (!pool.length) pool = D.players.filter(p => p.ovr <= 74 && (!position || p.pos === position) && !s.squad.includes(p.id) && !departed.includes(p.id));
      const id = pick(s, pool).id;
      s.squad.push(id); added.push(id);
    };
    while (s.squad.filter(id => D.byId[id].pos === 'GOL').length < 2) recruit('GOL');
    while (s.squad.length < 18) recruit();
    const retained = new Set(originalLineup.filter(id => s.squad.includes(id)));
    s.lineup = originalLineup.map((id, i) => {
      if (s.squad.includes(id)) return id;
      const slot = D.formations[s.formation][i][0];
      const candidates = s.squad.filter(x => !retained.has(x)).sort((a, b) => D.byId[b].ovr * E.fit(D.byId[b], slot) - D.byId[a].ovr * E.fit(D.byId[a], slot));
      const replacement = candidates[0]; retained.add(replacement); return replacement;
    });
    const available = s.squad.filter(id => !s.lineup.includes(id));
    s.bench = [...originalBench.filter(id => available.includes(id)), ...bestFirst(available).filter(id => !originalBench.includes(id))].slice(0, 7);
    const backupGK = available.find(id => D.byId[id].pos === 'GOL');
    if (backupGK && !s.bench.includes(backupGK)) s.bench[s.bench.length - 1] = backupGK;
    if (!s.lineup.includes(s.captain)) s.captain = bestFirst(s.lineup.filter(id => D.byId[id].pos !== 'GOL'))[0];
    E.updateObjectives(s);
    return {departed, added};
  }

  E.pendingEvent = function(s) {
    if (s.phase !== 'seasonEnd') return null;
    const h = E.ensureSeason(s);
    return h?.event && !h.event.resolved ? h.event : null;
  };

  E.resolveSeasonEvent = function(s, choice) {
    const event = E.pendingEvent(s);
    if (!event) throw Error('Este evento já foi resolvido.');
    if (event.kind === 'choice' && !event.targets.includes(choice)) throw Error('Escolha um dos jogadores indicados.');
    if (event.kind === 'dilemma' && !['coins','player'].includes(choice)) throw Error('Escolha como resolver a dívida.');
    let ids = event.targets, fraction = event.fraction || 0;
    if (event.kind === 'choice') ids = [choice];
    if (event.kind === 'dilemma') { ids = choice === 'player' ? event.targets : []; fraction = choice === 'coins' ? 1 : 0; }
    const coinsLost = Math.floor(s.coins * fraction);
    s.coins -= coinsLost;
    const outcome = removePlayers(s, ids);
    if (event.id === 'retirement') s.retiredPlayers = [...new Set([...(s.retiredPlayers || []), ...outcome.departed])];
    event.resolved = true; event.choice = choice || null; event.outcome = {...outcome, coinsLost};
    const names = outcome.departed.map(id => D.byId[id].name).join(', ');
    s.news.unshift({title:event.title, text:`${names ? names + ' saiu/sairam sem compensação. ' : ''}${coinsLost ? coinsLost.toLocaleString('pt-BR') + ' moedas foram perdidas. ' : ''}${outcome.added.length ? outcome.added.length + ' reposição(ões) de emergência chegaram ao elenco.' : ''}`, kind:'event', season:s.season, round:19});
    s.news = s.news.slice(0, 40);
    return event;
  };

  const originalAdvance = E.advanceRound;
  E.advanceRound = function(s) {
    const result = originalAdvance(s);
    if (s.phase !== 'active') E.ensureSeason(s);
    return result;
  };
  const originalNext = E.nextSeason;
  E.nextSeason = function(s) {
    if (s.phase !== 'seasonEnd') return originalNext(s);
    if (E.pendingEvent(s)) throw Error('Resolva o evento de fim de temporada antes de avançar.');
    const h = E.ensureSeason(s); h.reviewDone = true;
    const result = originalNext(s);
    s.news[0].text = `A temporada ${s.season} começou após os desafios das férias. Os adversários chegam mais fortes; confira as mudanças no elenco.`;
    return result;
  };
  const originalPack = E.openPack;
  E.openPack = function(s, id) {
    if (E.pendingEvent(s)) throw Error('Resolva o evento de fim de temporada antes de abrir pacotes.');
    return originalPack(s, id);
  };
  const originalSaleReason = E.saleReason;
  E.saleReason = function(s, id) {
    return E.pendingEvent(s) ? 'Resolva o evento de fim de temporada antes de vender.' : originalSaleReason(s, id);
  };
  const originalSell = E.sell;
  E.sell = function(s, id) {
    if (E.pendingEvent(s)) throw Error('Resolva o evento de fim de temporada antes de vender.');
    return originalSell(s, id);
  };
  const originalCareer = E.career;
  E.career = function(s) {
    return {...originalCareer(s), goldenBoots:s.history.filter(h => h.scorer?.team === 'user').length,
      goldenBalls:s.history.filter(h => h.ballWinner?.team === 'user').length};
  };
  const originalValidate = E.validate;
  E.validate = function(s) {
    if (!originalValidate(s)) return false;
    if (s.retiredPlayers && (!Array.isArray(s.retiredPlayers) || s.retiredPlayers.some(id => !D.byId[id]))) return false;
    return s.history.every(h => !h.event || (E.seasonEvents.some(e => e.id === h.event.id) && Array.isArray(h.event.targets) && h.event.targets.every(id => D.byId[id]) && typeof h.event.resolved === 'boolean'));
  };
});

(function(root, install) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) module.exports = install;
  else install(root.OuroEngine, root.OuroData);
})(typeof window !== 'undefined' ? window : globalThis, function(E, D) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const definitions = [
    ['captain_ball', 'Craque d’Or', 'Faça seu capitão ganhar a Bola de Ouro em uma temporada.', 'ball', 'Prêmios'],
    ['scorer', 'Craquelheiro', 'Tenha o artilheiro da liga em uma temporada.', 'boot', 'Prêmios'],
    ['coach', 'Pranchetudo', 'Receba 100/100 como técnico em pelo menos uma temporada.', 'board', 'Prêmios'],
    ['five_titles', 'Dinastia', 'Conquiste os cinco títulos da carreira.', 'crown', 'Títulos'],
    ['three_titles', 'Sempre nas cabeças', 'Conquiste três títulos ao longo da carreira.', 'trophy', 'Títulos'],
    ['squad90', 'Time de Ouro', 'Termine a quinta temporada com média de overall de pelo menos 90 em todo o elenco, incluindo banco e reservas.', 'star', 'Montagem'],
    ['five_packs', 'Como?', 'Termine a carreira com dois títulos ou mais e no máximo cinco pacotes abertos. O pacote gratuito conta.', 'pack', 'Desafios'],
    ['textor', 'J. Textor', 'Termine com dois títulos ou mais e zero moedas. No resumo final, você pode destinar todo o saldo à base.', 'coin', 'Desafios'],
    ['square', 'Quadrado Mágico', 'Seja campeão com adequação às posições de 50% ou menos no time da última rodada.', 'square', 'Desafios'],
    ['silver', 'XI, é prata', 'Seja campeão com apenas cartas prata e bronze em todo o elenco na última rodada: titulares, banco e reservas.', 'shield', 'Desafios'],
    ['neymar_pack', 'Alô, Neymar!', 'Receba uma carta do Neymar em um pacote. Em A Escolha, é preciso confirmar a carta dele.', 'pack', 'Neymar'],
    ['neymar_ball', 'Neymar d’Or', 'Faça o Neymar do seu clube ganhar a Bola de Ouro.', 'ball', 'Neymar'],
    ['neymar_scorer', 'Neymar, é rede!', 'Faça o Neymar do seu clube ser artilheiro da liga.', 'boot', 'Neymar'],
    ['totw_team', 'TDS: onze da semana', 'Escale onze titulares com cartas do Time da Semana. Edições diferentes podem jogar juntas.', 'eleven', 'Montagem'],
    ['totw_title', 'TDS: semana de glória', 'Seja campeão com onze cartas do Time da Semana como titulares na última rodada.', 'crown', 'Montagem'],
    ['first_title', 'Primeiro grito', 'Conquiste seu primeiro título nesta carreira.', 'trophy', 'Extras'],
    ['big_win', 'Pede música!', 'Vença uma partida por quatro ou mais gols de diferença.', 'ball', 'Extras'],
    ['streak', 'Pé quente', 'Vença cinco partidas seguidas. A sequência pode atravessar temporadas.', 'flame', 'Extras'],
    ['sales', 'Feira da bola', 'Venda dez jogadores. Duplicatas e saídas por eventos não contam.', 'coin', 'Extras'],
    ['hundred', 'Centenário', 'Marque cem gols com o clube ao longo da carreira.', 'target', 'Extras']
  ].map(([id, name, description, icon, group], index) => ({id, name, description, icon, group, number:index + 1}));
  const byId = Object.fromEntries(definitions.map(g => [g.id, g]));
  const neymarId = D.basePlayers.find(p => p.name === 'Neymar Jr.').id;
  const isNeymar = id => id === neymarId || D.byId[id]?.baseId === neymarId;
  const selectedValid = ids => Array.isArray(ids) && [0, 3].includes(ids.length) && new Set(ids).size === ids.length && ids.every(id => Object.hasOwn(byId, id));
  const emptyGoals = selected => ({version:1, selected:[...selected], earned:{}, gold:false,
    track:{neymarPacked:false, streak:0, bestStreak:0, biggestWin:0}, baseDonation:0});
  const ownWinner = p => p?.team === 'user';
  const meanOverall = s => s.squad.reduce((sum, id) => sum + D.byId[id].ovr, 0) / s.squad.length;
  const totwCount = s => s.lineup.filter(id => D.byId[id].special === 'totw').length;
  const titles = s => s.history.filter(h => h.position === 1).length;
  const finished = s => s.phase === 'finished';

  E.careerGoalDefinitions = definitions;
  E.validCareerGoalSelection = selectedValid;
  E.ensureCareerGoals = s => s.careerGoals || (s.careerGoals = emptyGoals([]));
  function outcome(s, id) {
    const h = s.history, t = titles(s), track = s.careerGoals?.track || {}, finale = finished(s);
    const boolean = (done, label = 'Ainda não conquistado') => ({done, ratio:done ? 1 : 0, progress:done ? 'Conquistado' : label});
    const count = (value, target, noun, done = value >= target) => ({done, ratio:Math.min(1, value / target), progress:`${value}/${target} ${noun}`});
    switch (id) {
      case 'captain_ball': return boolean(h.some(x => ownWinner(x.ballWinner) && x.goalSnapshot?.captain === x.ballWinner.id), 'Capitão no apito final da temporada');
      case 'scorer': return boolean(h.some(x => ownWinner(x.scorer)), 'Aguardando a artilharia da liga');
      case 'coach': return count(Math.max(0, ...h.map(x => x.score)), 100, 'de avaliação');
      case 'five_titles': return count(t, 5, 'títulos');
      case 'three_titles': return count(t, 3, 'títulos');
      case 'squad90': { const avg = meanOverall(s); return {done:finale && avg >= 90, ratio:Math.min(1, avg / 90), progress:`${avg.toFixed(1)} / 90 OVR · ${finale ? 'elenco final' : 'apurado no final'}`}; }
      case 'five_packs': return {done:finale && t >= 2 && s.packsOpened <= 5, ratio:s.packsOpened > 5 ? 0 : Math.min(1, t / 2), progress:`${t}/2 títulos · ${s.packsOpened}/5 pacotes · ${s.packsOpened > 5 ? 'limite excedido' : finale ? 'carreira encerrada' : 'apurado no final'}`};
      case 'textor': return {done:finale && t >= 2 && s.coins === 0, ratio:Math.min(1, t / 2), progress:`${t}/2 títulos · ${s.coins.toLocaleString('pt-BR')} moedas · ${finale ? 'saldo final' : 'apurado no final'}`};
      case 'square': return boolean(h.some(x => x.position === 1 && x.goalSnapshot?.fit <= 50), `Adequação atual: ${E.metrics(E.team(s, 'user')).fit}% · meta ≤ 50%`);
      case 'silver': return boolean(h.some(x => x.position === 1 && x.goalSnapshot?.allSilver), `${s.squad.filter(id => ['silver','bronze'].includes(E.tier(D.byId[id]))).length}/${s.squad.length} cartas prata ou bronze`);
      case 'neymar_pack': return boolean(Boolean(track.neymarPacked), 'Só vale a carta recebida no pacote');
      case 'neymar_ball': return boolean(h.some(x => ownWinner(x.ballWinner) && isNeymar(x.ballWinner.id)), 'Neymar precisa jogar pelo seu clube');
      case 'neymar_scorer': return boolean(h.some(x => ownWinner(x.scorer) && isNeymar(x.scorer.id)), 'Neymar precisa jogar pelo seu clube');
      case 'totw_team': return count(totwCount(s), 11, 'titulares TDS');
      case 'totw_title': return boolean(h.some(x => x.position === 1 && x.goalSnapshot?.allTotw), `${totwCount(s)}/11 titulares TDS · falta o título`);
      case 'first_title': return count(t, 1, 'título');
      case 'big_win': return count(track.biggestWin || 0, 4, 'gols de vantagem');
      case 'streak': return count(track.bestStreak || 0, 5, 'vitórias seguidas');
      case 'sales': return count(s.sales, 10, 'vendas');
      case 'hundred': return count(Object.values(s.careerStats).reduce((sum, p) => sum + p.g, 0), 100, 'gols');
      default: return boolean(false);
    }
  }
  E.careerGoalStatus = function(s) {
    const record = s.careerGoals;
    const goals = (record?.selected || []).map(id => ({...byId[id], ...outcome(s, id), earned:record.earned[id] || null}));
    return {goals, completed:goals.filter(g => g.earned).length, gold:goals.length === 3 && goals.every(g => g.earned)};
  };
  E.updateCareerGoals = function(s) {
    const record = E.ensureCareerGoals(s), newly = [];
    for (const id of record.selected) {
      if (!record.earned[id] && outcome(s, id).done) {
        record.earned[id] = {season:s.season, round:s.round}; newly.push(id);
        s.news.unshift({title:`Selo conquistado: ${byId[id].name}`, text:byId[id].description, kind:'goal', season:s.season, round:s.round});
      }
    }
    record.gold = record.selected.length === 3 && record.selected.every(id => record.earned[id]);
    s.news = s.news.slice(0, 40);
    return newly;
  };
  E.settleFinalCoins = function(s) {
    if (!finished(s) || !s.careerGoals?.selected.includes('textor') || titles(s) < 2 || s.coins <= 0) throw Error('O investimento final na base não está disponível.');
    const amount = s.coins; s.coins = 0; s.careerGoals.baseDonation += amount;
    E.updateCareerGoals(s); return amount;
  };

  // A legend is a deterministic 88 OVR card. Save the full snapshot in each
  // career as well as the separate profile, so exported careers are portable.
  const positions = ['GOL','LE','ZAG','LD','VOL','MC','MEI','PE','ATA','PD'];
  const profiles = {
    GOL:[55,35,66,48,85,92], LE:[88,59,82,85,83,25], LD:[88,59,82,85,83,25],
    ZAG:[75,48,73,92,92,25], VOL:[77,66,86,89,88,25], MC:[82,78,92,78,84,25],
    MEI:[86,85,93,52,76,25], PE:[92,88,84,45,77,25], PD:[92,88,84,45,77,25], ATA:[86,94,77,40,88,25]
  };
  E.legacyPositions = positions;
  E.makeLegacyCard = function(input, id) {
    const name = String(input.name || '').trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 22);
    if (name.length < 2 || !positions.includes(input.pos) || !Object.hasOwn(D.nations, input.nation)) throw Error('Preencha nome, posição e nacionalidade da sua lenda.');
    const player = {id:id || `legacy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`, name, pos:input.pos, nation:input.nation, ovr:88, special:'legacy'};
    ['vel','fin','pas','def','fis','gol'].forEach((key, i) => player[key] = profiles[input.pos][i]);
    return player;
  };
  E.validLegacyCard = function(p) {
    try {
      if (!p || !/^legacy-[a-z0-9-]{3,70}$/.test(p.id)) return false;
      const expected = E.makeLegacyCard(p, p.id);
      return Object.keys(expected).every(key => p[key] === expected[key]) && Object.keys(p).every(key => Object.hasOwn(expected, key));
    } catch { return false; }
  };
  E.registerLegacyCard = function(p) {
    if (!E.validLegacyCard(p)) throw Error('A carta de lenda não é válida.');
    D.byId[p.id] = clone(p); return D.byId[p.id];
  };
  E.validLegacyProfile = p => Boolean(p && p.version === 1 && typeof p.unlocked === 'boolean' && (p.card === null || p.unlocked && E.validLegacyCard(p.card)));
  E.unlockLegacyProfile = function(profile, s) {
    const next = E.validLegacyProfile(profile) ? clone(profile) : {version:1, unlocked:false, card:null};
    if (E.careerGoalStatus(s).gold || s.legacyCard) next.unlocked = true;
    if (!next.card && s.legacyCard) next.card = clone(s.legacyCard);
    return next;
  };
  E.createLegacyReward = function(profile, input) {
    if (!E.validLegacyProfile(profile) || !profile.unlocked || profile.card) throw Error('Conquiste os três selos para criar sua única lenda.');
    return {...profile, card:E.makeLegacyCard(input)};
  };

  const originalCreate = E.createClub;
  E.createClub = function(options, seed) {
    const selection = options.careerGoals || [];
    if (!selectedValid(selection)) throw Error('Escolha exatamente três objetivos de carreira ou nenhum.');
    if (options.legacyCard) {
      if (selection.includes('silver')) throw Error('Sua lenda 88 acompanha o elenco. Escolha outro objetivo no lugar de XI, é prata.');
      E.registerLegacyCard(options.legacyCard);
    }
    const s = originalCreate(options, seed);
    s.careerGoals = emptyGoals(selection);
    if (options.legacyCard) {
      s.legacyCard = clone(options.legacyCard); s.squad.push(s.legacyCard.id);
      const candidates = s.bench.map((id, i) => ({id, i})).filter(x => D.byId[x.id].pos !== 'GOL').sort((a,b) => D.byId[a.id].ovr - D.byId[b.id].ovr);
      s.bench[candidates[0].i] = s.legacyCard.id;
    }
    E.updateCareerGoals(s); return s;
  };
  const originalAdvance = E.advanceRound;
  E.advanceRound = function(s) {
    const result = originalAdvance(s), record = E.ensureCareerGoals(s), own = result.home === 'user';
    const difference = own ? result.hg - result.ag : result.ag - result.hg;
    record.track.streak = difference > 0 ? record.track.streak + 1 : 0;
    record.track.bestStreak = Math.max(record.track.bestStreak, record.track.streak);
    record.track.biggestWin = Math.max(record.track.biggestWin, difference);
    if (s.phase !== 'active') {
      const h = s.history.at(-1);
      // Capture once, before the offseason event or any later lineup edits.
      h.goalSnapshot = {captain:s.captain, fit:E.metrics(E.team(s,'user')).fit, overall:meanOverall(s),
        allSilver:s.squad.every(id => ['bronze','silver'].includes(E.tier(D.byId[id]))), allTotw:totwCount(s) === 11};
    }
    E.updateCareerGoals(s); return result;
  };
  const originalPack = E.openPack;
  E.openPack = function(s, id) {
    const pending = originalPack(s, id), record = E.ensureCareerGoals(s);
    if (pending.mode !== 'choice' && pending.cards.some(c => isNeymar(c.id))) record.track.neymarPacked = true;
    E.updateCareerGoals(s); return pending;
  };
  const originalChoose = E.choosePackCard;
  E.choosePackCard = function(s, id) {
    const card = originalChoose(s, id);
    if (isNeymar(id)) E.ensureCareerGoals(s).track.neymarPacked = true;
    E.updateCareerGoals(s); return card;
  };
  const originalTier = E.tier, originalValue = E.value;
  E.tier = p => p.special === 'legacy' ? 'legacy' : originalTier(p);
  E.value = p => p.special === 'legacy' ? 0 : originalValue(p);
  const originalReason = E.saleReason, originalSell = E.sell;
  E.saleReason = (s, id) => s.legacyCard?.id === id ? 'Sua lenda é permanente: pode ser escalada ou ir para o banco, mas nunca sai do elenco.' : originalReason(s, id);
  E.sell = function(s, id) {
    if (s.legacyCard?.id === id) throw Error(E.saleReason(s, id));
    const amount = originalSell(s, id); E.updateCareerGoals(s); return amount;
  };
  // Public mutation hooks also cover drag-and-drop and the browser-agent tools.
  for (const key of ['optimize','swap','benchSwap','changeFormation','nextSeason','claim','finishPack','updateObjectives','resolveSeasonEvent']) {
    const original = E[key];
    E[key] = function(s, ...args) { const result = original(s, ...args); E.updateCareerGoals(s); return result; };
  }
  const originalValidate = E.validate;
  E.validate = function(s) {
    let prior, registered;
    try {
      if (s?.legacyCard) {
        if (!E.validLegacyCard(s.legacyCard) || !s.squad?.includes(s.legacyCard.id) || s.retiredPlayers?.includes(s.legacyCard.id)) return false;
        registered = s.legacyCard.id; prior = D.byId[registered]; E.registerLegacyCard(s.legacyCard);
      }
      if (!originalValidate(s)) throw Error('Invalid career');
      if (s.squad.some(id => id.startsWith('legacy-') && id !== s.legacyCard?.id)) throw Error('Missing legend snapshot');
      if (s.careerGoals) {
        const g = s.careerGoals, nonnegative = x => Number.isInteger(x) && x >= 0;
        if (g.version !== 1 || !selectedValid(g.selected) || !g.earned || typeof g.earned !== 'object' || Array.isArray(g.earned) || typeof g.gold !== 'boolean') throw Error('Invalid goals');
        for (const [id, stamp] of Object.entries(g.earned)) if (!g.selected.includes(id) || !stamp || !Number.isInteger(stamp.season) || stamp.season < 1 || stamp.season > s.season || !nonnegative(stamp.round) || stamp.round > 19) throw Error('Invalid badge');
        if (g.gold !== (g.selected.length === 3 && g.selected.every(id => g.earned[id]))) throw Error('Invalid gold badge');
        if (!g.track || typeof g.track.neymarPacked !== 'boolean' || !['streak','bestStreak','biggestWin'].every(k => nonnegative(g.track[k])) || !nonnegative(g.baseDonation)) throw Error('Invalid tracking');
      }
      for (const h of s.history) if (h.goalSnapshot) {
        const x = h.goalSnapshot;
        if (!D.byId[x.captain] || !Number.isFinite(x.fit) || x.fit < 0 || x.fit > 100 || !Number.isFinite(x.overall) || x.overall < 0 || x.overall > 99 || typeof x.allSilver !== 'boolean' || typeof x.allTotw !== 'boolean') throw Error('Invalid season snapshot');
      }
      return true;
    } catch {
      if (registered) { if (prior) D.byId[registered] = prior; else delete D.byId[registered]; }
      return false;
    }
  };
});

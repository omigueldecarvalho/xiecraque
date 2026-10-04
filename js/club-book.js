(function(root, install) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) module.exports = install;
  else install(root.OuroEngine, root.OuroData);
})(typeof window !== 'undefined' ? window : globalThis, function(E, D) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const own = (obj, key) => Boolean(obj && Object.hasOwn(obj, key));
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const integer = (value, max = 1e9) => Number.isInteger(value) && value >= 0 && value <= max;
  const keyOK = id => typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,150}$/.test(id);
  const dateOK = value => typeof value === 'string' && value.length <= 30 && Number.isFinite(Date.parse(value));
  const positions = ['GOL','LE','LD','ZAG','VOL','MC','MEI','PE','PD','ATA'];
  const hash = value => [...value].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261).toString(36);
  const now = () => new Date().toISOString();
  const validRival = (s, id) => D.teams.some(t => t.id === id && t.id !== s.club.slot);
  const newId = () => `career-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  function emptyLore(id, date) {
    return {version:1, id, startedAt:date, finishedAt:null, rivalId:null, derbies:[], nicknames:{}, collected:{}};
  }
  E.nicknameDefinitions = [
    {id:'derby', name:'Rei dos Clássicos', rule:'Marcar pelo menos 3 gols contra o rival declarado nesta carreira.', priority:60, icon:'crown'},
    {id:'wall', name:'Paredão', rule:'Ser goleiro e disputar pelo menos 5 jogos sem sofrer gols nesta carreira.', priority:50, icon:'shield'},
    {id:'waiter', name:'Garçom', rule:'Dar pelo menos 5 assistências nesta carreira.', priority:40, icon:'tray'},
    {id:'scorer', name:'Matador', rule:'Marcar pelo menos 20 gols nesta carreira.', priority:30, icon:'target'},
    {id:'engine', name:'Motorzinho', rule:'Disputar pelo menos 50 partidas nesta carreira.', priority:20, icon:'bolt'},
    {id:'training', name:'Craque do Treino', rule:'Encerrar uma temporada como ATA, PE, PD ou MEI de 85+ OVR, com pelo menos 8 jogos, 450 minutos e no máximo 1 gol.', priority:10, icon:'cone'}
  ];
  const nickById = Object.fromEntries(E.nicknameDefinitions.map(x => [x.id, x]));
  function remember(s, ids, source, packId = null) {
    for (const id of ids) if (D.byId[id] && D.byId[id].special !== 'legacy' && !own(s.lore.collected, id)) {
      s.lore.collected[id] = {season:s.season, round:s.round, source, packId, at:now()};
    }
  }
  E.ensureClubLore = function(s) {
    if (s.lore) return s.lore;
    // Old saves have no creation ID. The same legacy backup must migrate to
    // the same archive entry when it is imported more than once.
    const fingerprint = JSON.stringify([s.club.name, s.club.slot, s.history[0]?.table || null, s.fixtures[0]]);
    s.lore = emptyLore(`migrated-${hash(fingerprint)}`, now());
    remember(s, [...s.squad, ...Object.keys(s.careerStats)], 'recovered');
    if (s.phase === 'finished') s.lore.finishedAt = now();
    return s.lore;
  };
  E.isDerby = (s, m) => Boolean(s.lore?.rivalId && m && (m.home === 'user' && m.away === s.lore.rivalId || m.away === 'user' && m.home === s.lore.rivalId));
  function rememberDerby(s, m) {
    if (!E.isDerby(s, m) || s.lore.derbies.some(x => x.season === m.season && x.round === m.round)) return false;
    const home = m.home === 'user';
    s.lore.derbies.push({season:m.season, round:m.round, home, gf:home ? m.hg : m.ag, ga:home ? m.ag : m.hg,
      scorers:m.events.filter(e => e.team === 'user').map(e => e.scorer)});
    return true;
  }
  E.rivalryStats = function(s) {
    const matches = s.lore?.derbies || [];
    return {id:s.lore?.rivalId || null, matches:matches.length, wins:matches.filter(m => m.gf > m.ga).length,
      draws:matches.filter(m => m.gf === m.ga).length, losses:matches.filter(m => m.gf < m.ga).length,
      gf:matches.reduce((n, m) => n + m.gf, 0), ga:matches.reduce((n, m) => n + m.ga, 0)};
  };
  E.declareRival = function(s, id) {
    if (!validRival(s, id)) throw Error('Escolha um adversário que participe da sua liga.');
    if (s.phase === 'finished') throw Error('Escolha o rival durante uma carreira em andamento.');
    if (s.lore?.rivalId) throw Error('O rival fica fixo até o fim desta carreira.');
    E.ensureClubLore(s).rivalId = id;
    for (const round of s.results) for (const m of round) rememberDerby(s, m);
    const h = s.history.find(h => h.season === s.season);
    if (h) h.derby = clone(s.lore.derbies.find(m => m.season === h.season) || null);
    E.updateNicknames(s);
    return E.rivalryStats(s);
  };
  E.playerNicknames = (s, id) => Object.entries(s?.lore?.nicknames[id] || {}).map(([code, stamp]) => ({...nickById[code], ...stamp})).sort((a,b) => b.priority - a.priority);
  E.updateNicknames = function(s) {
    const lore = E.ensureClubLore(s), derbyGoals = {}, added = [];
    for (const m of lore.derbies) for (const id of m.scorers) derbyGoals[id] = (derbyGoals[id] || 0) + 1;
    function grant(id, code, detail) {
      if (!lore.nicknames[id]) lore.nicknames[id] = {};
      if (own(lore.nicknames[id], code)) return;
      const stamp = {season:s.season, round:s.round, detail};
      lore.nicknames[id][code] = stamp; added.push({id, code, ...stamp});
    }
    for (const [id, p] of Object.entries(s.careerStats)) {
      const card = D.byId[id]; if (!card) continue;
      if ((derbyGoals[id] || 0) >= 3) grant(id, 'derby', `${derbyGoals[id]} gols contra o rival`);
      if (card.pos === 'GOL' && p.clean >= 5) grant(id, 'wall', `${p.clean} jogos sem sofrer gols`);
      if (p.a >= 5) grant(id, 'waiter', `${p.a} assistências na carreira`);
      if (p.g >= 20) grant(id, 'scorer', `${p.g} gols na carreira`);
      if (p.apps >= 50) grant(id, 'engine', `${p.apps} jogos na carreira`);
    }
    if (s.round === 19 && s.phase !== 'active') for (const p of Object.values(s.stats).filter(p => p.team === 'user')) {
      const card = D.byId[p.id];
      if (card.ovr >= 85 && ['ATA','PE','PD','MEI'].includes(card.pos) && p.apps >= 8 && p.minutes >= 450 && p.g <= 1) {
        grant(p.id, 'training', `${p.g} gol(s) em ${p.apps} jogos na temporada ${s.season}`);
      }
    }
    for (const tag of added) s.news.unshift({title:`A torcida batizou: ${nickById[tag.code].name}`, text:`${D.byId[tag.id].name} ganhou o apelido. ${tag.detail}.`, kind:'nickname', season:s.season, round:s.round});
    s.news = s.news.slice(0, 40); return added;
  };

  E.newClubBook = () => ({version:1, album:{}, careers:{}});
  function validCard(p, id) {
    return object(p) && keyOK(id) && p.id === id && typeof p.name === 'string' && p.name.length > 0 && p.name.length <= 100 &&
      positions.includes(p.pos) && own(D.nations, p.nation) && ['ovr','vel','fin','pas','def','fis','gol'].every(k => integer(p[k], 99)) &&
      (!p.special || p.special === 'totw') && (p.special !== 'totw' || typeof p.baseId === 'string');
  }
  E.hallRecordDefinitions = [
    {id:'titles', name:'Mais títulos', unit:'títulos', icon:'trophy'},
    {id:'goals', name:'Ataque histórico', unit:'gols', icon:'target'},
    {id:'score', name:'Professor dos professores', unit:'/100 na média', icon:'board'},
    {id:'overall', name:'O melhor XI', unit:'OVR final', icon:'star'},
    {id:'wins', name:'Máquina de vencer', unit:'vitórias', icon:'bolt'},
    {id:'rivalWins', name:'Dono do clássico', unit:'vitórias no clássico', icon:'crown'}
  ];
  function validCareer(r, id) {
    return object(r) && keyOK(id) && r.id === id && object(r.club) && typeof r.club.name === 'string' && r.club.name.length <= 26 && typeof r.club.short === 'string' && /^#[\da-f]{6}$/i.test(r.club.color) &&
      dateOK(r.startedAt) && dateOK(r.finishedAt) && ['titles','score','goals','wins','overall','rivalWins','goldenBoots','goldenBalls','packs','badges'].every(k => integer(r[k])) &&
      r.titles <= 5 && r.score <= 100 && r.overall <= 99 && r.wins <= 95 && r.rivalWins <= 5 && r.badges <= 3 && typeof r.gold === 'boolean' &&
      Array.isArray(r.positions) && r.positions.length === 5 && r.positions.every(p => integer(p,20) && p > 0) &&
      Array.isArray(r.newRecords) && r.newRecords.every(key => E.hallRecordDefinitions.some(d => d.id === key)) &&
      (!r.rival || object(r.rival) && D.teams.some(t => t.id === r.rival.id) && ['wins','draws','losses','gf','ga','matches'].every(k => integer(r.rival[k]))) &&
      (!r.star || object(r.star) && typeof r.star.name === 'string' && r.star.name.length <= 100 && integer(r.star.g) && typeof r.star.nickname === 'string' && r.star.nickname.length <= 40);
  }
  E.validClubBook = function(book) {
    try {
      return object(book) && book.version === 1 && object(book.album) && object(book.careers) &&
        Object.entries(book.album).every(([id, row]) => object(row) && validCard(row.player, id) && typeof row.club === 'string' && row.club.length <= 26 && keyOK(row.careerId) && dateOK(row.firstAt) && integer(row.season, 5) && row.season > 0 && ['pack','recovered'].includes(row.source) && (row.packId === null || D.packs.some(p => p.id === row.packId))) &&
        Object.entries(book.careers).every(([id, row]) => validCareer(row, id));
    } catch { return false; }
  };
  E.mergeClubBooks = function(a, b) {
    const result = clone(a || E.newClubBook());
    if (!b) return result;
    for (const [id, row] of Object.entries(b.album)) if (!own(result.album,id) || row.firstAt < result.album[id].firstAt) result.album[id] = clone(row);
    for (const [id, row] of Object.entries(b.careers)) {
      if (!own(result.careers,id)) result.careers[id] = clone(row);
      else { result.careers[id].badges = Math.max(result.careers[id].badges,row.badges); result.careers[id].gold ||= row.gold; }
    }
    return result;
  };
  E.hallRecords = function(book) {
    const entries = Object.values(book.careers);
    return E.hallRecordDefinitions.map(def => {
      const winner = [...entries].sort((a,b) => b[def.id] - a[def.id] || a.finishedAt.localeCompare(b.finishedAt) || a.id.localeCompare(b.id))[0] || null;
      return {...def, value:winner ? winner[def.id] : null, career:winner};
    });
  };
  function careerEntry(s) {
    const c = E.career(s), rivalry = E.rivalryStats(s), goals = E.careerGoalStatus(s);
    return {id:s.lore.id, club:clone(s.club), startedAt:s.lore.startedAt, finishedAt:s.lore.finishedAt,
      titles:c.titles, goals:c.goals, score:c.score, wins:c.wins, overall:c.overall, goldenBoots:c.goldenBoots,
      goldenBalls:c.goldenBalls, rivalWins:rivalry.wins, packs:s.packsOpened, badges:goals.completed, gold:goals.gold,
      positions:s.history.map(h => h.position), rival:rigidRival(rivalry),
      star:c.star ? {name:D.byId[c.star.id].name,g:c.star.g,nickname:E.playerNicknames(s,c.star.id)[0]?.name || ''} : null,
      newRecords:[]};
  }
  const rigidRival = r => r.id ? {...r} : null;
  E.syncClubBook = function(book, s) {
    const result = clone(book || E.newClubBook()), lore = E.ensureClubLore(s), discovered = [];
    for (const [id, row] of Object.entries(lore.collected)) if (!own(result.album,id) && D.byId[id]) {
      result.album[id] = {player:clone(D.byId[id]), club:s.club.name, careerId:lore.id, firstAt:row.at || lore.startedAt,
        season:row.season, source:row.source, packId:row.packId}; discovered.push(id);
    }
    let archived = false, newRecords = [];
    if (s.phase === 'finished' && s.history.length === 5) {
      if (!lore.finishedAt) lore.finishedAt = now();
      const row = careerEntry(s), previous = result.careers[row.id];
      if (previous) {
        row.newRecords = previous.newRecords;
        // Importing an older copy of this career must not erase seals already
        // recorded when a final objective was claimed later.
        row.badges = Math.max(row.badges, previous.badges);
        row.gold ||= previous.gold;
      }
      else {
        const records = E.hallRecords(result);
        newRecords = records.filter(r => row[r.id] > (r.value ?? 0)).map(r => r.id);
        row.newRecords = newRecords; archived = true;
      }
      result.careers[row.id] = row;
    }
    return {book:result, discovered, archived, newRecords};
  };
  E.albumCatalog = function(book) {
    const ids = new Set(D.players.map(p => p.id));
    return [...D.players, ...Object.entries(book.album).filter(([id]) => !ids.has(id)).map(([,row]) => row.player)];
  };

  const originalCreate = E.createClub;
  E.createClub = function(options, seed) {
    const slot = D.teams.some(t => t.id === options.slot) ? options.slot : 'bot';
    if (options.rival && !D.teams.some(t => t.id === options.rival && t.id !== slot)) throw Error('Seu rival precisa ser um dos 19 adversários da liga.');
    const s = originalCreate(options, seed);
    s.lore = emptyLore(newId(), now());
    s.lore.rivalId = options.rival || null;
    return s;
  };
  const originalPack = E.openPack;
  E.openPack = function(s, id) {
    const result = originalPack(s,id); E.ensureClubLore(s);
    if (result.mode !== 'choice') remember(s,result.cards.map(c => c.id),'pack',id);
    return result;
  };
  const originalChoice = E.choosePackCard;
  E.choosePackCard = function(s,id) {
    const result = originalChoice(s,id);E.ensureClubLore(s);remember(s,[id],'pack',s.pendingPack.packId);return result;
  };
  const originalAdvance = E.advanceRound;
  E.advanceRound = function(s) {
    // The cosmetic systems never consume the simulation RNG.
    const m = originalAdvance(s);E.ensureClubLore(s);
    if (rememberDerby(s,m)) {
      const derby = s.lore.derbies.at(-1), rival = E.team(s,s.lore.rivalId);
      const title = derby.gf > derby.ga ? 'A resenha tem dono!' : derby.gf < derby.ga ? 'Hoje a corneta veio do outro lado' : 'Clássico empatado. Resenha adiada.';
      s.news.unshift({title,text:`${s.club.name} ${derby.gf} × ${derby.ga} ${rival.name}. O placar entrou para a história da rivalidade.`,kind:'derby',season:s.season,round:s.round});
    }
    E.updateNicknames(s);
    if (s.phase !== 'active') {
      const h = s.history.at(-1);
      h.derby = clone(s.lore.derbies.find(d => d.season === h.season) || null);
      h.nicknames = Object.entries(s.lore.nicknames).flatMap(([id,tags]) => Object.entries(tags).filter(([,stamp]) => stamp.season === h.season).map(([code,stamp]) => ({id,code,...stamp})));
      if (s.phase === 'finished') s.lore.finishedAt = now();
    }
    return m;
  };
  const originalValidate = E.validate;
  E.validate = function(s) {
    if (!originalValidate(s)) return false;
    try {
      if (!s.lore) return true;
      const l = s.lore;
      if (l.version !== 1 || !keyOK(l.id) || !dateOK(l.startedAt) || l.finishedAt !== null && !dateOK(l.finishedAt) || l.rivalId !== null && !validRival(s,l.rivalId) || !object(l.collected) || !object(l.nicknames) || !Array.isArray(l.derbies)) return false;
      if (l.derbies.length > 5 || new Set(l.derbies.map(m => m.season)).size !== l.derbies.length) return false;
      if (l.derbies.some(m => !l.rivalId || !integer(m.season,5) || m.season < 1 || !integer(m.round,19) || m.round < 1 || typeof m.home !== 'boolean' || !integer(m.gf,9) || !integer(m.ga,9) || !Array.isArray(m.scorers) || m.scorers.length !== m.gf || m.scorers.some(id => !D.byId[id]))) return false;
      if (Object.entries(l.collected).some(([id,r]) => !own(D.byId,id) || D.byId[id].special === 'legacy' || !integer(r.season,5) || r.season < 1 || !integer(r.round,19) || !['pack','recovered'].includes(r.source) || r.packId !== null && !D.packs.some(p => p.id === r.packId))) return false;
      for (const [id, tags] of Object.entries(l.nicknames)) {
        if (!own(D.byId,id) || !object(tags)) return false;
        for (const [code,r] of Object.entries(tags)) if (!own(nickById,code) || !integer(r.season,5) || r.season < 1 || !integer(r.round,19) || typeof r.detail !== 'string' || r.detail.length > 150) return false;
      }
      return true;
    } catch { return false; }
  };
});

/* Add an edition, then change activeId. Keep past editions to preserve saves. */
(function (root) {
  'use strict';
  const weekly = {
    activeId: '2026-10-03',
    editions: [{
      id: '2026-10-03',
      label: 'Semana 01',
      period: '27/09 a 03/10/2026',
      formation: '4-3-3',
      note: 'Seleção editorial do jogo. Melhorias e notas são autorais, não uma seleção oficial.',
      sources: {
        santos: { title: 'Santos FC: vitória no clássico, 02/10/2026', url: 'https://www.santosfc.com.br/santos-fc-vence-o-classico-no-morumbis-e-iguala-recorde-no-campeonato-brasileiro/' },
        ratings: { title: 'ge: atuações do Santos, 02/10/2026', url: 'https://ge.globo.com/sp/santos-e-regiao/futebol/times/santos/noticia/2026/10/02/atuacoes-diogenes-salva-e-gabigol-comanda-virada-do-santos-em-classico-de-suas-notas.ghtml' },
        spain: { title: 'oGol: Espanha 4 x 1 Croácia, 29/09/2026', url: 'https://www.ogol.com.br/jogo/2026-09-29-espanha-croacia/12056405' },
        brazil: { title: 'UOL: Austrália 2 x 4 Brasil, 29/09/2026', url: 'https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/09/29/amistoso-brasil-x-australia-na-data-fifa.ghtm' }
      },
      players: [
        { name: 'Diógenes', pos: 'GOL', boost: { ovr: 8, gol: 10, fis: 5, pas: 4 }, reason: 'Defesas decisivas para segurar a vitória no clássico.', source: 'santos' },
        { name: 'G. Escobar', pos: 'LE', boost: { ovr: 6, vel: 5, pas: 8, def: 6, fis: 4 }, reason: 'Assistência no empate e recuperação de bola na virada.', source: 'ratings' },
        { name: 'Willian Arão', pos: 'ZAG', boost: { ovr: 5, def: 7, fis: 5, pas: 4 }, reason: 'Cortes e desarmes importantes na defesa santista.', source: 'ratings' },
        { name: 'D. Huijsen', pos: 'ZAG', boost: { ovr: 3, pas: 6, def: 4, fis: 3 }, reason: '93 passes certos em 98 na vitória espanhola.', source: 'spain' },
        { name: 'Vanderson', pos: 'LD', boost: { ovr: 4, fin: 7, vel: 4, pas: 4, def: 3 }, reason: 'Abriu o placar para o Brasil contra a Austrália.', source: 'brazil' },
        { name: 'B. Guimarães', pos: 'VOL', boost: { ovr: 3, fin: 5, pas: 4, def: 3, fis: 3 }, reason: 'Marcou o gol da virada brasileira no segundo tempo.', source: 'brazil' },
        { name: 'Pedri', pos: 'MC', boost: { ovr: 2, pas: 4, vel: 2, fin: 2 }, reason: 'Entrou e deu assistência para o segundo gol de Yamal.', source: 'spain' },
        { name: 'P. Coutinho', pos: 'MEI', boost: { ovr: 3, pas: 6, vel: 3, fin: 3 }, reason: 'Criou a jogada que terminou no gol da virada do Santos.', source: 'ratings' },
        { name: 'Everton Cebolinha', pos: 'PE', boost: { ovr: 5, vel: 6, pas: 8, fin: 4 }, reason: 'Serviu Gabigol no gol decisivo do clássico.', source: 'santos' },
        { name: 'Gabigol', pos: 'ATA', boost: { ovr: 6, fin: 9, vel: 6, pas: 3, fis: 5 }, reason: 'Dois gols na vitória por 2 a 1 sobre o São Paulo.', source: 'santos' },
        { name: 'L. Yamal', pos: 'PD', boost: { ovr: 3, fin: 5, pas: 4, vel: 3 }, reason: 'Dois gols e uma assistência contra a Croácia.', source: 'spain' }
      ]
    }]
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = weekly;
  else root.OuroWeekly = weekly;
})(typeof window !== 'undefined' ? window : globalThis);

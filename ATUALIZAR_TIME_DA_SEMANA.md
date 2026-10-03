# Atualizar o Time da Semana

Tudo fica em **`js/weekly.js`**. Não precisa alterar o motor, o HTML ou o CSS.

## Uma nova edição

1. Duplique o objeto completo da edição dentro de `editions`. Mantenha a anterior.
2. Troque `id` por uma data inédita, por exemplo `2026-10-10`, e atualize `label`, `period` e `sources`.
3. Em `players`, cadastre exatamente 11 jogadores distintos. Use o nome e a posição da carta comum como estão em `js/data.js`.
4. Defina as melhorias em `boost`. São acréscimos à carta comum, não valores finais. O limite é 99. O overall precisa subir e ficar em pelo menos 80.
5. Registre uma justificativa curta em `reason` e a chave da fonte em `source`.
6. Mude `activeId` para o `id` da nova edição. Rode `npm test` e abra “Ver conteúdo e chances” do pacote no navegador.

Exemplo de uma entrada da lista `players`:

```js
{
  name: 'Gabigol',
  pos: 'ATA',
  boost: { ovr: 6, fin: 9, vel: 6, pas: 3, fis: 5 },
  reason: 'Dois gols na vitória por 2 a 1 sobre o São Paulo.',
  source: 'santos'
}
```

As chaves disponíveis são `ovr`, `vel`, `fin`, `pas`, `def`, `fis`, `gol`. As posições são `GOL`, `LE`, `ZAG`, `LD`, `VOL`, `MC`, `MEI`, `PE`, `PD`, `ATA`. Para cobrir todas, use um de cada e dois zagueiros.

Para listar nomes e posições comuns no terminal:

```bash
node -e "console.table(require('./js/data.js').basePlayers.map(p=>({nome:p.name,pos:p.pos,ovr:p.ovr})))"
```

Se um nome ainda não existir, acrescente sua linha **ao final** da lista `rows` em `js/data.js`, antes do fechamento da crase. Não reordene nem remova linhas antigas: os IDs comuns são posicionais. Ajuste a contagem do teste de catálogo ao incluir novas cartas comuns.

## Preservar carreiras

- Não apague ou edite edições publicadas, nem altere as bases usadas por elas. Faça outra edição com novo `id`.
- Os IDs especiais são gerados como `totw-DATA-ID_BASE`. A versão comum e cada edição semanal coexistem no elenco.
- Só a edição apontada por `activeId` sai em novas compras. Pacotes já comprados mantêm as cartas sorteadas.
- Cada pacote dá **1 carta da semana + 3 comuns**. A preta é sorteada com chances iguais entre as disponíveis. Só uma repetição do mesmo ID vira moedas.
- O preço fica em `js/data.js`, no pacote `totw`, e deve acompanhar o `elite`. Os testes conferem essa igualdade.
- Os testes também conferem 11 cartas, posições, melhorias, fontes, exclusividade e manutenção de edições anteriores.

## Primeira edição

Seleção editorial de 27/09 a 03/10/2026, com fontes nas próprias cartas:
Diógenes, G. Escobar, Willian Arão, D. Huijsen, Vanderson, B. Guimarães, Pedri, P. Coutinho, Everton Cebolinha, Gabigol e L. Yamal.

Não existe atualização automática por calendário. Publicar a próxima versão de `weekly.js` atualiza a oferta, preservando o histórico. O jogo continua funcionando offline.

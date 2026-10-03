# XI, é Craque

Jogo de futebol para navegador em que você cria um clube, abre pacotes, monta o elenco e disputa até cinco temporadas de uma liga brasileira com 20 clubes.

## Como jogar

1. Extraia o ZIP.
2. Abra `index.html` no navegador.
3. Crie seu clube e revele o pacote de boas-vindas.

O jogo funciona como um site estático. Para usar o servidor local opcional:

~~~bash
node server.cjs
~~~

Depois acesse `http://localhost:4173`. No VS Code, abra a pasta extraída que contém `server.cjs`, use **Terminal → Novo Terminal** e rode `npm start`. Não é necessário instalar dependências.

## O que está incluído

- Criação do clube com nome, sigla, cores, clube substituído, base do elenco e capitão.
- Editor de escudo com formatos, padrões, símbolos e cores personalizáveis. A sigla pode ser ocultada ou receber uma cor própria, inclusive em escudos brancos. Também disponível em Configurações.
- Seis capitães sorteados de um grupo amplo, com posições variadas e botão para sortear outras opções.
- 507 cartas comuns e 11 cartas pretas da primeira edição do Time da Semana.
- Pacote inicial com jogador 80+ garantido e nove categorias de pacotes pagos.
- Revelação em etapas: atributos, posição, bordão, overall e nome. Botão para pular, modo rápido e suporte a movimento reduzido.
- **A Escolha**: três cartas entre 80 e 85, apenas uma contratação confirmada. As outras opções não entram no elenco nem geram moedas.
- **Time da Semana**: uma carta preta da edição ativa e três cartas comuns. Melhorias independentes, coexistindo com a versão comum. Edição, motivo, fonte e atributos melhorados aparecem nos detalhes.
- Escalação em campo, seis formações, capitão, banco e quatro táticas.
- Cartas com avatares cartoon, nomes, atributos e rodapé em áreas separadas, sem sobreposição. Escudos SVG próprios para cada clube.
- Arraste cartas entre titulares e banco para trocar posições; toque/clique continua abrindo o seletor.
- Venda de jogadores, duplicatas convertidas em moedas e objetivos de temporada.
- Liga de 20 clubes em turno único com 19 rodadas.
- Botão **Simular tudo**: usa a escalação atual e avança as partidas automaticamente. Pausa em cada encerramento para apresentar os resultados, prêmios e jornal; depois do evento, **Continuar simulação** avança a próxima temporada. **Parar simulação** permite voltar a montar o elenco. São no máximo cinco temporadas.
- Simulação baseada em força dos setores, posição, tática, mando de campo, banco e variação de finalização.
- Relato curto da partida, gols, assistências, notas, posse, finalizações e gol esperado.
- Toda temporada termina com classificação, artilharia, desempenho do elenco e avaliação do técnico, mesmo sem título.
- Jornal cartoon com manchetes e cenas de comemoração, campanha mediana ou treinador ajoelhado após resultados ruins.
- Cerimônias animadas: elenco levantando a taça, artilheiro com a Chuteira de Ouro e vencedor da Bola de Ouro, com três finalistas.
- Chuteira de Ouro para o artilheiro da liga, com desempate por assistências e menos minutos. Bola de Ouro exige oito jogos: nota média (60%), gols (35%) e assistências (5%). Gols e assistências são normalizados pelos líderes da liga. Desempate por gols, nota, menos minutos e identificador.
- Contagem de títulos, Chuteiras e Bolas de Ouro na carreira e na imagem compartilhável.
- Cinco temporadas no máximo, com imagem final para baixar ou compartilhar.
- Salvamento automático no navegador e exportação/importação de backup.
- Layout responsivo para computador e celular.

## Eventos entre temporadas

Um evento é sorteado ao terminar cada uma das quatro primeiras temporadas, sem repetir na mesma carreira. A escolha e as consequências ficam salvas; recarregar a página não troca o evento nem aplica a punição novamente. Não há evento após a quinta temporada.

São 16 possibilidades: aposentadoria, crise financeira, transfer ban, motim, saída do atacante, empresário, insatisfação dos reservas, saudade de casa, saída do defensor, saída do goleiro, perda do patrocinador, dívida antiga, temporal no CT, ultimato da diretoria, contratos vencidos e acordo com credores.

A crise financeira permite escolher um dos três maiores overalls. O motim tira o capitão e mais dois titulares sorteados. Transfer ban zera o caixa. Todas as saídas rendem **zero moedas**. A aposentadoria também retira o jogador dos futuros pacotes. As vagas são preenchidas pelo elenco; se necessário, chegam jogadores fracos para manter ao menos 18 atletas e dois goleiros. Resolva o evento antes de comprar pacotes ou vender jogadores.

## Pacotes e economia

| Pacote | Moedas | Disponibilidade |
| --- | ---: | --- |
| Boas-vindas | 0 | Uma vez, ao criar o clube |
| Base | 550 | Temporada 1 |
| Prata | 1.150 | Temporada 1 |
| Ouro | 2.200 | Temporada 1 |
| Artilheiro | 3.100 | Temporada 1 |
| Muralha | 3.100 | Temporada 1 |
| A Escolha | 3.500 | Temporada 1 |
| Elite | 8.400 | Temporada 2 |
| Time da Semana | 8.400 | Temporada 1 |
| Galáctico | 22.500 | Temporada 3 |

Base e Prata usam “XI, é bagre!”. Nos demais pacotes, cartas abaixo de 80 usam “XI, é Braque!” e as de 80+ usam “XI, é Craque!”. Todas exibem os seis atributos e, ao final, overall e nome.

O Time da Semana é uma seleção editorial, não uma seleção oficial. A edição de 03/10/2026 foi montada com atuações de 29/09 e 02/10, incluindo os dois gols de Gabigol no clássico. Cada carta tem a fonte da partida; notas e melhorias são decisões de balanceamento do jogo.

**Manutenção:** edite `js/weekly.js` seguindo `ATUALIZAR_TIME_DA_SEMANA.md`. A atualização é manual, sem serviço ou assinatura externa. Cartas de edições anteriores ficam no catálogo para preservar elencos, estatísticas e backups.

## Testes

Na pasta `tests` há uma suíte de regras do motor:

~~~bash
npm test
~~~

`tests/qa.html` é uma página auxiliar para revisar a tela inicial, celular/desktop, temporadas ruins, medianas e campeãs, e a retrospectiva final. Seus botões substituem apenas o progresso de teste do navegador usado; exporte sua carreira antes de abrir essa página.

Progresso anterior é preservado no mesmo navegador/endereço. As chaves internas antigas foram mantidas de propósito. Backups de “Onze de Ouro” e “XI, é Craque” podem ser importados. Os novos prêmios são apurados no encerramento; a Bola de Ouro não é inventada para temporadas antigas cujo histórico não guardou todas as notas da liga.

## Observações

Os clubes e alguns nomes de jogadores são usados como referência de futebol; escudos oficiais não são utilizados. Os elencos e atributos são uma base de fantasia criada para o jogo.

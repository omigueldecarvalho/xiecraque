# Objetivos de carreira · versão 1.4

Na criação do clube, abra **Escolher meus desafios** e selecione **exatamente três** ou deixe tudo vazio para jogar uma carreira livre. Os objetivos da temporada continuam funcionando normalmente.

O trio fica fixo durante as cinco temporadas. O progresso aparece na Central do Clube, na aba Carreira e no balanço de cada temporada. Um selo conquistado não é perdido se o jogador sair depois. A retrospectiva em PNG mostra os três desafios, distingue conquistas de objetivos não concluídos e acrescenta o selo de ouro quando o trio estiver completo.

## Os 20 desafios

| Objetivo | Regra |
| --- | --- |
| Craque d’Or | O capitão no encerramento da temporada vence a Bola de Ouro pelo seu clube. |
| Craquelheiro | Seu clube tem o artilheiro da liga. |
| Pranchetudo | Você recebe 100/100 na avaliação de uma temporada. |
| Dinastia | Cinco títulos na mesma carreira. |
| Sempre nas cabeças | Três títulos na mesma carreira. |
| Time de Ouro | Ao encerrar a quinta temporada, a média real de OVR de **todo o elenco** é pelo menos 90. Inclui banco e reservas; não arredonda 89,9 para conceder o selo. |
| Como? | Encerre a carreira com dois títulos ou mais e **no máximo cinco pacotes**. O pacote gratuito e A Escolha contam como um pacote cada. |
| J. Textor | Encerre com dois títulos ou mais e zero moedas. Após as premiações finais, aparece na aba Carreira a opção de destinar todo o saldo à base. O investimento é definitivo e usa apenas moedas do jogo. |
| Quadrado Mágico | Título com adequação de 50% ou menos na escalação da última rodada. Usa o mesmo percentual mostrado no elenco, incluindo adaptações e penalidades por posição. |
| XI, é prata | Título com apenas cartas bronze e prata em todo o elenco da última rodada, incluindo banco e reservas. É necessário retirar as cartas ouro iniciais antes do encerramento. |
| Alô, Neymar! | Receba Neymar em um pacote; em A Escolha, confirme a carta dele. Capitão inicial e opções recusadas não contam. |
| Neymar d’Or | Neymar vence a Bola de Ouro pelo seu clube. |
| Neymar, é rede! | Neymar é artilheiro da liga pelo seu clube. |
| TDS: onze da semana | Escale onze titulares do Time da Semana. Edições diferentes podem ser misturadas. |
| TDS: semana de glória | Seja campeão com onze titulares do Time da Semana na última rodada. |
| Primeiro grito | Ganhe um título. |
| Pede música! | Vença uma partida por pelo menos quatro gols de diferença. |
| Pé quente | Vença cinco partidas seguidas; a sequência pode atravessar temporadas. |
| Feira da bola | Faça dez vendas manuais. Duplicatas e saídas por eventos não contam. |
| Centenário | Marque cem gols na carreira. |

Os três últimos desafios de resultado financeiro/elenco — Time de Ouro, Como? e J. Textor — são apurados no encerramento da carreira. Os demais são concedidos assim que a condição for satisfeita. Desafios ligados a título e capitão usam uma fotografia do elenco no apito final: mudanças posteriores e eventos de férias não alteram essa fotografia.

A avaliação do técnico continua baseada em colocação, pontos e força do time. A parcela de força agora chega ao máximo em 90 OVR, permitindo alcançar 100/100 numa campanha excepcional, como um título com 19 vitórias e elenco de elite.

## Recompensa do trio

Complete os três objetivos para receber o selo **XI, lenda de ouro!** e liberar **Criar minha lenda** na aba Carreira. Você escolhe nome, posição e nacionalidade, com prévia da carta e dos seis atributos. A carta tem 88 OVR e atributos fixos por posição.

- Uma carta por perfil do navegador, definida ao confirmar a criação.
- A carta entra no banco dos **próximos clubes**, além dos 18 jogadores iniciais. Você pode escalá-la normalmente.
- Ela permanece no elenco: não pode ser vendida nem retirada por qualquer um dos 16 eventos.
- Se for capitã durante um motim, outros três titulares saem; a lenda continua.
- Por ser 88 OVR e permanente, ela torna o desafio **XI, é prata** incompatível nas próximas carreiras. O seletor explica e bloqueia essa combinação.
- Começar outra carreira preserva a recompensa. Exportar progresso também inclui a lenda e o desbloqueio, mesmo se a carta ainda não tiver sido criada.

O jogo usa `localStorage`, sem conta ou servidor de dados. Para mudar de navegador, dispositivo ou endereço do jogo, exporte o progresso e importe no destino. Limpar os dados do navegador sem backup apaga o perfil local.

## Atualização e compatibilidade

O ZIP contém o projeto completo. Extraia e substitua os arquivos da versão anterior, preservando seu endereço habitual para manter o salvamento local. No VS Code, abra a pasta que contém `index.html` e `server.cjs`; rode `npm start` ou abra `index.html` diretamente.

Carreiras já iniciadas continuam utilizáveis, sem objetivos de carreira selecionados. Para escolher o trio, comece uma nova carreira. Exporte a antiga primeiro se quiser guardá-la. Não há selos retroativos para um desafio que não foi escolhido.

Arquivos novos: `goals.css`, `js/goals.js`, `js/goals-view.js`, `tests/goals.test.cjs` e este documento. A integração também atualiza `index.html`, `js/app.js`, `js/engine.js`, `js/seasons.js`, `js/story.js`, `js/enhancements.js`, `package.json`, `tests/qa.html` e `README.md`.

## Validação

`npm test` executa os testes do motor e dos objetivos, sem instalar dependências. Cobrem seleção 0/3, regras de premiação, pacotes, Neymar, eventos, proteção da lenda, saves antigos, snapshots e limites de fim de carreira.

Também foram verificados os fluxos de formulário, selo de ouro, criação da carta, exportação, imagem PNG e nova carreira em um ambiente de DOM de teste, com inspeção da imagem final renderizada. A revisão visual completa no navegador ficou limitada pelo bloqueio de acesso ao servidor local no ambiente de testes.

# Memórias do clube — XI, é Craque 1.5

## Onde encontrar

- **Rival:** escolhido na criação do clube; painel em Meu clube e Carreira.
- **Apelidos:** Elenco → Minhas cartas → clique no jogador. Os novos apelidos também aparecem no jornal da temporada.
- **Álbum e Hall:** Carreira → Álbum permanente / Hall da Fama. A tela de criação também tem atalhos para consultar suas memórias entre carreiras.

## Rival declarado

Escolha um dos 19 clubes que continuam na liga. Ele fica fixo durante as cinco temporadas, com um clássico por temporada.

O calendário, a prévia e o resultado destacam o clássico. O painel guarda vitórias de cada lado, empates, gols e os placares. O jornal comenta o confronto, e o Hall registra a rivalidade ao fim da carreira.

A rivalidade não altera atributos, recompensas nem o sorteio dos resultados. O desempenho continua dependendo do elenco, da escalação, da tática e da simulação.

## Apelidos da torcida

Os apelidos são conquistados automaticamente. Eles pertencem à carta dentro daquela carreira e ficam registrados mesmo depois de uma venda. A versão comum e a versão especial de um jogador têm históricos separados.

| Apelido | Como conquistar |
| --- | --- |
| Rei dos Clássicos | Fazer 3 gols contra o rival ao longo da carreira. |
| Paredão | Ser goleiro e acumular 5 partidas sem sofrer gols. |
| Garçom | Dar 5 assistências na carreira. |
| Matador | Marcar 20 gols na carreira. |
| Motorzinho | Disputar 50 partidas na carreira. |
| Craque do Treino | Terminar uma temporada como ATA, PE, PD ou MEI de 85+ OVR, com pelo menos 8 jogos, 450 minutos e no máximo 1 gol. |

Quando houver vários apelidos, o destaque segue a ordem da tabela; os detalhes mostram todos. Um apelido positivo conquistado depois passa à frente de Craque do Treino. Eles não dão bônus de atributos. A cada nova carreira, a torcida começa uma história nova.

## Álbum permanente

Uma carta entra no álbum quando é recebida de um pacote. O pacote de boas-vindas e cartas repetidas também contam. No pacote A Escolha, somente a opção confirmada entra na coleção.

O elenco básico e o capitão inicial de uma nova carreira não completam o álbum automaticamente. A lenda personalizada fica na sua recompensa permanente, fora do catálogo de pacotes.

- Descobertas ficam salvas mesmo se o jogador for vendido ou retirado por um evento.
- Cartas faltantes aparecem como silhuetas. A busca por nome considera apenas as descobertas.
- Cada carta descoberta guarda o clube, a temporada e a data do primeiro registro.
- Versões comuns, cartas do Time da Semana e suas diferentes edições ocupam espaços separados.
- O álbum guarda uma lembrança; consultar a carta não a entrega ao elenco de outra carreira.

As cartas descobertas são armazenadas com uma cópia dos atributos e do nome. Edições antigas continuam visíveis no álbum. Na manutenção semanal, continue preservando os IDs antigos conforme o guia do Time da Semana para também manter elencos e saves compatíveis.

## Hall da Fama pessoal

A carreira entra automaticamente no Hall quando termina a quinta temporada. Carreiras interrompidas não entram; suas cartas descobertas continuam no álbum.

Cada resumo guarda nome e escudo do clube, títulos, Chuteiras e Bolas de Ouro, gols, vitórias, overall final dos titulares, média da avaliação do técnico, pacotes, selos, as cinco colocações, o maior goleador do clube e o histórico contra o rival.

Os seis recordes são: mais títulos, mais gols, melhor média de avaliação, maior overall final do XI, mais vitórias e mais vitórias no clássico. Um aviso celebra marcas superadas. Empatar uma marca não conta como novo recorde; a carreira que a atingiu primeiro permanece na placa.

O Hall guarda resumos para comparação. Para continuar uma carreira antiga ainda em andamento, importe o backup correspondente.

## Atualização, backup e saves anteriores

Use **Configurações → Exportar progresso** antes de trocar de versão ou dispositivo. O JSON exportado inclui a carreira, a recompensa permanente, o álbum e o Hall. Entre carreiras, os botões Exportar memórias e Importar backup ficam nas telas do álbum e do Hall.

Uma importação com carreira substitui o jogo atual após a confirmação, enquanto as coleções e os resumos são somados. Um arquivo exportado entre carreiras contém somente as memórias e a recompensa: importá-lo mantém a carreira atual. Importar o mesmo arquivo novamente não duplica entradas no Hall nem cartas no álbum.

Saves anteriores à versão 1.5 continuam funcionando:

- Cartas identificáveis no elenco e nas estatísticas são recuperadas e marcadas como **Recuperada do save**. Não é possível reconstruir todas as cartas vendidas antes desta atualização.
- Uma carreira em andamento pode declarar seu rival uma vez. Confrontos já registrados na temporada atual são recuperados; placares de temporadas anteriores que não estavam no save não são inventados.
- Apelidos cujos critérios podem ser comprovados pelas estatísticas disponíveis são recuperados.
- Uma carreira já concluída entra no Hall ao carregar a atualização.

Tudo fica no armazenamento local do navegador. Limpar os dados do site remove esses registros; o backup permite recuperá-los. Um endereço diferente, outra porta, outro navegador ou uma nova cópia aberta diretamente como arquivo pode ter armazenamento separado.

## Arquivos da implementação

- `js/club-book.js`: rivalidade, critérios dos apelidos, álbum, resumos, recordes e migração.
- `js/club-book-view.js`: telas, detalhes e adesivos SVG cartoon.
- `club-book.css`: layout e adaptação para celular.
- `tests/club-book.test.cjs`: regras, cinco temporadas, persistência e importação.

A versão completa passa pelos 45 testes do motor com `npm test`. Os fluxos de criação, navegação, importação, exportação e troca de carreira também foram exercitados em um ambiente de DOM, sem serviços externos.

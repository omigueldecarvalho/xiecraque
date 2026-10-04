# Atualização do rodapé e das páginas públicas

Este pacote contém somente arquivos novos ou alterados sobre a versão 1.5 do XI, é Craque. Ele não é o jogo completo e não deve ser usado para substituir a pasta inteira do projeto.

## Como aplicar

1. Extraia o ZIP da atualização.
2. Copie seu conteúdo para a pasta do jogo, a mesma que contém `index.html`.
3. Mescle as pastas `assets` e `js` com as existentes e substitua os arquivos de mesmo nome. **Não apague os outros arquivos do jogo.**
4. Se estiver usando o servidor local, reinicie `npm start`. Em hospedagem estática, publique os arquivos atualizados junto com o restante do projeto.
5. Atualize a página com Ctrl+F5. Os links aparecem no rodapé da abertura e também ficam disponíveis durante a carreira.

Os arquivos existentes alterados são `index.html` e `server.cjs`. O motor, o elenco, as regras e as chaves do save não foram modificados. Se você personalizou esses dois arquivos depois da versão anterior, preserve suas alterações ao incorporar este patch.

## O que entrou

- `sobre.html`: história do jogo, autoria de Miguel, apoio do Codex no ChatGPT e links sociais.
- `privacidade.html`: salvamento local, backups, contato, hospedagem, eventual publicidade e Pix.
- `termos.html`: funcionamento gratuito, moedas virtuais, referências de futebol, uso e apoio voluntário.
- `fontes.html`: critério editorial, referências da Semana 01, arte e distinção entre fatos e simulação.
- `contato.html`: e-mail e atalhos para erros, sugestões, revisão ou retirada de conteúdo e patrocínios.
- `como-jogar.html`: guia completo, progresso, carreira, coleção e dúvidas frequentes.
- `apoie.html`: QR Code, Pix Copia e Cola, botão de copiar e opção manual.
- `site-info.css` e `js/site-info.js`: visual das páginas, adaptação do rodapé ao jogo e cópia do Pix.
- `assets/pix-qrcode.png` e `assets/favicon.svg`.
- `robots.txt` e `sitemap.xml`.

## Pix confirmado

O QR Code da imagem enviada inicialmente continha uma chave diferente da do texto. Após a escolha por **Código digitado**, foi gerado um novo QR Code com o Pix Copia e Cola informado na mensagem.

O novo PNG foi decodificado e seu conteúdo confere integralmente com o código da página. A chave termina em `92d583`. O CRC do código também foi validado. Isso verifica a integridade do conteúdo; a transferência continua sendo confirmada exclusivamente no banco.

Não há integração bancária, leitura de saldo, pagamento automático ou consulta de transações. O botão apenas copia o código; se o navegador bloquear a cópia, o texto é selecionado para copiar manualmente.

## Redes e contato

- X: https://x.com/MiguelMaknha
- GitHub: https://github.com/omigueldecarvalho
- E-mail: contato.critikei@gmail.com

Esses perfis foram recuperados do contexto informado anteriormente pelo criador. Para atualizá-los, edite `sobre.html` e `contato.html`, e ajuste o campo `sameAs` dos dados estruturados em `index.html`.

## Domínio e busca

Os endereços canônicos, metadados de compartilhamento, dados estruturados e sitemap usam **https://xiecraque.com.br**. O sitemap lista a página inicial e as sete páginas informativas.

Os links internos terminam em `.html` para também funcionarem ao abrir os arquivos localmente. As URLs canônicas são limpas, como `/sobre`, compatíveis com a hospedagem estática do Cloudflare Pages e com o servidor local atualizado. O servidor continua aceitando as URLs `.html`.

O rodapé, o conteúdo das páginas, os títulos e as descrições estão no HTML entregue, sem depender do JavaScript do jogo. O `robots.txt` permite o rastreamento público e exclui a pasta `tests`.

Depois de publicar no domínio e de o DNS/HTTPS estarem funcionando, você pode informar `https://xiecraque.com.br/sitemap.xml` ao Google Search Console. A atualização não publica o site nem altera DNS.

## Publicidade e transparência

Estas páginas melhoram a informação oferecida ao visitante e a organização do site, mas não garantem aprovação no AdSense ou uma posição na busca.

Nenhuma tag de publicidade ou medição foi adicionada. A política descreve essa versão e explica como uma eventual publicidade do Google pode usar cookies. Antes de ativar anúncios ou ferramentas de análise, ajuste a política aos fornecedores efetivos e configure os controles de consentimento aplicáveis. Não foram inseridos IDs fictícios de anúncios, um `ads.txt` genérico nem um aviso de consentimento sem função.

As páginas esclarecem que nomes de referência podem ser reais, enquanto elencos, atributos, eventos e notícias da carreira são de fantasia. Não afirmam que todos os clubes e atletas são inventados nem que existe licença ou parceria oficial.

Referências para manutenção:

- Guia de SEO do Google: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=pt-BR
- Conteúdo obrigatório na política de privacidade para AdSense: https://support.google.com/adsense/answer/1348695?hl=pt-BR
- Requisitos do AdSense: https://support.google.com/adsense/answer/9724?hl=pt-BR

## Validação realizada

Conteúdo estático, títulos e descrições únicos, dados estruturados, links e âncoras internos, sitemap, URLs públicas e bloqueio de arquivos internos foram conferidos. O fluxo de criação do clube e navegação continua preservando o rodapé. A cópia do Pix foi exercitada com API disponível, permissão negada e seleção manual; nenhum desses caminhos altera o save.

O navegador remoto não conseguiu abrir o endereço local neste ambiente. A verificação de interface foi feita com execução dos scripts em DOM simulado; não houve conferência visual em navegador real.

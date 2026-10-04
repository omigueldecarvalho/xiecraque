/* XI, é Craque: base de fantasia. Notas e atributos são autorais. */
(function (root) {
  'use strict';
  const rows = `
K. Mbappé|FR|ATA|92
E. Haaland|NO|ATA|92
V. Júnior|BR|PE|91
M. Salah|EG|PD|91
J. Bellingham|EN|MEI|90
Rodri|ES|VOL|90
H. Kane|EN|ATA|90
L. Yamal|ES|PD|90
Raphinha|BR|PD|90
O. Dembélé|FR|PD|90
F. Valverde|UY|MC|89
V. van Dijk|NL|ZAG|89
T. Courtois|BE|GOL|89
Alisson|BR|GOL|89
L. Martínez|AR|ATA|89
B. Saka|EN|PD|89
Pedri|ES|MC|89
J. Musiala|DE|MEI|89
F. Wirtz|DE|MEI|89
D. Rice|EN|VOL|88
C. Palmer|EN|MEI|88
B. Fernandes|PT|MEI|88
Vitinha|PT|MC|88
A. Hakimi|MA|LD|88
N. Mendes|PT|LE|88
G. Donnarumma|IT|GOL|88
W. Saliba|FR|ZAG|88
G. Magalhães|BR|ZAG|88
A. Bastoni|IT|ZAG|88
R. Dias|PT|ZAG|88
L. Messi|AR|MEI|88
C. Ronaldo|PT|ATA|87
K. De Bruyne|BE|MEI|87
R. Lewandowski|PL|ATA|87
N. Barella|IT|MC|87
F. de Jong|NL|MC|87
B. Silva|PT|MC|87
M. Ødegaard|NO|MEI|87
A. Griezmann|FR|ATA|87
V. Osimhen|NG|ATA|87
A. Isak|SE|ATA|87
L. Díaz|CO|PE|87
K. Kvaratskhelia|GE|PE|87
J. Álvarez|AR|ATA|87
D. Martínez|AR|GOL|86
J. Oblak|SI|GOL|87
Ederson|BR|GOL|87
M. Maignan|FR|GOL|87
Marquinhos|BR|ZAG|87
T. Hernández|FR|LE|86
T. Alexander-Arnold|EN|LD|86
J. Kimmich|DE|VOL|87
R. Leão|PT|PE|86
Son Heung-min|KR|PE|86
Rodrygo|BR|PD|86
B. Guimarães|BR|VOL|86
A. Mac Allister|AR|MC|86
E. Fernández|AR|MC|85
M. Caicedo|EC|VOL|86
R. Gravenberch|NL|VOL|85
A. Tchouaméni|FR|VOL|85
E. Camavinga|FR|MC|84
D. Szoboszlai|HU|MEI|85
B. Barcola|FR|PE|85
D. Doué|FR|PD|85
João Neves|PT|VOL|86
P. Foden|EN|MEI|86
P. Dybala|AR|MEI|85
R. Lukaku|BE|ATA|84
O. Watkins|EN|ATA|85
B. Šeško|SI|ATA|83
N. Williams|ES|PE|84
A. Gordon|EN|PE|83
G. Martinelli|BR|PE|84
Neymar Jr.|BR|MEI|85
Pedro|BR|ATA|84
G. de Arrascaeta|UY|MEI|85
Gerson|BR|MC|83
Thiago Silva|BR|ZAG|83
Casemiro|BR|VOL|83
P. Coutinho|BR|MEI|82
Lucas Moura|BR|PD|82
G. Jesus|BR|ATA|82
M. Depay|NL|ATA|83
Hulk|BR|ATA|83
Y. Alberto|BR|ATA|81
Luiz Henrique|BR|PD|82
I. Jesus|BR|ATA|80
M. Pereira|BR|MEI|82
Kaio Jorge|BR|ATA|81
G. Gómez|PY|ZAG|83
Murillo|BR|ZAG|84
É. Militão|BR|ZAG|85
Bremer|BR|ZAG|85
G. Mancini|IT|ZAG|83
K. Min-jae|KR|ZAG|84
D. Upamecano|FR|ZAG|84
I. Konaté|FR|ZAG|85
C. Romero|AR|ZAG|85
L. Martínez|AR|ZAG|84
M. de Ligt|NL|ZAG|83
N. Aké|NL|ZAG|83
M. Akanji|CH|ZAG|83
A. Rüdiger|DE|ZAG|86
D. Alaba|AT|ZAG|83
P. Cubarsí|ES|ZAG|83
R. Araújo|UY|ZAG|85
I. Martínez|ES|ZAG|83
P. Torres|ES|ZAG|82
Gonçalo Inácio|PT|ZAG|82
O. Diomande|CI|ZAG|81
L. Yoro|FR|ZAG|80
D. Huijsen|ES|ZAG|82
M. van de Ven|NL|ZAG|83
A. Davies|CA|LE|85
A. Balde|ES|LE|83
A. Robertson|SC|LE|83
M. Cucurella|ES|LE|84
F. Dimarco|IT|LE|85
Grimaldo|ES|LE|85
D. Udogie|IT|LE|82
M. Kerkez|HU|LE|82
R. Aït-Nouri|DZ|LE|82
A. Robinson|US|LE|82
D. Raum|DE|LE|81
João Cancelo|PT|LD|83
D. Carvajal|ES|LD|84
J. Frimpong|NL|LD|84
J. Koundé|FR|LD|85
P. Porro|ES|LD|83
D. Dumfries|NL|LD|83
Diogo Dalot|PT|LD|81
M. Gusto|FR|LD|81
R. James|EN|LD|83
Vanderson|BR|LD|80
Yan Couto|BR|LD|79
Wesley França|BR|LD|80
D. Raya|ES|GOL|86
M. ter Stegen|DE|GOL|85
Diogo Costa|PT|GOL|85
G. Kobel|CH|GOL|86
U. Simón|ES|GOL|85
Y. Sommer|CH|GOL|85
M. Neuer|DE|GOL|84
A. Onana|CM|GOL|82
L. Chevalier|FR|GOL|83
B. Leno|DE|GOL|82
J. Pickford|EN|GOL|83
G. Vicario|IT|GOL|83
A. Areola|FR|GOL|80
R. Sánchez|ES|GOL|80
A. Ramsdale|EN|GOL|80
M. Sels|BE|GOL|81
G. Mamardashvili|GE|GOL|83
A. Lunin|UA|GOL|81
Weverton|BR|GOL|81
Rossi|AR|GOL|81
Hugo Souza|BR|GOL|80
John|BR|GOL|79
Fábio|BR|GOL|80
Everson|BR|GOL|80
S. Rochet|UY|GOL|79
Cássio|BR|GOL|79
R. Cabral|BR|GOL|75
Cleiton|BR|GOL|75
L. Jardim|BR|GOL|78
João Paulo|BR|GOL|76
Marcos Felipe|BR|GOL|75
Jandrei|BR|GOL|72
Gabriel Grando|BR|GOL|73
Tadeu|BR|GOL|74
Matheus Mendes|BR|GOL|73
C. Miguel|BR|GOL|75
Bento|BR|GOL|79
A. Marchesín|AR|GOL|77
Walter|BR|GOL|73
Danilo Fernandes|BR|GOL|70
D. Fernandes|BR|GOL|71
Felipe Alves|BR|GOL|70
K. Navas|CR|GOL|80
Jorginho|IT|VOL|82
Allan|BR|VOL|76
E. Pulgar|CL|VOL|79
A. Moreno|AR|VOL|80
Richard Ríos|CO|MC|81
A. Pereira|BR|MC|80
Danilo|BR|VOL|79
André|BR|VOL|81
J. Gomes|BR|VOL|81
Douglas Luiz|BR|MC|81
Joelinton|BR|MC|82
Paquetá|BR|MEI|82
Oscar|BR|MEI|80
Alan Patrick|BR|MEI|81
E. Ribeiro|BR|MEI|79
J. Rodríguez|CO|MEI|80
N. de la Cruz|UY|MC|81
G. Lo Celso|AR|MEI|81
R. de Paul|AR|MC|83
L. Paredes|AR|VOL|80
E. Palacios|AR|MC|82
G. Xhaka|CH|VOL|84
H. Çalhanoğlu|TR|VOL|86
S. Tonali|IT|VOL|84
S. McTominay|SC|MC|83
Fabián Ruiz|ES|MC|84
Dani Olmo|ES|MEI|84
Gavi|ES|MC|82
F. López|ES|MEI|81
Isco|ES|MEI|84
T. Reijnders|NL|MC|84
T. Koopmeiners|NL|MEI|82
C. Pulisic|US|PD|83
R. Mahrez|DZ|PD|83
S. Mané|SN|PE|82
K. Coman|FR|PE|82
S. Gnabry|DE|PD|82
L. Sané|DE|PD|83
S. Guirassy|GN|ATA|84
J. David|CA|ATA|83
D. Vlahović|RS|ATA|83
V. Gyökeres|SE|ATA|86
Gonçalo Ramos|PT|ATA|81
D. Núñez|UY|ATA|81
R. Højlund|DK|ATA|79
M. Retegui|IT|ATA|82
S. Giménez|MX|ATA|81
J. Duran|CO|ATA|80
Endrick|BR|ATA|78
Estêvão|BR|PD|80
Savinho|BR|PD|82
Ângelo|BR|PD|77
Antony|BR|PD|79
Richarlison|BR|ATA|79
R. Firmino|BR|ATA|80
Gabigol|BR|ATA|78
Dudu|BR|PE|77
Paulinho|BR|PE|81
Raphael Veiga|BR|MEI|81
Maurício|BR|MEI|77
Rony|BR|ATA|76
J. López|AR|ATA|79
V. Roque|BR|ATA|79
B. Henrique|BR|PE|79
Everton Cebolinha|BR|PE|78
L. Araújo|BR|PD|77
Michael|BR|PE|76
S. Lino|BR|PE|80
G. Plata|EC|PD|78
S. El Shaarawy|IT|PE|79
I. Sarr|SN|PD|79
A. Elanga|SE|PD|80
B. Johnson|WA|PD|80
H. Barnes|EN|PE|80
J. Grealish|EN|PE|81
J. Sancho|EN|PE|80
M. Kudus|GH|PD|83
A. Lookman|NG|PE|84
S. Chukwueze|NG|PD|79
T. Kubo|JP|PD|82
K. Mitoma|JP|PE|82
Lee Kang-in|KR|MEI|80
T. Minamino|JP|MEI|79
O. Marmoush|EG|ATA|83
N. Jackson|SN|ATA|81
I. Toney|EN|ATA|81
D. Solanke|EN|ATA|82
C. Wood|NZ|ATA|80
J. Bowen|EN|PD|83
E. Eze|EN|MEI|83
M. Gibbs-White|EN|MEI|82
C. Jones|EN|MC|79
K. Mainoo|EN|MC|78
A. Wharton|EN|VOL|79
A. Gray|EN|VOL|75
L. Miley|EN|MC|73
E. Nwaneri|EN|MEI|76
M. Lewis-Skelly|EN|LE|77
R. Lewis|EN|LD|77
A. Dedić|BA|LD|76
I. Fresneda|ES|LD|73
M. Sugawara|JP|LD|75
Y. Nakayama|JP|LE|70
K. Tsimikas|GR|LE|77
S. Reguilón|ES|LE|76
A. Telles|BR|LE|78
A. Sandro|BR|LE|79
Ayrton Lucas|BR|LE|77
Caio Paulista|BR|LE|74
J. Piquerez|UY|LE|79
Abner|BR|LE|76
Guilherme Arana|BR|LE|79
Hugo|BR|LE|71
Matheus Bidu|BR|LE|73
Reinaldo|BR|LE|73
Diogo Barbosa|BR|LE|72
Marçal|BR|LE|73
Renê|BR|LE|73
Lucas Piton|BR|LE|76
J. Capixaba|BR|LE|76
Patryck|BR|LE|69
Welington|BR|LE|74
Kevyson|BR|LE|68
Marlon|BR|LE|74
F. Bustos|AR|LD|78
Mayke|BR|LD|77
Khellven|BR|LD|76
Igor Vinícius|BR|LD|74
João Moreira|PT|LD|69
N. Ferraresi|VE|ZAG|73
Fagner|BR|LD|73
Matheuzinho|BR|LD|74
Samuel Xavier|BR|LD|76
Guga|BR|LD|73
Mateo Ponte|UY|LD|72
R. Saravia|AR|LD|75
Natanael|BR|LD|72
Gilberto|BR|LD|74
Pedro Lima|BR|LD|70
D. Luiz|BR|ZAG|76
Léo Ortiz|BR|ZAG|80
Léo Pereira|BR|ZAG|79
F. Bruno|BR|ZAG|79
F. Torres|EC|ZAG|76
A. Carlos|BR|ZAG|73
Luan García|BR|ZAG|76
V. Hugo|BR|ZAG|74
Adryelson|BR|ZAG|77
Bastos|AO|ZAG|77
A. Barboza|AR|ZAG|77
L. Halter|BR|ZAG|73
Jair Cunha|BR|ZAG|74
Léo|BR|ZAG|73
J. Victor|BR|ZAG|74
Maicon|BR|ZAG|71
Lyanco|BR|ZAG|75
J. Alonso|PY|ZAG|78
Igor Rabello|BR|ZAG|73
Bruno Fuchs|BR|ZAG|74
Jemerson|BR|ZAG|74
B. Méndez|UY|ZAG|75
Kannemann|AR|ZAG|75
Rodrigo Ely|BR|ZAG|73
G. Martins|BR|ZAG|72
Robert Renan|BR|ZAG|74
Vitão|BR|ZAG|77
Kaique Rocha|BR|ZAG|72
Murilo Cerqueira|BR|ZAG|79
Naves|BR|ZAG|72
João Marcelo|BR|ZAG|73
Zé Ivaldo|BR|ZAG|72
Messias|BR|ZAG|71
Joaquim|BR|ZAG|75
Robson Bambu|BR|ZAG|71
Raul Gustavo|BR|ZAG|71
Cacá|BR|ZAG|73
Gustavo Henrique|BR|ZAG|75
André Ramalho|BR|ZAG|76
Arboleda|EC|ZAG|77
Alan Franco|AR|ZAG|77
Sabino|BR|ZAG|72
Diego Costa|BR|ZAG|74
Luiz Gustavo|BR|VOL|73
Pablo Maia|BR|VOL|77
Alisson Euler|BR|MC|75
Rodrigo Nestor|BR|MC|74
D. Bobadilla|PY|MC|73
Marcos Antônio|BR|MC|73
Liziero|BR|VOL|71
Wellington Rato|BR|PD|73
Ferreirinha|BR|PE|76
Luciano|BR|MEI|77
J. Calleri|AR|ATA|79
A. Franco|EC|MC|76
Otávio|BR|VOL|76
Fausto Vera|AR|VOL|73
Igor Gomes|BR|MEI|73
Patrick|BR|MC|71
Bernard|BR|MEI|77
G. Scarpa|BR|MEI|78
Rubens|BR|LE|72
Cadu|BR|ATA|69
Alisson Santana|BR|PD|71
J. Savarino|VE|MEI|79
T. Almada|AR|MEI|82
T. Tchê|BR|MC|74
M. Freitas|BR|VOL|77
Danilo Barbosa|BR|VOL|73
Kauê|BR|VOL|68
Gregore|BR|VOL|77
Allan Marques|BR|VOL|75
Eduardo|BR|MEI|75
J. Santos|BR|ATA|76
Tiquinho Soares|BR|ATA|77
Matheus Martins|BR|PE|74
Carlos Alberto|BR|PD|70
J. Correa|AR|ATA|77
Y. Soteldo|VE|PE|77
C. Pavón|AR|PD|75
F. Cristaldo|AR|MEI|77
M. Monsalve|CO|MEI|74
M. Villasanti|PY|VOL|78
Pepê|BR|MC|74
Dodi|BR|VOL|72
Edenílson|BR|MC|73
M. Braithwaite|DK|ATA|77
D. Costa|BR|PD|74
A. Canobbio|UY|PD|77
K. Serna|CO|PE|75
J. Arias|CO|PD|82
G. Cano|AR|ATA|79
Keno|BR|PE|74
Lima|BR|MEI|73
Martinelli|BR|VOL|76
Nonato|BR|MC|72
Hércules|BR|MC|77
Facundo Bernal|UY|VOL|75
Thiago Santos|BR|VOL|71
Manoel|BR|ZAG|71
F. Melo|BR|ZAG|70
R. Garro|AR|MEI|80
B. Bidon|BR|MC|75
Maycon|BR|MC|74
Raniele|BR|VOL|74
Alex Santana|BR|MC|72
Charles|BR|VOL|72
José Martínez|VE|VOL|73
Á. Romero|PY|PD|75
Héctor Hernández|ES|ATA|71
Pedro Raul|BR|ATA|72
Giovane|BR|ATA|71
Wesley Gassova|BR|PE|75
Ryan|BR|VOL|69
Diego Hernández|UY|MEI|71
Cauly|BR|MEI|77
Jean Lucas|BR|MC|77
Caio Alexandre|BR|VOL|77
Thaciano|BR|MC|74
L. Rodríguez|UY|ATA|77
Everaldo|BR|ATA|73
Luciano Juba|BR|LE|75
Ademir|BR|PD|74
Biel|BR|PE|73
R. Ratão|BR|ATA|73
Erick|BR|VOL|74
Fernandinho|BR|VOL|78
B. Zapelli|AR|MEI|75
Christian|BR|MC|73
Cuello|AR|PE|77
Pablo|BR|ATA|72
G. Mastriani|UY|ATA|75
Julimar|BR|PD|71
Vitor Bueno|BR|MEI|74
Nikão|BR|MEI|73
R. Muniz|BR|ATA|79
Andrey Santos|BR|MC|79
G. Moscardo|BR|VOL|73
D. Washington|BR|ATA|69
Matheus França|BR|MEI|73
Luis Guilherme|BR|PD|73
G. Pec|BR|PD|78
M. Lacava|VE|PE|70
Praxedes|BR|MC|71
JP|BR|MC|68
Sforza|AR|VOL|72
D. Payet|FR|MEI|77
P. Vegetti|AR|ATA|77
David|BR|PE|72
Adson|BR|PD|73
Rayan|BR|ATA|75
Puma Rodríguez|UY|LD|73
A. Barreal|AR|PE|76
L. Romero|AR|VOL|75
L. Silva|BR|MC|74
Walace|BR|VOL|76
J. Dinenno|AR|ATA|74
Arthur Gomes|BR|PE|72
Vitinho|BR|MEI|71
Japa|BR|MC|68
Ramiro|BR|MC|70
R. Borré|CO|ATA|79
E. Valencia|EC|ATA|78
Wanderson|BR|PE|76
Bruno Tabata|BR|MEI|74
Thiago Maia|BR|VOL|75
Bruno Henrique|BR|MC|73
Rômulo|BR|VOL|72
Gabriel Teixeira|BR|PE|72
Gustavo Prado|BR|MEI|69
Wesley Ribeiro|BR|PE|76
Lucca|BR|ATA|70
Nathan Fernandes|BR|PD|70
Gustavo Nunes|BR|PE|73
Riquelme|BR|LE|68
Gabriel Bontempo|BR|MEI|70
Diego Pituca|BR|MC|75
João Schmidt|BR|VOL|74
Tomás Rincón|VE|VOL|73
Guilherme|BR|PE|76
Otero|VE|MEI|74
Willian Bigode|BR|ATA|71
Wendel Silva|BR|ATA|70
Patrick de Paula|BR|VOL|71
J. Irmer|BR|VOL|69
Diógenes|BR|GOL|75
G. Escobar|AR|LE|77
Willian Arão|BR|ZAG|78
Rhuan|BR|ATA|70
Miguel|BR|MEI|70
Pedro|BR|VOL|70
Guilherme|BR|MEI|70
Gabriel|BR|MC|70
Thiago|BR|GOL|70
Vitor|BR|ATA|70
`; 
  const hash = str => [...str].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),5381);
  const profiles = {
    GOL:[-45,-45,-18,4,-15,4], ZAG:[-18,-32,-13,7,4,-34],
    LE:[7,-19,-4,0,-5,-39], LD:[7,-19,-4,0,-5,-39],
    VOL:[-9,-15,3,3,4,-42], MC:[-4,-5,8,-9,-4,-44],
    MEI:[2,0,9,-30,-13,-44], PE:[10,1,0,-39,-14,-45],
    PD:[10,1,0,-39,-14,-45], ATA:[0,9,-12,-41,2,-45]
  };
  const keys=['vel','fin','pas','def','fis','gol'];
  const players=rows.trim().split('\n').map(line=>line.split('|')).map(([name,nation,pos,ovr],index)=>{
    const id='p'+String(index+1).padStart(3,'0');const h=hash(name+pos);let stats={};
    keys.forEach((key,k)=>stats[key]=Math.max(20,Math.min(97,Number(ovr)+profiles[pos][k]+((h>>>(k*3))%9)-4)));
    return {id,name,nation,pos,ovr:Number(ovr),...stats};
  });
  const teams = [
    ['fla','Flamengo','FLA','#dc2638',82],['pal','Palmeiras','PAL','#1c966a',82],
    ['bot','Botafogo','BOT','#e9edf1',80],['cru','Cruzeiro','CRU','#3484ed',79],
    ['flu','Fluminense','FLU','#a42b55',79],['bah','Bahia','BAH','#4898f3',78],
    ['cor','Corinthians','COR','#d1d5db',78],['atm','Atlético-MG','CAM','#acb4c5',79],
    ['sao','São Paulo','SAO','#e94651',78],['int','Internacional','INT','#f13748',77],
    ['gre','Grêmio','GRE','#54b4e5',77],['san','Santos','SAN','#f3f4f6',76],
    ['vas','Vasco','VAS','#ececec',75],['rbb','Bragantino','RBB','#ea4059',76],
    ['cap','Athletico-PR','CAP','#d83a44',77],['cfc','Coritiba','CFC','#43ad84',74],
    ['vit','Vitória','VIT','#dd3448',73],['mir','Mirassol','MIR','#e2cb4c',74],
    ['cha','Chapecoense','CHA','#54bb6d',72],['rem','Remo','REM','#627bc2',72]
  ].map(([id,name,short,color,rating])=>({id,name,short,color,rating}));
  const formations={
    '4-3-3':[['GOL',50,87],['LE',13,65],['ZAG',37,71],['ZAG',63,71],['LD',87,65],['MC',26,44],['VOL',50,51],['MC',74,44],['PE',16,19],['ATA',50,15],['PD',84,19]],
    '4-2-3-1':[['GOL',50,87],['LE',13,65],['ZAG',37,71],['ZAG',63,71],['LD',87,65],['VOL',33,48],['VOL',67,48],['PE',16,28],['MEI',50,30],['PD',84,28],['ATA',50,11]],
    '4-4-2':[['GOL',50,87],['LE',13,65],['ZAG',37,71],['ZAG',63,71],['LD',87,65],['PE',13,39],['MC',37,45],['MC',63,45],['PD',87,39],['ATA',33,16],['ATA',67,16]],
    '3-5-2':[['GOL',50,87],['ZAG',25,69],['ZAG',50,73],['ZAG',75,69],['LE',10,42],['MC',32,44],['VOL',50,53],['MC',68,44],['LD',90,42],['ATA',33,17],['ATA',67,17]],
    '4-1-2-1-2':[['GOL',50,87],['LE',13,65],['ZAG',37,71],['ZAG',63,71],['LD',87,65],['VOL',50,52],['MC',24,39],['MC',76,39],['MEI',50,28],['ATA',32,11],['ATA',68,11]],
    '5-3-2':[['GOL',50,87],['LE',10,57],['ZAG',29,70],['ZAG',50,74],['ZAG',71,70],['LD',90,57],['MC',27,41],['VOL',50,48],['MC',73,41],['ATA',33,16],['ATA',67,16]]
  };
  const packs=[
    {id:'welcome',name:'Boas-vindas',subtitle:'Seu primeiro reforço de peso',price:0,count:3,min:80,tier:'gold',weights:[0,20,77,3],desc:'3 cartas · 1 jogador 80+ garantido',unlock:0},
    {id:'base',name:'Base',subtitle:'Profundidade para o elenco',price:550,count:3,min:70,tier:'bronze',weights:[57,36,7,0],desc:'3 cartas · 1 jogador 70+ garantido',unlock:1},
    {id:'silver',name:'Prata',subtitle:'Talento que cabe no orçamento',price:1150,count:3,min:75,tier:'silver',weights:[12,73,15,0],desc:'3 cartas · 1 jogador 75+ garantido',unlock:1},
    {id:'gold',name:'Ouro',subtitle:'Um novo protagonista',price:2200,count:3,min:80,tier:'gold',weights:[0,50,48,2],desc:'3 cartas · 1 jogador 80+ garantido',unlock:1},
    {id:'attack',name:'Artilheiro',subtitle:'O próximo dono da camisa 9',price:3100,count:3,min:82,tier:'gold',weights:[0,32,63,5],positions:['PE','PD','ATA'],desc:'3 atacantes · 1 jogador 82+ garantido',unlock:1},
    {id:'defense',name:'Muralha',subtitle:'Seu gol mais protegido',price:3100,count:3,min:82,tier:'gold',weights:[0,32,63,5],positions:['GOL','LE','LD','ZAG','VOL'],desc:'3 defensores · 1 jogador 82+ garantido',unlock:1},
    {id:'choice',name:'A Escolha',subtitle:'Três opções. A decisão é sua.',price:3500,count:3,min:80,max:85,mode:'choice',tier:'choice',weights:[0,0,100,0],desc:'Revele 3 jogadores 80–85 · leve apenas 1',unlock:1},
    {id:'elite',name:'Elite',subtitle:'Para mudar o nível do clube',price:8400,count:4,min:85,tier:'elite',weights:[0,12,73,15],desc:'4 cartas · 1 jogador 85+ garantido',unlock:2},
    {id:'totw',name:'Time da Semana',subtitle:'Os destaques viraram cartas pretas',price:8400,count:4,min:80,tier:'totw',weights:[0,12,73,15],desc:'1 carta da semana + 3 cartas comuns',unlock:1},
    {id:'legend',name:'Galáctico',subtitle:'As estrelas do futebol mundial',price:22500,count:5,min:88,tier:'elite',weights:[0,0,65,35],desc:'5 cartas · 1 jogador 88+ garantido',unlock:3}
  ];
  const captains=players.filter(p=>p.ovr>=80&&p.ovr<=85).map(p=>p.id);
  const tactics={balanced:{name:'Equilibrado',description:'Apoio entre os setores, sem uma aposta extrema.'},possession:{name:'Posse de bola',description:'Passe e meio-campo criam chances; funciona melhor com bons passadores.'},counter:{name:'Contra-ataque',description:'Bloco baixo e velocidade para atacar o espaço.'},press:{name:'Pressão alta',description:'Mais chances dos dois lados. Exige físico e um banco forte.'}};
  const nations={BR:'Brasil',FR:'França',NO:'Noruega',EG:'Egito',EN:'Inglaterra',ES:'Espanha',UY:'Uruguai',NL:'Países Baixos',BE:'Bélgica',AR:'Argentina',DE:'Alemanha',PT:'Portugal',IT:'Itália',MA:'Marrocos',PL:'Polônia',NG:'Nigéria',SE:'Suécia',CO:'Colômbia',GE:'Geórgia',SI:'Eslovênia',KR:'Coreia do Sul',EC:'Equador',HU:'Hungria',PY:'Paraguai',CH:'Suíça',AT:'Áustria',CI:'Costa do Marfim',CA:'Canadá',SC:'Escócia',DZ:'Argélia',US:'Estados Unidos',CM:'Camarões',UA:'Ucrânia',CR:'Costa Rica',CL:'Chile',TR:'Turquia',SN:'Senegal',GN:'Guiné',RS:'Sérvia',MX:'México',DK:'Dinamarca',WA:'País de Gales',GH:'Gana',JP:'Japão',NZ:'Nova Zelândia',BA:'Bósnia',GR:'Grécia',VE:'Venezuela',AO:'Angola'};
  const weekly=typeof module!=='undefined'&&module.exports?require('./weekly.js'):root.OuroWeekly;
  const basePlayers=[...players], editions=new Map();
  for(const edition of weekly.editions){
    if(editions.has(edition.id)||edition.players.length!==11)throw Error('Time da Semana: edição repetida ou sem 11 jogadores.');
    const cards=edition.players.map(entry=>{
      const base=basePlayers.find(p=>p.name===entry.name&&p.pos===entry.pos);
      if(!base||!edition.sources[entry.source])throw Error('Time da Semana: jogador ou fonte inválidos: '+entry.name);
      const card={...base,id:'totw-'+edition.id+'-'+base.id,baseId:base.id,edition:edition.id,special:'totw',editionLabel:edition.label,reason:entry.reason,source:edition.sources[entry.source]};
      for(const [key,bonus] of Object.entries(entry.boost)){
        if(!['ovr',...keys].includes(key)||!Number.isInteger(bonus)||bonus<0)throw Error('Melhoria semanal inválida.');
        card[key]=Math.min(99,base[key]+bonus);
      }
      if(card.ovr<=base.ovr||card.ovr<80)throw Error('A carta semanal precisa de melhoria e de pelo menos 80 OVR.');
      return card;
    });
    if(new Set(cards.map(p=>p.id)).size!==11)throw Error('Time da Semana: jogadores repetidos.');
    editions.set(edition.id,{...edition,cards});players.push(...cards);
  }
  const activeWeek=editions.get(weekly.activeId);
  if(!activeWeek)throw Error('Time da Semana: edição ativa não encontrada.');
  const data={players,basePlayers,byId:Object.fromEntries(players.map(p=>[p.id,p])),teams,formations,packs,captains,tactics,nations,weekly:activeWeek,editions,version:1};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.OuroData=data;
})(typeof window!=='undefined'?window:globalThis);

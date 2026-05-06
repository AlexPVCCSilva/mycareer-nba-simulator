import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CareerStateService } from '../../core/services/career-state';
@Component({
  selector: 'app-nba-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nba-hub.html',
  styleUrl: './nba-hub.css'
})
export class NbaHubComponent implements OnInit {
public careerState = inject(CareerStateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  noticiasMercado: string[] = [];
  rotyCandidates: any[] = [];
  nbaYear = 1;
  bola = { x: 50, y: 50, status: 'posse', time: 'user', dono: 0 };
  
  mostrarRoleta = false; isSpinning = false; roletaRotation = 0; eventoSorteado: any = null;
  mostrarResumo = false; fasesPlayoffs = ['Fora dos Playoffs', 'Play-In', '1º Round', 'Semi de Conferência', 'Final de Conferência', 'Campeão da NBA 🏆']; faseAlcancadaIndex = 0;
  
  timeCasa: any = null;
  estadoJogo: 'passando' | 'arremessando' = 'passando';
  jogadoresUser: any[] = []; jogadoresOpp: any[] = []; logsJogo: string[] = [];

  companheiros: any[] = []; powerRankings: any[] = []; meuTimeOvr = 80;

  entrevistasRestantes = 0; mostrarEntrevista = false; entrevistaAtual: any = null;
  bancoEntrevistas = [
    // --- PERFORMANCE EM QUADRA ---
    { p: '"Você quebrou o recorde de pontos hoje. Qual o segredo?"', c1: { t: '"Eu sou inevitável, ninguém me marca."', ovr: 2, fans: 150000, q: -10, r: 0 }, c2: { t: '"Meus companheiros me acharam livre."', ovr: 1, fans: 40000, q: 20, r: 15 } },
    { p: '"O time tomou uma virada histórica. De quem é a culpa?"', c1: { t: '"Faltou ajuda dos outros caras."', ovr: 0, fans: 20000, q: -30, r: -15 }, c2: { t: '"A culpa é minha, assumo a responsabilidade."', ovr: 1, fans: 50000, q: 15, r: 25 } },
    { p: '"Seu aproveitamento de arremessos foi terrível hoje..."', c1: { t: '"Mamba Mentality, vou continuar chutando."', ovr: -1, fans: 80000, q: -15, r: -5 }, c2: { t: '"Vou voltar pro ginásio e treinar mais."', ovr: 2, fans: 10000, q: 5, r: 20 } },
    { p: '"Você fez o arremesso da vitória! Como se sente?"', c1: { t: '"Ice in my veins! Nasci pra isso."', ovr: 2, fans: 200000, q: -5, r: 5 }, c2: { t: '"Foi a jogada desenhada pelo técnico."', ovr: 1, fans: 50000, q: 10, r: 20 } },
    { p: '"O astro do outro time te anulou completamente. Comentários?"', c1: { t: '"Ele deu sorte hoje. Quero ver no próximo."', ovr: 1, fans: 60000, q: 0, r: -10 }, c2: { t: '"Ele é um grande defensor, mérito dele."', ovr: 0, fans: -10000, q: 5, r: 15 } },

    // --- RELAÇÃO COM TÉCNICO E DIRETORIA ---
    { p: '"O técnico te deu uma bronca feia na beira da quadra..."', c1: { t: '"Ele é ultrapassado, não entende meu jogo."', ovr: -1, fans: 50000, q: -15, r: -40 }, c2: { t: '"Ele quer o meu melhor, faz parte."', ovr: 1, fans: 5000, q: 10, r: 25 } },
    { p: '"Tem rumores de que você exigiu ser trocado. É verdade?"', c1: { t: '"Se a diretoria não ajudar, eu vazo."', ovr: 0, fans: 100000, q: -25, r: -35 }, c2: { t: '"Fake news. Amo essa franquia."', ovr: 1, fans: 60000, q: 20, r: 20 } },
    { p: '"Seu tempo de quadra diminuiu nos últimos jogos."', c1: { t: '"Pergunte ao gênio do nosso treinador."', ovr: -1, fans: 30000, q: -10, r: -30 }, c2: { t: '"Estou focado em ajudar quando for chamado."', ovr: 1, fans: 10000, q: 15, r: 20 } },
    { p: '"O GM disse que o time está em reconstrução. O que acha?"', c1: { t: '"Eu não tenho tempo pra perder, quero anel."', ovr: 0, fans: 40000, q: -10, r: -20 }, c2: { t: '"Confio no processo da diretoria."', ovr: 0, fans: -5000, q: 5, r: 25 } },

    // --- RELAÇÃO COM O ELENCO ---
    { p: '"Seu armador não te passou a bola na posse final. Rachou o elenco?"', c1: { t: '"Ele foi egoísta, eu tava livre."', ovr: 0, fans: 50000, q: -35, r: -10 }, c2: { t: '"Confiamos um no outro, acontece."', ovr: 0, fans: -10000, q: 25, r: 15 } },
    { p: '"Um calouro do seu time está roubando a cena. Incomoda?"', c1: { t: '"Eu sou o dono desse time, não esqueçam."', ovr: 0, fans: 30000, q: -20, r: -5 }, c2: { t: '"O moleque é bom, vou ser o mentor dele."', ovr: 1, fans: 80000, q: 20, r: 15 } },
    { p: '"Você gritou com o pivô do seu time na defesa. O que houve?"', c1: { t: '"Ele tava dormindo, tive que acordar ele."', ovr: -1, fans: 40000, q: -25, r: -5 }, c2: { t: '"Só energia do jogo, já nos acertamos."', ovr: 0, fans: 10000, q: 10, r: 10 } },
    { p: '"Sua química com o outro astro do time está péssima..."', c1: { t: '"A quadra é pequena pra nós dois."', ovr: -1, fans: 100000, q: -40, r: -20 }, c2: { t: '"Estamos descobrindo como jogar juntos."', ovr: 1, fans: 10000, q: 15, r: 10 } },

    // --- POLÊMICAS E VESTIÁRIO ---
    { p: '"Vazou um vídeo seu em uma festa às 3 da manhã antes do jogo..."', c1: { t: '"Fiz 30 pontos hoje, me deixem em paz."', ovr: -1, fans: 150000, q: -15, r: -30 }, c2: { t: '"Fui imaturo. Peço desculpas à torcida."', ovr: 1, fans: -20000, q: 10, r: 20 } },
    { p: '"Você curtiu um post falando mal da sua própria equipe. Foi sem querer?"', c1: { t: '"Eu curti porque achei engraçado. É a vida."', ovr: -2, fans: 120000, q: -30, r: -40 }, c2: { t: '"Fui hackeado, já troquei a senha."', ovr: 0, fans: -10000, q: 0, r: -5 } },
    { p: '"Um analista da ESPN disse que você é superestimado."', c1: { t: '"Ele nunca pisou numa quadra, é um palhaço."', ovr: 0, fans: 80000, q: 0, r: -10 }, c2: { t: '"Uso isso como motivação pra treinar."', ovr: 2, fans: 40000, q: 5, r: 15 } },
    { p: '"O seu rival te provocou no Twitter. Vai responder?"', c1: { t: '"Falo com ele na quadra, vou amassar ele."', ovr: 2, fans: 100000, q: -5, r: 0 }, c2: { t: '"Não perco tempo com internet."', ovr: 1, fans: 20000, q: 10, r: 10 } },
    { p: '"Você chegou atrasado no treino de hoje. Por quê?"', c1: { t: '"O trânsito tava ruim, me deixa jogar."', ovr: -1, fans: 10000, q: -10, r: -25 }, c2: { t: '"Erro meu, pagarei a multa sem reclamar."', ovr: 0, fans: 0, q: 5, r: 20 } },

    // --- MÍDIA, FÃS E NEGÓCIOS ---
    { p: '"Sua linha de tênis esgotou em 10 minutos!"', c1: { t: '"Todos sabem quem é a cara da NBA agora."', ovr: 1, fans: 200000, q: -10, r: -5 }, c2: { t: '"Agradeço aos meus fãs pelo apoio irreal!"', ovr: 0, fans: 150000, q: 5, r: 5 } },
    { p: '"Você acha que merece ser o MVP dessa temporada?"', c1: { t: '"Se eu não for, o prêmio é uma piada."', ovr: 1, fans: 120000, q: -15, r: -10 }, c2: { t: '"Há grandes jogadores, o título importa mais."', ovr: 1, fans: 40000, q: 15, r: 15 } },
    { p: '"O jogo de hoje parecia fácil. Foi chato de jogar?"', c1: { t: '"Os caras nem entraram em quadra, amassei."', ovr: 0, fans: 80000, q: -5, r: -15 }, c2: { t: '"Respeitamos o adversário e fizemos o nosso."', ovr: 1, fans: 20000, q: 10, r: 15 } },
    { p: '"Você vai assinar com qual agência esportiva?"', c1: { t: '"A que me pagar mais. Basquete é negócio."', ovr: 0, fans: -30000, q: -5, r: -15 }, c2: { t: '"Estou focado na temporada, meu agente cuida disso."', ovr: 1, fans: 30000, q: 10, r: 10 } },
    { p: '"Você foi flagrado discutindo com um fã na arquibancada..."', c1: { t: '"Eles acham que compraram ingresso e podem tudo."', ovr: -2, fans: -100000, q: -10, r: -20 }, c2: { t: '"Perdi a cabeça no calor do momento, sinto muito."', ovr: 0, fans: 10000, q: 5, r: 10 } },
    { p: '"Seu time tá numa sequência de 5 vitórias. Estão imbatíveis?"', c1: { t: '"Pode vir qualquer um, vamos passar o trator."', ovr: 1, fans: 90000, q: -5, r: -5 }, c2: { t: '"Manter a humildade e pensar jogo a jogo."', ovr: 1, fans: 30000, q: 15, r: 15 } },
    
    // --- MAIS POLÊMICAS (Ameaça de Demissão Real) ---
    { p: '"Um repórter disse que você é um câncer pro vestiário..."', c1: { t: '"Eu carrego esses encostados nas costas!"', ovr: 0, fans: 150000, q: -50, r: -40 }, c2: { t: '"Isso é mentira, amo meus irmãos de equipe."', ovr: 0, fans: 20000, q: 20, r: 10 } },
    { p: '"O dono da franquia criticou o esforço do time. Concorda?"', c1: { t: '"Ele que pague mais imposto de luxo e traga ajuda."', ovr: -1, fans: 100000, q: 0, r: -50 }, c2: { t: '"Ele tem o direito de cobrar. Vamos melhorar."', ovr: 1, fans: 10000, q: 10, r: 25 } }
  ];

  mostrarNarrativaFinal = false; linhasNarrativa: string[] = [];
  isAposentado = false; melhoresTemporadas: any[] = [];
  mostrarFreeAgency = false; ofertasContrato: any[] = []; 

  mostrarPlayoffsLive = false; rodadaAtualPlayoff = 1; oponenteAtual: any = null;
  placarUser = 0; placarOponente = 0; tempoJogo = 48; intervaloJogo: any; eventoPlayoffAtual: any = null;
  partidaEncerrada = false;

  cartasDaPartida: any[] = [];
  cartaAtual: any = null;
  turnoAtual = 0;
  maxTurnos = 6;
  ultimoResultado = '';

  elencosNba: { [team: string]: any[] } = {};

  bancoDeJogadores = [
    { nome: 'J. Tatum', pos: 'SF', ovr: 96, time: 'bos' }, { nome: 'J. Brown', pos: 'SG', ovr: 92, time: 'bos' }, { nome: 'K. Porzingis', pos: 'C', ovr: 87, time: 'bos' }, { nome: 'D. White', pos: 'PG', ovr: 86, time: 'bos' },
    { nome: 'L. James', pos: 'SF', ovr: 96, time: 'lal' }, { nome: 'A. Davis', pos: 'PF', ovr: 94, time: 'lal' }, { nome: 'D. Russell', pos: 'PG', ovr: 81, time: 'lal' }, { nome: 'A. Reaves', pos: 'SG', ovr: 81, time: 'lal' },
    { nome: 'N. Jokic', pos: 'C', ovr: 98, time: 'den' }, { nome: 'J. Murray', pos: 'PG', ovr: 88, time: 'den' }, { nome: 'A. Gordon', pos: 'PF', ovr: 84, time: 'den' }, { nome: 'M. Porter Jr', pos: 'SF', ovr: 83, time: 'den' },
    { nome: 'S. Curry', pos: 'PG', ovr: 95, time: 'gs' }, { nome: 'K. Thompson', pos: 'SG', ovr: 83, time: 'gs' }, { nome: 'D. Green', pos: 'PF', ovr: 83, time: 'gs' }, { nome: 'J. Kuminga', pos: 'PF', ovr: 81, time: 'gs' },
    { nome: 'L. Doncic', pos: 'PG', ovr: 97, time: 'dal' }, { nome: 'K. Irving', pos: 'SG', ovr: 90, time: 'dal' }, { nome: 'D. Lively', pos: 'C', ovr: 81, time: 'dal' }, { nome: 'P. Washington', pos: 'PF', ovr: 80, time: 'dal' },
    { nome: 'G. Antetokounmpo', pos: 'PF', ovr: 97, time: 'mil' }, { nome: 'D. Lillard', pos: 'PG', ovr: 89, time: 'mil' }, { nome: 'K. Middleton', pos: 'SF', ovr: 84, time: 'mil' }, { nome: 'B. Lopez', pos: 'C', ovr: 82, time: 'mil' },
    { nome: 'K. Durant', pos: 'PF', ovr: 96, time: 'phx' }, { nome: 'D. Booker', pos: 'SG', ovr: 94, time: 'phx' }, { nome: 'B. Beal', pos: 'SG', ovr: 85, time: 'phx' }, { nome: 'J. Nurkic', pos: 'C', ovr: 82, time: 'phx' },
    { nome: 'S. Gilgeous-Alexander', pos: 'PG', ovr: 96, time: 'okc' }, { nome: 'J. Williams', pos: 'SF', ovr: 86, time: 'okc' }, { nome: 'C. Holmgren', pos: 'C', ovr: 87, time: 'okc' },
    { nome: 'A. Edwards', pos: 'SG', ovr: 93, time: 'min' }, { nome: 'K. Towns', pos: 'C', ovr: 89, time: 'min' }, { nome: 'R. Gobert', pos: 'C', ovr: 85, time: 'min' },
    { nome: 'J. Embiid', pos: 'C', ovr: 96, time: 'phi' }, { nome: 'T. Maxey', pos: 'PG', ovr: 89, time: 'phi' }, { nome: 'T. Harris', pos: 'PF', ovr: 82, time: 'phi' },
    { nome: 'J. Brunson', pos: 'PG', ovr: 93, time: 'ny' }, { nome: 'J. Randle', pos: 'PF', ovr: 85, time: 'ny' }, { nome: 'O. Anunoby', pos: 'SF', ovr: 84, time: 'ny' },
    { nome: 'J. Butler', pos: 'SF', ovr: 93, time: 'mia' }, { nome: 'B. Adebayo', pos: 'C', ovr: 87, time: 'mia' }, { nome: 'T. Herro', pos: 'SG', ovr: 83, time: 'mia' },
    { nome: 'V. Wembanyama', pos: 'C', ovr: 91, time: 'sa' }, { nome: 'D. Vassell', pos: 'SG', ovr: 82, time: 'sa' }, { nome: 'K. Johnson', pos: 'SF', ovr: 81, time: 'sa' },
    { nome: 'T. Young', pos: 'PG', ovr: 89, time: 'atl' }, { nome: 'D. Murray', pos: 'SG', ovr: 84, time: 'atl' },
    { nome: 'C. Thomas', pos: 'SG', ovr: 83, time: 'bkn' }, { nome: 'M. Bridges', pos: 'SF', ovr: 84, time: 'bkn' },
    { nome: 'L. Ball', pos: 'PG', ovr: 87, time: 'cha' }, { nome: 'M. Bridges', pos: 'PF', ovr: 83, time: 'cha' },
    { nome: 'Z. LaVine', pos: 'SG', ovr: 85, time: 'chi' }, { nome: 'D. DeRozan', pos: 'SF', ovr: 86, time: 'chi' },
    { nome: 'D. Mitchell', pos: 'SG', ovr: 92, time: 'cle' }, { nome: 'D. Garland', pos: 'PG', ovr: 84, time: 'cle' }, { nome: 'E. Mobley', pos: 'PF', ovr: 84, time: 'cle' },
    { nome: 'C. Cunningham', pos: 'PG', ovr: 86, time: 'det' }, { nome: 'J. Duren', pos: 'C', ovr: 82, time: 'det' },
    { nome: 'A. Sengun', pos: 'C', ovr: 88, time: 'hou' }, { nome: 'F. VanVleet', pos: 'PG', ovr: 84, time: 'hou' },
    { nome: 'T. Haliburton', pos: 'PG', ovr: 90, time: 'ind' }, { nome: 'P. Siakam', pos: 'PF', ovr: 87, time: 'ind' },
    { nome: 'K. Leonard', pos: 'SF', ovr: 93, time: 'lac' }, { nome: 'P. George', pos: 'SG', ovr: 89, time: 'lac' }, { nome: 'J. Harden', pos: 'PG', ovr: 86, time: 'lac' },
    { nome: 'J. Morant', pos: 'PG', ovr: 90, time: 'mem' }, { nome: 'J. Jackson Jr', pos: 'PF', ovr: 86, time: 'mem' }, { nome: 'D. Bane', pos: 'SG', ovr: 85, time: 'mem' },
    { nome: 'Z. Williamson', pos: 'PF', ovr: 89, time: 'no' }, { nome: 'B. Ingram', pos: 'SF', ovr: 85, time: 'no' }, { nome: 'C. McCollum', pos: 'SG', ovr: 84, time: 'no' },
    { nome: 'P. Banchero', pos: 'PF', ovr: 89, time: 'orl' }, { nome: 'F. Wagner', pos: 'SF', ovr: 85, time: 'orl' },
    { nome: 'A. Simons', pos: 'SG', ovr: 83, time: 'por' }, { nome: 'J. Grant', pos: 'PF', ovr: 82, time: 'por' },
    { nome: 'D. Fox', pos: 'PG', ovr: 90, time: 'sac' }, { nome: 'D. Sabonis', pos: 'C', ovr: 88, time: 'sac' },
    { nome: 'S. Barnes', pos: 'SF', ovr: 88, time: 'tor' }, { nome: 'R. Barrett', pos: 'SG', ovr: 83, time: 'tor' },
    { nome: 'L. Markkanen', pos: 'PF', ovr: 87, time: 'utah' }, { nome: 'C. Sexton', pos: 'SG', ovr: 83, time: 'utah' },
    { nome: 'K. Kuzma', pos: 'PF', ovr: 83, time: 'was' }, { nome: 'J. Poole', pos: 'SG', ovr: 80, time: 'was' }
  ];


  eventosNba = [
    { nome: 'All-Star Game', ovr: 4, fans: 500000, color: '#00529b', msg: 'Chamado pro Jogo das Estrelas!' },
    { nome: 'Shaqtin a Fool', ovr: -2, fans: -50000, color: '#fdb927', msg: 'Errou bandeja livre, virou piada.' },
    { nome: 'Posterizou Estrela', ovr: 3, fans: 300000, color: '#ff4500', msg: 'Enterrou na cabeça do pivô rival!' },
    { nome: 'Lesão no Joelho', ovr: -3, fans: -20000, color: '#e60000', msg: 'Perdeu metade da temporada.' },
    { nome: 'Treino com Lendas', ovr: 5, fans: 100000, color: '#00ffcc', msg: 'Evoluiu absurdamente nas férias.' },
    { nome: 'Rookie Wall', ovr: -1, fans: -10000, color: '#888888', msg: 'Cansaço da liga bateu forte.' },
    { nome: 'Buzzer Beater', ovr: 2, fans: 200000, color: '#32cd32', msg: 'Meteu a bola do jogo no estouro!' },
    { nome: 'Panela no Vestiário', ovr: -2, fans: -10000, color: '#a0522d', msg: 'Ninguém te passa a bola.' },
    { nome: 'MVP do Mês', ovr: 3, fans: 400000, color: '#ffd700', msg: 'Amassou todo mundo no mês.' },
    { nome: 'Tênis Rasgou', ovr: -1, fans: -5000, color: '#ff00ff', msg: 'Torceu o pé de leve no jogo.' },
    { nome: 'Recorde da Franquia', ovr: 4, fans: 350000, color: '#e50914', msg: 'Bateu recorde histórico do time.' },
    { nome: 'Torneio de 3pts', ovr: 3, fans: 250000, color: '#ff8c00', msg: 'Ganhou o torneio no All-Star!' },
    { nome: 'Dormiu no Vídeo', ovr: -2, fans: -50000, color: '#4b0082', msg: 'Dormiu na sessão de tática. Punido.' },
    { nome: 'DPOY Candidato', ovr: 4, fans: 200000, color: '#00ced1', msg: 'Colocou os rivais no bolso na defesa.' },
    { nome: 'Nova Dieta', ovr: 2, fans: 10000, color: '#7cfc00', msg: 'Perdeu gordura, ficou mais rápido.' },
    { nome: 'Atrasou pro Jogo', ovr: -2, fans: -40000, color: '#dc143c', msg: 'Barrado pelo técnico.' },
    { nome: '50 Pontos!', ovr: 5, fans: 600000, color: '#ff1493', msg: 'A mão tava pegando fogo!' },
    { nome: 'Expulso 1º Qtr', ovr: -1, fans: -30000, color: '#ff0000', msg: 'Fez duas faltas técnicas seguidas.' },
    { nome: 'Técnico Demitido', ovr: -1, fans: -10000, color: '#8b0000', msg: 'Esquema tático virou uma bagunça.' },
    { nome: 'Novo Técnico', ovr: 2, fans: 50000, color: '#2e8b57', msg: 'O esquema novo favorece seu jogo.' },
    { nome: 'Briga no Treino', ovr: -2, fans: 20000, color: '#b22222', msg: 'Socou o armador do seu time.' },
    { nome: 'Ficou Doente', ovr: -1, fans: -5000, color: '#556b2f', msg: 'Gripe forte, perdeu 5 jogos.' },
    { nome: 'Aprendeu Skyhook', ovr: 3, fans: 80000, color: '#8a2be2', msg: 'Adicionou um gancho imparável.' },
    { nome: 'Triple-Double', ovr: 4, fans: 300000, color: '#00ffff', msg: 'Fez de tudo em quadra.' },
    { nome: 'Airball no Fim', ovr: -3, fans: -100000, color: '#ff6347', msg: 'Errou tudo na hora de decidir.' },
    { nome: 'Quebrou a Tabela', ovr: 4, fans: 500000, color: '#b8860b', msg: 'Enterrada monstruosa no garrafão!' },
    { nome: 'Esqueceu a Jogada', ovr: -2, fans: -40000, color: '#d2b48c', msg: 'Técnico gritou com você na TV.' },
    { nome: 'Defendeu o Giannis', ovr: 3, fans: 150000, color: '#20b2aa', msg: 'Deu toco absurdo no MVP.' },
    { nome: '20 Assistências', ovr: 3, fans: 150000, color: '#00fa9a', msg: 'Deu aula de passe no jogo.' },
    { nome: '10 Tocos', ovr: 3, fans: 180000, color: '#4682b4', msg: 'Virou um muro na defesa.' },
    { nome: 'Rebaixado G-League', ovr: -4, fans: -150000, color: '#696969', msg: 'Jogou mal e foi rebaixado temporariamente.' },
    { nome: 'Titular Absoluto', ovr: 3, fans: 100000, color: '#ffd700', msg: 'Ganhou a vaga no quinteto principal!' },
    { nome: '6º Homem do Ano', ovr: 2, fans: 120000, color: '#da70d6', msg: 'Amassou vindo do banco.' },
    { nome: 'Falta Flagrante', ovr: -1, fans: -20000, color: '#ff4500', msg: 'Machucou um adversário sem querer.' },
    { nome: '100% FG no Jogo', ovr: 4, fans: 250000, color: '#32cd32', msg: 'Não errou nenhum arremesso.' },
    { nome: 'Elogio do Popovich', ovr: 2, fans: 80000, color: '#c0c0c0', msg: 'Lenda te chamou de gênio.' },
    { nome: 'Cestinha da Liga', ovr: 5, fans: 700000, color: '#ff1493', msg: 'Ninguém pontua mais que você.' },
    { nome: 'Roubo Decisivo', ovr: 2, fans: 150000, color: '#00ced1', msg: 'Roubou a bola na última posse.' },
    { nome: 'Fominha Demais', ovr: -2, fans: -50000, color: '#8b4513', msg: 'Chutou 30 bolas, acertou 5.' },
    { nome: 'Flop Descarado', ovr: -1, fans: -60000, color: '#ff69b4', msg: 'Tomou multa por simular falta.' },
    { nome: 'Entorse no Dedo', ovr: -1, fans: -10000, color: '#cd5c5c', msg: 'Arremesso ficou torto o mês todo.' },
    { nome: 'Treino Extra', ovr: 2, fans: 20000, color: '#2e8b57', msg: 'Ficou arremessando até apagar a luz.' },
    { nome: 'Entrosamento Top', ovr: 3, fans: 100000, color: '#1e90ff', msg: 'A química do time tá em 100%.' },
    { nome: 'Cortado da Rotação', ovr: -3, fans: -80000, color: '#800000', msg: 'Foi pro fundo do banco de reservas.' },
    { nome: 'Líder de Rebotes', ovr: 3, fans: 200000, color: '#8a2be2', msg: 'Dominou o garrafão a temporada toda.' },
    { nome: 'Rei do Pick n Roll', ovr: 2, fans: 90000, color: '#ff8c00', msg: 'Jogada imparável com o pivô.' },
    { nome: 'Defesa Vazada', ovr: -2, fans: -40000, color: '#a9a9a9', msg: 'Tomou backdoor o ano inteiro.' },
    { nome: 'Chute do Meio', ovr: 2, fans: 250000, color: '#00bfff', msg: 'Fez cesta do logotipo de quadra.' },
    { nome: 'Lance Livre Ruim', ovr: -2, fans: -30000, color: '#d2691e', msg: 'Hack-a-Você. Errou tudo na linha.' },
    { nome: 'Clutch Player', ovr: 4, fans: 400000, color: '#ffd700', msg: 'Frio e calculista no 4º quarto.' }
  ];

  getBancoDeCartas(nomeRival: string) {
    return [
      // ATAQUE
      { txt: `Você pega a bola no perímetro e ${nomeRival} vem te marcar fechado.`, c1: { t: 'Chamar pro X1', d: -0.1, s: {pu:3, po:0, q:0, r:10, fa:20000, tx:`Deixou ${nomeRival} no chão e cravou de 3!`}, f: {pu:0, po:3, q:-10, r:-10, fa:-10000, tx:`Tomou um toco humilhante de ${nomeRival} que virou contra-ataque.`} }, c2: { t: 'Pedir Corta-Luz', d: 0.2, s: {pu:2, po:0, q:10, r:5, fa:0, tx:'Leitura perfeita, pick and roll executado com sucesso.'}, f: {pu:0, po:2, q:-5, r:-5, fa:0, tx:'Passe interceptado, defesa leu a jogada.'} } },
      { txt: `Contra-ataque rápido! Você e ${nomeRival} correndo pro aro.`, c1: { t: 'Tentar o Poster', d: -0.2, s: {pu:2, po:0, q:5, r:15, fa:50000, tx:`ENTERROU NA CABEÇA DE ${nomeRival.toUpperCase()}! A arena explodiu!`}, f: {pu:0, po:0, q:-5, r:-10, fa:-5000, tx:`Faltou perna. Fomos parados no ar.`} }, c2: { t: 'Bandeja no Eurostep', d: 0.1, s: {pu:2, po:0, q:5, r:5, fa:5000, tx:'Passou liso pelo defensor e guardou.'}, f: {pu:0, po:0, q:-5, r:-5, fa:0, tx:'Errou a passada e a bola bateu no aro.'} } },
      { txt: `O cronômetro tá estourando (3s). A bola sobrou pra você na logo.`, c1: { t: 'Rezar e chutar', d: -0.3, s: {pu:3, po:0, q:10, r:20, fa:80000, tx:`BUZZER BEATER DO MEIO DA RUA!`}, f: {pu:0, po:0, q:0, r:-5, fa:0, tx:`Tijolada na tabela, posse de bola perdida.`} }, c2: { t: 'Forçar o contato', d: -0.05, s: {pu:2, po:0, q:5, r:5, fa:0, tx:'Cavou a falta malandra e guardou os lances livres.'}, f: {pu:0, po:0, q:-5, r:-10, fa:-10000, tx:`Flop feio. Juiz mandou seguir e passamos vergonha.`} } },
      { txt: `Seu pivô tá livre no garrafão, mas você tem espaço pra chutar.`, c1: { t: 'Chutar (Fominha)', d: 0.0, s: {pu:3, po:0, q:-15, r:5, fa:10000, tx:`A bola entrou, mas o pivô reclamou do passe.`}, f: {pu:0, po:2, q:-25, r:-15, fa:-5000, tx:`Errou o arremesso e o time inteiro te fuzilou com os olhos.`} }, c2: { t: 'Tocar pro pivô', d: 0.3, s: {pu:2, po:0, q:20, r:10, fa:0, tx:'Passe açucarado, enterrada fácil.'}, f: {pu:0, po:0, q:5, r:0, fa:0, tx:'Pivô bagre deixou a bola escorregar.'} } },
      { txt: `${nomeRival} caiu no seu pump-fake e voou na marcação!`, c1: { t: 'Esperar o contato', d: 0.1, s: {pu:2, po:0, q:5, r:10, fa:5000, tx:`And one! Cesta e falta.`}, f: {pu:0, po:2, q:-5, r:-10, fa:0, tx:`Cavou a falta mal e o juiz marcou falta ofensiva.`} }, c2: { t: 'Infiltrar livre', d: 0.3, s: {pu:2, po:0, q:10, r:5, fa:5000, tx:'Deixou ele voando e fez a bandeja livre.'}, f: {pu:0, po:0, q:-10, r:-10, fa:0, tx:'Tropeçou no próprio pé e perdeu a bola.'} } },
      
      // DEFESA
      { txt: `${nomeRival} chamou o isolamento contra você. A torcida levantou.`, c1: { t: 'Dar o bote pra roubar', d: -0.15, s: {pu:2, po:0, q:10, r:20, fa:30000, tx:`Batedor de carteiras! Roubou e cravou do outro lado.`}, f: {pu:0, po:3, q:-10, r:-15, fa:-10000, tx:`Tomou um drible desconcertante e ${nomeRival} guardou de 3.`} }, c2: { t: 'Marcar recuado', d: 0.1, s: {pu:0, po:0, q:10, r:10, fa:0, tx:`Ótima postura, forçou o erro no estouro.`}, f: {pu:0, po:2, q:0, r:-5, fa:0, tx:`Ele fez o arremesso mesmo contestado.`} } },
      { txt: `${nomeRival} infiltrou e tá indo pro arremesso em cima do seu pivô.`, c1: { t: 'Ajudar no Toco', d: -0.1, s: {pu:0, po:0, q:15, r:20, fa:20000, tx:`Pregou a bola na tabela! O ginásio foi abaixo!`}, f: {pu:0, po:2, q:-5, r:-5, fa:0, tx:`Chegou atrasado e tomou a enterrada na cabeça junto.`} }, c2: { t: 'Ficar no seu marcador', d: 0.2, s: {pu:0, po:0, q:5, r:5, fa:0, tx:`Seu pivô resolveu o problema sozinho.`}, f: {pu:0, po:3, q:-10, r:-5, fa:0, tx:`Seu marcador ficou livre e tomamos bola de 3 na sobra.`} } },
      { txt: `Passe ruim da defesa! A bola tá dividida rolando pro banco.`, c1: { t: 'Mergulhar na bola', d: -0.05, s: {pu:2, po:0, q:25, r:30, fa:40000, tx:`HUSTLE! Salvou a posse caindo na torcida e pontuamos!`}, f: {pu:0, po:2, q:0, r:-10, fa:0, tx:`Caiu errado, perdeu a bola e tomou um balde de pipoca na cara.`} }, c2: { t: 'Deixar sair', d: 0.4, s: {pu:0, po:0, q:0, r:0, fa:0, tx:'A bola saiu, reposição da defesa.'}, f: {pu:0, po:2, q:-15, r:-20, fa:-10000, tx:`Faltou raça. O técnico te olhou com nojo e eles pontuaram.`} } },
      { txt: `Contra-ataque 3x1 pro adversário. Você é o único defensor.`, c1: { t: 'Fazer a falta dura', d: 0.2, s: {pu:0, po:1, q:10, r:15, fa:0, tx:`Falta tática perfeita. Evitou a enterrada fácil.`}, f: {pu:0, po:2, q:-5, r:-15, fa:-5000, tx:`Falta flagrante! Deu os lances livres e a posse.`} }, c2: { t: 'Tentar adivinhar o passe', d: -0.2, s: {pu:2, po:0, q:15, r:25, fa:50000, tx:`LEITURA MÁGICA! Interceptou e cravou no contra-ataque!`}, f: {pu:0, po:3, q:-10, r:-10, fa:-5000, tx:`Tentou adivinhar, deixou o atirador livre pra bola de 3.`} } },
      { txt: `${nomeRival} começa a fazer Trash Talk pesado com você.`, c1: { t: 'Falar de volta e empurrar', d: -0.1, s: {pu:0, po:0, q:15, r:10, fa:30000, tx:`Você não deita pra ninguém! Torcida amou a treta.`}, f: {pu:0, po:2, q:-15, r:-25, fa:-20000, tx:`Tomou falta técnica igual um idiota descontrolado.`} }, c2: { t: 'Focar no jogo', d: 0.2, s: {pu:2, po:0, q:10, r:15, fa:0, tx:`Mamba mentality. Respondeu com cesta na cara dele.`}, f: {pu:0, po:2, q:-10, r:-10, fa:0, tx:`Ficou desconcentrado e ele pontuou em cima de você.`} } },

      // CLUTCH & VESTIÁRIO
      { txt: `O técnico desenha uma jogada lixo no tempo, mas você viu uma brecha na defesa.`, c1: { t: 'Ignorar o técnico e improvisar', d: -0.2, s: {pu:3, po:0, q:-10, r:20, fa:40000, tx:`Quebrou a prancheta e meteu a bola de 3! Você é o dono do time.`}, f: {pu:0, po:2, q:-30, r:-40, fa:-20000, tx:`Improvisou, errou e o treinador quase te agrediu no banco.`} }, c2: { t: 'Seguir a tática', d: 0.2, s: {pu:2, po:0, q:15, r:10, fa:0, tx:`Sistema funcionou, ponto seguro.`}, f: {pu:0, po:0, q:5, r:-5, fa:0, tx:`Jogada engessada, estourou o cronômetro.`} } },
      { txt: `Última posse! Jogo empatado. Você tem a bola.`, c1: { t: 'Iso (Resolver Sozinho)', d: -0.25, s: {pu:2, po:0, q:5, r:30, fa:100000, tx:`GAME WINNER! GELO NAS VEIAS! A CIDADE É SUA!`}, f: {pu:0, po:2, q:-20, r:-25, fa:-40000, tx:`Tijolada no aro. Eles ganharam no rebote.`} }, c2: { t: 'Chamar jogada pro time', d: 0.1, s: {pu:2, po:0, q:25, r:15, fa:20000, tx:`Assistência de mestre pro arremesso da vitória.`}, f: {pu:0, po:2, q:0, r:-5, fa:0, tx:`O companheiro bagre errou o chute livre.`} } },
      { txt: `Um torcedor VIP na beirada tá xingando sua mãe.`, c1: { t: 'Encarar o torcedor', d: -0.1, s: {pu:3, po:0, q:0, r:5, fa:50000, tx:`Mandou o cara calar a boca e meteu de 3 olhando pra ele!`}, f: {pu:0, po:1, q:-10, r:-20, fa:-50000, tx:`Perdeu a cabeça, tomou punição da liga.`} }, c2: { t: 'Ignorar', d: 0.3, s: {pu:2, po:0, q:5, r:10, fa:0, tx:`Focado no jogo. Pontuou tranquilo.`}, f: {pu:0, po:0, q:-5, r:-5, fa:0, tx:`Entrou na sua mente, errou a bandeja.`} } },
      { txt: `Seu companheiro cai lesionado, mas estamos no ataque em vantagem.`, c1: { t: 'Continuar atacando (5x4)', d: 0.2, s: {pu:3, po:0, q:-30, r:-10, fa:10000, tx:`Fez a cesta, mas o elenco te achou um psicopata sem empatia.`}, f: {pu:0, po:0, q:-40, r:-20, fa:-30000, tx:`Errou o chute e ainda ignorou o colega caído.`} }, c2: { t: 'Jogar a bola pra fora', d: 0.4, s: {pu:0, po:0, q:40, r:30, fa:20000, tx:`Fair Play. O time inteiro respeitou sua liderança.`}, f: {pu:0, po:0, q:20, r:15, fa:0, tx:`Parou o jogo. A equipe médica atendeu o jogador.`} } },
      { txt: `O armador do seu time tá escondendo o jogo porque você tá brilhando.`, c1: { t: 'Dar um grito com ele', d: 0.0, s: {pu:2, po:0, q:10, r:20, fa:0, tx:`Colocou moral no vestiário e ele soltou a bola.`}, f: {pu:0, po:2, q:-25, r:-10, fa:0, tx:`A briga piorou e o time rachou no meio da quadra.`} }, c2: { t: 'Pegar o rebote e armar você mesmo', d: -0.1, s: {pu:2, po:0, q:-10, r:15, fa:10000, tx:`Assumiu a responsa de Point God e cravou.`}, f: {pu:0, po:2, q:-15, r:-5, fa:0, tx:`Tentou bancar o armador e cometeu turnover.`} } }
    ];
  }

  ngOnInit() {
    if (!this.careerState.playerNbaTeam) { this.router.navigate(['/']); return; } 
    
    if (!this.careerState.player.nbaHistorico) {
      this.careerState.player.nbaHistorico = []; 
      this.careerState.player.trofeus = []; 
      this.careerState.player.idade = 19; 
      this.careerState.player.anosContrato = 2; 
      this.careerState.player.fans = 100000;
      this.careerState.player.quimica = 70; 
      this.careerState.player.respeito = 70;
      if (!this.careerState.player.salario) this.careerState.player.salario = 6500000;
    }
    this.atualizarValoresContrato();
    this.inicializarLiga();
    this.gerarPowerRankings();
    this.gerarCompanheiros();
  }

  inicializarLiga() {
    this.careerState.nbaTeams.forEach(t => { this.elencosNba[t.espn] = []; });
    this.bancoDeJogadores.forEach(j => {
      if (this.elencosNba[j.time]) { this.elencosNba[j.time].push(j); }
    });
  }

  atualizarValoresContrato() {
    const ovr = this.careerState.player?.ovr || 70;
    
    if (ovr >= 95) this.careerState.player.valorMercado = 50000000; 
    else if (ovr >= 90) this.careerState.player.valorMercado = 35000000; 
    else if (ovr >= 85) this.careerState.player.valorMercado = 25000000; 
    else if (ovr >= 78) this.careerState.player.valorMercado = 15000000; 
    else if (ovr >= 70) this.careerState.player.valorMercado = 8000000;  
    else this.careerState.player.valorMercado = 2000000; 
    
    if (!this.careerState.player.salario) {
      this.careerState.player.salario = 6500000; 
    }
  }

  gerarPowerRankings() {
    this.powerRankings = this.careerState.nbaTeams.map(t => {
      const elenco = this.elencosNba[t.espn];
      let forcaElenco = elenco && elenco.length > 0 ? (elenco[0].ovr + (elenco[1] ? elenco[1].ovr : 80)) / 2 : 80;
      
      let baseOvr = Math.floor(forcaElenco);
      if (t.name === this.careerState.playerNbaTeam.name) {
        baseOvr = Math.min(99, Math.floor((baseOvr + this.careerState.player.ovr) / 2) + Math.floor(this.careerState.player.quimica / 15));
        this.meuTimeOvr = baseOvr;
      }
      return { time: t, ovr: baseOvr };
    }).sort((a, b) => b.ovr - a.ovr);
  }

  gerarCompanheiros() {
    const meuTimeEspn = this.careerState.playerNbaTeam.espn;
    const elencoAtual = [...this.elencosNba[meuTimeEspn]].sort((a, b) => b.ovr - a.ovr);
    
    this.companheiros = [
      { nome: elencoAtual[0]?.nome || 'Bagre 1', pos: elencoAtual[0]?.pos || 'PG', sinergia: this.careerState.player.quimica },
      { nome: elencoAtual[1]?.nome || 'Bagre 2', pos: elencoAtual[1]?.pos || 'C', sinergia: this.careerState.player.quimica - 5 }
    ];
  }

  atualizarBarras(q: number, r: number) {
    this.careerState.player.quimica += q;
    this.careerState.player.respeito += r;

    if (this.careerState.player.quimica > 100) this.careerState.player.quimica = 100;
    if (this.careerState.player.respeito > 100) this.careerState.player.respeito = 100;
    if (this.careerState.player.quimica < 0) this.careerState.player.quimica = 0;
    if (this.careerState.player.respeito < 0) this.careerState.player.respeito = 0;

    this.companheiros.forEach(c => c.sinergia = this.careerState.player.quimica);

    if (this.careerState.player.respeito <= 0 || this.careerState.player.quimica <= 0) {
      const motivo = this.careerState.player.respeito <= 0 ? 
        'JUSTA CAUSA! O técnico cansou da sua marra.' : 
        'VESTIÁRIO RACHADO! Seus colegas te expulsaram.';
      
      alert(motivo + " A temporada foi encerrada precocemente.");
      
      clearInterval(this.intervaloJogo);
      this.mostrarPlayoffsLive = false;
      this.cartaAtual = null;

      this.forcarTroca();
      this.finalizarAnoNba(); 
    }
  }
  forcarTroca() {
    const timesDisponiveis = this.careerState.nbaTeams.filter(t => t.name !== this.careerState.playerNbaTeam.name);
    this.careerState.playerNbaTeam = timesDisponiveis[Math.floor(Math.random() * timesDisponiveis.length)];
    this.gerarPowerRankings(); this.gerarCompanheiros(); this.cdr.detectChanges();
  }

  getBarColor(valor: number) { return valor > 70 ? '#32cd32' : (valor > 30 ? '#ffd700' : '#ff4500'); }

  tocarSomRoleta() {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let ticks = 0; const maxTicks = 35; let delay = 40; 
    const playTick = () => {
      if (ticks >= maxTicks || !this.isSpinning) return;
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime); osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.05);
      ticks++; delay += 10; setTimeout(playTick, delay);
    };
    playTick();
  }

  abrirRoletaNba() { this.eventoSorteado = null; this.mostrarRoleta = true; }

  girarRoletaNba() {
    if (this.isSpinning) return; this.isSpinning = true; this.tocarSomRoleta();
    const randomIndex = Math.floor(Math.random() * this.eventosNba.length);
    const pedaco = 360 / this.eventosNba.length;
    this.roletaRotation = (Math.floor(this.roletaRotation / 360) * 360) + (5 * 360) + (360 - (randomIndex * pedaco + (pedaco / 2)));
    setTimeout(() => {
      this.isSpinning = false; this.eventoSorteado = this.eventosNba[randomIndex];
      this.careerState.player.ovr += this.eventoSorteado.ovr;
      this.careerState.player.fans += this.eventoSorteado.fans;
      this.cdr.detectChanges(); 
    }, 4000);
  }

  getConicGradientNba() {
    let gradient = 'conic-gradient('; const step = 100 / this.eventosNba.length;
    this.eventosNba.forEach((ev, i) => gradient += `${ev.color} ${i * step}% ${(i + 1) * step}%, `);
    return gradient.slice(0, -2) + ')'; 
  }

  prepararPlayoffs() {
    this.mostrarRoleta = false;
    this.gerarPowerRankings();
    if (this.eventoSorteado?.nome.includes('Lesão') || this.meuTimeOvr < 75) {
      this.faseAlcancadaIndex = 0; this.mostrarResumo = true; return;
    }
    this.iniciarJornadaPlayoffs();
  }

  // --- MOTOR DA QUADRA ---
  iniciarJornadaPlayoffs() { this.rodadaAtualPlayoff = 1; this.iniciarPartidaPlayoff(); }
  
  montarPosicoesIniciais() {
    this.jogadoresUser = [ { id: 0, x: 25, y: 50 }, { id: 1, x: 35, y: 20 }, { id: 2, x: 35, y: 80 }, { id: 3, x: 45, y: 35 }, { id: 4, x: 45, y: 65 } ];
    this.jogadoresOpp = [ { id: 0, x: 75, y: 50 }, { id: 1, x: 65, y: 20 }, { id: 2, x: 65, y: 80 }, { id: 3, x: 55, y: 35 }, { id: 4, x: 55, y: 65 } ];
    this.bola = { x: 25, y: 50, status: 'posse', time: 'user', dono: 0 };
  }

  iniciarPartidaPlayoff() {
    this.mostrarPlayoffsLive = true; 
    this.partidaEncerrada = false;
    this.ultimoResultado = "A bola subiu! Mostre quem manda.";
    
    // Define os adversários e o OVR base
    const timesDisponiveis = this.careerState.nbaTeams.filter(t => t.name !== this.careerState.playerNbaTeam.name);
    this.oponenteAtual = timesDisponiveis[Math.floor(Math.random() * timesDisponiveis.length)];
    this.timeCasa = this.careerState.playerNbaTeam; 

    // Placar base com a vantagem simulada
    const diffOvr = this.meuTimeOvr - (this.oponenteAtual?.ovr || 80);
    this.placarUser = 80 + (diffOvr > 0 ? Math.floor(Math.random() * 10) : 0);
    this.placarOponente = 80 + (diffOvr < 0 ? Math.floor(Math.random() * 10) : 0);

    // Identifica o Astro Rival para colocar o nome dele nas cartas!
    const elencoRival = this.elencosNba[this.oponenteAtual.espn];
    const nomeRival = elencoRival && elencoRival.length > 0 ? elencoRival[0].nome : 'o Veterano adversário';

    // Pega as cartas, injeta o nome do rival e embaralha!
    const deckPronto = this.getBancoDeCartas(nomeRival);
    this.cartasDaPartida = [...deckPronto].sort(() => Math.random() - 0.5).slice(0, this.maxTurnos);
    
    this.turnoAtual = 0;
    this.cartaAtual = this.cartasDaPartida[this.turnoAtual];

    this.montarPosicoesIniciais();
    this.intervaloJogo = setInterval(() => { this.moverJogadoresVisuais(); this.cdr.detectChanges(); }, 600);
  }

  pularParaClutch() {
    clearInterval(this.intervaloJogo); this.tempoJogo = 2; this.placarUser = 102; this.placarOponente = 103;
    this.logsJogo.unshift("SIMULAÇÃO AVANÇADA! Faltam 2 minutos!"); this.cdr.detectChanges(); this.dispararEventoDecisivo();
  }

  pularPartida() {
    clearInterval(this.intervaloJogo);
    
    // OVR IMPORTA NA SIMULAÇÃO! 
    const meuBonus = this.meuTimeOvr > (this.oponenteAtual.ovr || 80) ? 1.5 : 0;
    const oppBonus = (this.oponenteAtual.ovr || 80) > this.meuTimeOvr ? 1.5 : 0;

    while (this.tempoJogo > 0) { 
      this.placarUser += Math.floor(Math.random() * (4 + meuBonus)); 
      this.placarOponente += Math.floor(Math.random() * (4 + oppBonus)); 
      this.tempoJogo -= 1; 
    }
    this.tempoJogo = 0; 
    this.partidaEncerrada = true; 
    this.eventoPlayoffAtual = null; 
    this.cdr.detectChanges();
  }

  moverJogadoresVisuais() {
    this.jogadoresUser.forEach(p => { p.x += (Math.random() * 16 - 8); p.y += (Math.random() * 16 - 8); if (p.x < 5) p.x = 5; if (p.x > 95) p.x = 95; if (p.y < 5) p.y = 95; if (p.y > 95) p.y = 95; });
    this.jogadoresOpp.forEach(p => { p.x += (Math.random() * 16 - 8); p.y += (Math.random() * 16 - 8); if (p.x < 5) p.x = 5; if (p.x > 95) p.x = 95; if (p.y < 5) p.y = 95; if (p.y > 95) p.y = 95; });
    
    if (Math.random() < 0.3) {
      this.bola.time = Math.random() > 0.5 ? 'user' : 'opp';
      this.bola.dono = Math.floor(Math.random() * 5);
    }
    
    if (this.bola.time === 'user') {
      this.bola.x = this.jogadoresUser[this.bola.dono].x + 2; this.bola.y = this.jogadoresUser[this.bola.dono].y + 1;
    } else {
      this.bola.x = this.jogadoresOpp[this.bola.dono].x - 2; this.bola.y = this.jogadoresOpp[this.bola.dono].y + 1;
    }
  }


  atualizarPosicaoBolaNaMao() {
    if (this.bola.time === 'user') { const j = this.jogadoresUser[this.bola.dono]; this.bola.x = j.x + 2; this.bola.y = j.y + 1; } 
    else { const j = this.jogadoresOpp[this.bola.dono]; this.bola.x = j.x - 2; this.bola.y = j.y + 1; }
  }

  dispararEventoDecisivo() {
    const elencoMeu = this.elencosNba[this.careerState.playerNbaTeam.espn];
    const elencoRival = this.elencosNba[this.oponenteAtual.espn];
    const meuAstro = elencoMeu && elencoMeu.length > 0 ? elencoMeu[0].nome : 'Veterano';
    const astroRival = elencoRival && elencoRival.length > 0 ? elencoRival[0].nome : 'Astro Rival';
    
    const eventos = [
      { texto: `Fim de jogo apertado! A bola sobrou pra você no garrafão e o ${astroRival} veio pra dobra!`, c1: { texto: 'Forçar (Fominha)', acerto: 0.6, pt: 2, fans: 50000, q: -10, r: -5 }, c2: { texto: `Passar pro ${meuAstro}`, acerto: 0.85, pt: 3, fans: 10000, q: 15, r: 10 } },
      { texto: `Última posse! O ${astroRival} tá te marcando no perímetro.`, c1: { texto: 'Chutar de 3 (Hero Ball)', acerto: 0.5, pt: 3, fans: 100000, q: -5, r: 0 }, c2: { texto: 'Pedir corta-luz', acerto: 0.9, pt: 2, fans: 5000, q: 20, r: 15 } }
    ];
    this.eventoPlayoffAtual = eventos[Math.floor(Math.random() * eventos.length)]; this.cdr.detectChanges();
  }


  avancarPosJogo() {
    this.mostrarPlayoffsLive = false;
    
    if (this.placarUser === this.placarOponente) {
      this.placarUser += Math.floor(Math.random() * 3) + 1; 
    }

    // A REGRA É CLARA: Ganhou no placar, avançou de fase!
    if (this.placarUser > this.placarOponente) {
      alert(`VITÓRIA! O ${this.careerState.playerNbaTeam.name} avança!`);
      this.rodadaAtualPlayoff++;
      if (this.rodadaAtualPlayoff > 4) { 
        this.faseAlcancadaIndex = 5; 
        this.iniciarNarrativaFinais(); 
      } else { 
        this.iniciarPartidaPlayoff(); 
      }
    } else {
      alert(`ELIMINADOS! Fim da linha para o seu time.`);
      this.faseAlcancadaIndex = this.rodadaAtualPlayoff + 1; 
      this.mostrarResumo = true; 
    }
  }

  iniciarNarrativaFinais() {
    this.mostrarNarrativaFinal = true; this.linhasNarrativa = [];
    const script = ["Finais da NBA.", "O cronômetro zera...", "🔥 CAMPEÕES!!! 🔥"];
    let delay = 0;
    script.forEach((linha, index) => {
      setTimeout(() => {
        this.linhasNarrativa.push(linha); this.cdr.detectChanges();
        if (index === script.length - 1) setTimeout(() => { this.mostrarNarrativaFinal = false; this.mostrarResumo = true; this.cdr.detectChanges(); }, 2000);
      }, delay); delay += 1000; 
    });
  }

  iniciarFimDeTemporada() {
    this.mostrarResumo = false;
    this.entrevistasRestantes = Math.floor(Math.random() * 4) + 1;
    this.proximaEntrevistaFimDeAno();
  }

  proximaEntrevistaFimDeAno() {
    if (this.entrevistasRestantes > 0) {
      this.entrevistaAtual = this.bancoEntrevistas[Math.floor(Math.random() * this.bancoEntrevistas.length)];
      this.mostrarEntrevista = true;
      this.cdr.detectChanges();
    } else {
      this.mostrarEntrevista = false;
      this.finalizarAnoNba();
      this.cdr.detectChanges(); 
    }
  }

  responderEntrevistaFimDeAno(escolhaIndex: number) {
    const escolha = escolhaIndex === 1 ? this.entrevistaAtual.c1 : this.entrevistaAtual.c2;
    this.careerState.player.ovr += escolha.ovr; 
    this.careerState.player.fans += escolha.fans;
    this.atualizarBarras(escolha.q, escolha.r);
    
    this.entrevistasRestantes -= 1;
    this.mostrarEntrevista = false; 
    this.entrevistaAtual = null;
    this.cdr.detectChanges();
    
    setTimeout(() => this.proximaEntrevistaFimDeAno(), 300);
  }

  gerarEstatisticas(eventoNome: string, ovr: number) {
    let min = ovr / 6;
    let max = ovr / 3;

    let pts = Math.random() * (max - min) + min;
    let reb = Math.random() * 5 + 2;
    let ast = Math.random() * 6 + 1;
    let blk = Math.random() * 1.5;
    let fg = Math.floor(Math.random() * 15) + 40; 

    if (eventoNome === 'Esquentou Banco' || eventoNome === 'Pego no Exame' || eventoNome === 'Lesão Grave') {
      pts = pts / 3; reb = 1.2; ast = 0.5; fg -= 10; blk = 0.1;
    } else if (eventoNome === 'Cestinha da Liga' || eventoNome === 'MVP do Torneio' || eventoNome === 'Evolução Monstra') {
      pts += 8; fg += 5;
    }


    const arch = this.careerState.player.archetype?.boost;
    
    if (arch === 'pts_3pt') { pts += 6; fg += 2; ast += 0.5; }
    if (arch === 'pts_mid') { pts += 5; fg += 4; ast += 1; }
    if (arch === 'pts_all') { pts += 5.5; ast += 1.5; reb += 0.5; }
    if (arch === 'fg_dunk') { pts += 4; fg += 8; reb += 1; }
    if (arch === 'pts_post'){ pts += 5; fg += 5; reb += 2; }
    
    if (arch === 'ast_pure') { ast += 5; pts -= 1; }
    if (arch === 'ast_pts')  { ast += 3.5; pts += 3; fg += 2; }
    if (arch === 'ast_reb')  { ast += 3; reb += 2.5; pts += 1; }
    
    if (arch === 'blk_def')  { blk += 1.8; reb += 2; pts -= 2; }
    if (arch === 'def_stl')  { ast += 1.5; pts += 1; blk += 0.8; fg -= 2; } 
    if (arch === 'blk_pure') { blk += 2.5; reb += 1.5; pts -= 3; }
    if (arch === 'pts_def')  { pts += 3; blk += 1; reb += 1; }
    
    if (arch === 'reb_pure') { reb += 4.5; blk += 0.8; pts -= 2; }
    if (arch === 'reb_blk')  { reb += 3.5; blk += 1.5; fg += 3; }
    if (arch === 'pts_reb')  { pts += 4; reb += 2.5; fg += 2; }
    if (arch === 'fg_reb')   { fg += 7; reb += 3; blk += 0.5; }
    
    if (arch === 'pts_def_3'){ pts += 4; blk += 0.8; fg += 2; }
    if (arch === 'all')      { pts += 3; reb += 1.5; ast += 1.5; blk += 0.5; fg += 2; }

    return { 
      pts: pts.toFixed(1), 
      reb: reb.toFixed(1), 
      ast: ast.toFixed(1), 
      blk: blk.toFixed(1), 
      fg: fg + '%' 
    };
  }

  
  finalizarAnoNba() {
    const stats = this.gerarEstatisticas(this.eventoSorteado?.nome || 'Simulação', this.careerState.player.ovr);
    this.careerState.player.nbaHistorico.push({ ano: this.nbaYear, evento: this.eventoSorteado?.nome || 'Simulação', resultado: this.fasesPlayoffs[this.faseAlcancadaIndex], stats: stats, teamColor: this.careerState.playerNbaTeam.color, teamName: this.careerState.playerNbaTeam.espn });
    this.careerState.player.idade += 1; this.careerState.player.anosContrato -= 1;

    const ovr = this.careerState.player.ovr;
    if (ovr >= 95) this.careerState.player.valorMercado = 50000000; else if (ovr >= 90) this.careerState.player.valorMercado = 35000000; 
    else if (ovr >= 85) this.careerState.player.valorMercado = 25000000; else if (ovr >= 78) this.careerState.player.valorMercado = 15000000; 
    else if (ovr >= 70) this.careerState.player.valorMercado = 8000000;  else this.careerState.player.valorMercado = 2000000; 
    if (!this.careerState.player.salario) this.careerState.player.salario = 6500000;
    
    this.simularMercadoDaNBA();

    if (this.careerState.player.idade >= 50) {
      this.aposentarJogador();
      return;
    }

    if (this.careerState.player.anosContrato <= 0) {
      this.abrirFreeAgency();
    } else {
      this.nbaYear += 1;
      this.gerarPowerRankings();
      this.gerarCompanheiros();
    }
    this.cdr.detectChanges(); 
  }

  abrirFreeAgency() {
    const timesEmbaralhados = [...this.careerState.nbaTeams].sort(() => Math.random() - 0.5);
    
    this.ofertasContrato = [
      { time: this.careerState.playerNbaTeam, tipo: 'RENOVAÇÃO', salario: this.careerState.player.valorMercado, anos: Math.floor(Math.random() * 3) + 2 },
      { time: timesEmbaralhados[0].name === this.careerState.playerNbaTeam.name ? timesEmbaralhados[1] : timesEmbaralhados[0], tipo: 'NOVA EQUIPE', salario: this.careerState.player.valorMercado * 1.1, anos: 4 },
      { time: timesEmbaralhados[2].name === this.careerState.playerNbaTeam.name ? timesEmbaralhados[3] : timesEmbaralhados[2], tipo: 'NOVA EQUIPE', salario: this.careerState.player.valorMercado * 0.9, anos: 2 }
    ];
    this.mostrarFreeAgency = true;
    this.cdr.detectChanges();
  }

  assinarContrato(oferta: any) {
    this.careerState.playerNbaTeam = oferta.time; 
    this.careerState.player.salario = oferta.salario; 
    this.careerState.player.anosContrato = oferta.anos; 
    
    this.mostrarFreeAgency = false; 
    this.nbaYear += 1; 
    
    this.gerarPowerRankings(); 
    this.gerarCompanheiros(); 
    this.cdr.detectChanges();
  }

  aposentarJogador() {
    this.isAposentado = true;
    this.melhoresTemporadas = [...this.careerState.player.nbaHistorico]
      .sort((a, b) => parseFloat(b.stats.pts) - parseFloat(a.stats.pts))
      .slice(0, 3);
    this.cdr.detectChanges();
  }

  simularMercadoDaNBA() {
    const numTrocas = Math.floor(Math.random() * 3) + 2;
    this.noticiasMercado = []; 

    for (let i = 0; i < numTrocas; i++) {
      const timesIds = Object.keys(this.elencosNba);
      const timeA = timesIds[Math.floor(Math.random() * timesIds.length)];
      const timeB = timesIds[Math.floor(Math.random() * timesIds.length)];

      if (timeA !== timeB && this.elencosNba[timeA].length > 1 && this.elencosNba[timeB].length > 1) {
        const indexA = Math.floor(Math.random() * this.elencosNba[timeA].length);
        const indexB = Math.floor(Math.random() * this.elencosNba[timeB].length);

        const jogadorA = this.elencosNba[timeA].splice(indexA, 1)[0];
        const jogadorB = this.elencosNba[timeB].splice(indexB, 1)[0];
        
        jogadorA.time = timeB;
        jogadorB.time = timeA;

        this.elencosNba[timeA].push(jogadorB);
        this.elencosNba[timeB].push(jogadorA);

        this.noticiasMercado.push(`🚨 TRADE: ${jogadorA.nome} foi para o ${timeB.toUpperCase()} em troca de ${jogadorB.nome}!`);
      }
    }
    
    Object.keys(this.elencosNba).forEach(t => this.elencosNba[t].sort((a,b) => b.ovr - a.ovr));
  }

  resolverCartaJogo(escolha: any) {
    // 🎲 OVR CHECK: A MÁGICA ACONTECE AQUI!
    const meuOvr = this.careerState.player.ovr;
    const elencoRival = this.elencosNba[this.oponenteAtual.espn];
    const rivalOvr = elencoRival && elencoRival.length > 0 ? elencoRival[0].ovr : 85;

    // Fórmula: 50% base + Vantagem de OVR (1 OVR = 1.5% chance) + Dificuldade da Carta
    let chanceSucesso = 0.50 + ((meuOvr - rivalOvr) * 0.015) + escolha.d;
    if (chanceSucesso > 0.95) chanceSucesso = 0.95; // Capping 95% max
    if (chanceSucesso < 0.05) chanceSucesso = 0.05; // Capping 5% min

    // Rola o dado!
    let resultado = Math.random() <= chanceSucesso ? escolha.s : escolha.f;

    // Aplica os resultados no jogo
    this.placarUser += resultado.pu;
    this.placarOponente += resultado.po;
    this.atualizarBarras(resultado.q, resultado.r);
    if(resultado.fa) this.careerState.player.fans += resultado.fa;

    this.ultimoResultado = resultado.tx;

    // Checa se o cara não foi demitido dentro do atualizarBarras
    if (!this.mostrarPlayoffsLive) return; 

    this.turnoAtual++;
    if (this.turnoAtual < this.maxTurnos) {
      this.cartaAtual = this.cartasDaPartida[this.turnoAtual];
    } else {
      this.cartaAtual = null;
      this.partidaEncerrada = true;
      clearInterval(this.intervaloJogo);
    }
    this.cdr.detectChanges();
  }
}
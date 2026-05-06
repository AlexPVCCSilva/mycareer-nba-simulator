import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CareerStateService } from '../../core/services/career-state';


@Component({
  selector: 'app-season-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './season-hub.html',
  styleUrl: './season-hub.css'
})
export class SeasonHubComponent implements OnInit {
  public careerState = inject(CareerStateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  mostrarRoleta = false;
  isSpinning = false;
  roletaRotation = 0; 
  eventoSorteado: any = null;

  mostrarResumo = false;
  fasesTorneio = ['Não Classificou', '1ª Rodada', 'Sweet 16', 'Elite 8', 'Final Four', 'Campeão Nacional'];
  faseAlcancadaIndex = 0;

  mostrarMinigame = false;
  ponteiroPos = 0;
  ponteiroDir = 1;
  intervaloMinigame: any;
  greenZoneStart = 45; 
  greenZoneEnd = 55;   

  eventos = [
    { nome: 'Campeão Nacional', ovr: 5, color: '#ff4500', msg: 'Vocês levaram o troféu! Você amassou todo mundo e seu Draft Stock voou!' },
    { nome: 'Lesão Grave', ovr: -2, color: '#e60000', msg: 'Rompeu o ligamento, ó bosta! Perdeu o ano e os olheiros sumiram.' },
    { nome: 'Cestinha da Liga', ovr: 3, color: '#00ffcc', msg: 'Fez chover em quadra! Seu arremesso melhorou muito.' },
    { nome: 'Esquentou Banco', ovr: 1, color: '#555555', msg: 'Deeeeve ser que o técnico é cego. Jogou pouco e evoluiu quase nada.' },
    { nome: 'Festeiro Imbecil', ovr: -1, color: '#ffb300', msg: 'Faltou ao treino por causa de festa. O técnico te puniu e seu OVR caiu.' },
    { nome: 'Evolução Monstra', ovr: 4, color: '#0066ff', msg: 'Focou na academia o ano inteiro. Virou um trator na defesa!' },
    { nome: 'Pego no Exame', ovr: -3, color: '#8a2be2', msg: 'Caiu no antidoping! Suspenso da temporada inteira. OVR derreteu.' },
    { nome: 'MVP do Torneio', ovr: 6, color: '#ffd700', msg: 'O prêmio é seu! Literalmente o melhor jogador universitário do país.' },
    { nome: 'Treta no Vestiário', ovr: 0, color: '#a0522d', msg: 'Brigou com o armador do time. Clima horrível, ninguém evoluiu nada.' },
    { nome: 'Buzzer Beater', ovr: 2, color: '#32cd32', msg: 'Meteu a bola da vitória no final regional!' },
    { nome: 'Fase Tijoleiro', ovr: -1, color: '#ff69b4', msg: 'Só amassou o aro a temporada inteira. A confiança foi pro lixo.' },
    { nome: 'Genro do Técnico', ovr: 2, color: '#4682b4', msg: 'Começou a namorar a filha do técnico. Ganhou mais minutos em quadra e evoluiu!' }
  ];

  ngOnInit() {
    if (!this.careerState.player) this.router.navigate(['/']);
  }

  tocarSomRoleta() {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let ticks = 0;
    const maxTicks = 45; 
    let delay = 20; 

    const playTick = () => {
      if (ticks >= maxTicks || !this.isSpinning) return;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);

      ticks++;
      delay += Math.floor(ticks / 2); 
      setTimeout(playTick, delay);
    };

    playTick();
  }

  // --- ROLETA ---
  abrirRoleta() {
    if (this.careerState.currentYear > 4) {
      alert('Você já é Sênior, imbecil! Vá para o Draft!');
      return;
    }
    this.eventoSorteado = null;
    this.mostrarRoleta = true;
  }

  girarRoleta() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.tocarSomRoleta();

    const voltasExtras = 5 * 360; 
    const randomIndex = Math.floor(Math.random() * this.eventos.length);
    const pedacoGraus = 360 / this.eventos.length;
    
    const anguloDesejado = 360 - (randomIndex * pedacoGraus + (pedacoGraus / 2));
    
    const rotacaoAtualBase = Math.floor(this.roletaRotation / 360) * 360;
    this.roletaRotation = rotacaoAtualBase + voltasExtras + anguloDesejado;

    setTimeout(() => {
      this.isSpinning = false;
      this.eventoSorteado = this.eventos[randomIndex];
      
      this.careerState.player.ovr += this.eventoSorteado.ovr;
      if (this.careerState.player.ovr > 99) this.careerState.player.ovr = 99;
      
      this.cdr.detectChanges(); 
    }, 4000);
  }

  prepararFimDeTemporada() {
    this.mostrarRoleta = false;
    const chanceClutch = Math.random();
    if (chanceClutch < 0.25 && !['Campeão Nacional', 'Lesão Grave', 'Pego no Exame'].includes(this.eventoSorteado.nome)) {
      this.iniciarMinigame();
    } else {
      this.gerarResultadoTime();
    }
  }

  iniciarMinigame() {
    this.mostrarMinigame = true;
    this.ponteiroPos = 0;
    this.ponteiroDir = 1;
    
    this.intervaloMinigame = setInterval(() => {
      this.ponteiroPos += this.ponteiroDir * 3; 
      if (this.ponteiroPos >= 100 || this.ponteiroPos <= 0) this.ponteiroDir *= -1; 
      this.cdr.detectChanges();
    }, 15); 
  }

  arremessarClutch() {
    clearInterval(this.intervaloMinigame);
    const acertou = this.ponteiroPos >= this.greenZoneStart && this.ponteiroPos <= this.greenZoneEnd;
    this.mostrarMinigame = false;
    
    if (acertou) {
      alert("🔥 ICE IN MY VEINS! Você meteu o arremesso da vitória e levou o time pra Final! (+2 OVR)");
      this.careerState.player.ovr += 2;
      this.gerarResultadoTime(true, false);
    } else {
      alert("🧱 AIRBALL IMENSO Ó BOSTA! Você tremeu na base e o time foi eliminado! (-1 OVR)");
      this.careerState.player.ovr -= 1;
      this.gerarResultadoTime(false, true);
    }
  }

  gerarResultadoTime(forcarFinal: boolean = false, forcarEliminacao: boolean = false) {
    if (this.eventoSorteado.nome === 'Campeão Nacional') this.faseAlcancadaIndex = 5; 
    else if (forcarFinal) this.faseAlcancadaIndex = Math.floor(Math.random() * 2) + 4; 
    else if (forcarEliminacao || ['Lesão Grave', 'Pego no Exame'].includes(this.eventoSorteado.nome)) this.faseAlcancadaIndex = 0; 
    else {
      const ovr = this.careerState.player.ovr;
      let maxFase = 1;
      if (ovr > 80) maxFase = 5;
      else if (ovr > 70) maxFase = 3;
      else maxFase = 1;
      this.faseAlcancadaIndex = Math.floor(Math.random() * (maxFase + 1));
    }
    this.mostrarResumo = true;
  }

  // --- ESTATÍSTICAS ---
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

  finalizarAno() {
    if (!this.careerState.player.historico) {
      this.careerState.player.historico = [];
    }

    // Gera os stats baseado no OVR que ficou e no evento!
    const stats = this.gerarEstatisticas(this.eventoSorteado.nome, this.careerState.player.ovr);

    this.careerState.player.historico.push({
      ano: this.careerState.currentYear,
      evento: this.eventoSorteado.nome,
      resultado: this.fasesTorneio[this.faseAlcancadaIndex],
      stats: stats
    });

    this.mostrarResumo = false;
    this.careerState.currentYear += 1;
  }

  declararDraft() {
    const confirmacao = confirm(`Tem certeza? Seu Draft Stock atual é: ${this.careerState.getDraftStock()}.`);
    if (confirmacao) this.router.navigate(['/draft']);
  }

  getConicGradient() {
    let gradient = 'conic-gradient(';
    const step = 100 / this.eventos.length;
    this.eventos.forEach((ev, i) => gradient += `${ev.color} ${i * step}% ${(i + 1) * step}%, `);
    return gradient.slice(0, -2) + ')'; 
  }
}
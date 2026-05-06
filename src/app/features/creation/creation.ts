import { Component, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouletteService } from '../../core/services/roulette'; // <-- Importa o serviço
import { Router } from '@angular/router';
import { CareerStateService } from '../../core/services/career-state';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creation.html',
  styleUrl: './creation.css'
})
export class CreationComponent {
  // Injeta o serviço
  private router = inject(Router);
  private careerState = inject(CareerStateService);
  private rouletteService = inject(RouletteService);
  private cdr = inject(ChangeDetectorRef);

// Novas variáveis de controle
  currentPlayer: any = {};
  roletaRolou = false;
  isFlipped = false;
  isRevealed = false; // Controla se a faculdade já apareceu
  displayOvr: string | number = '??'; // O número que fica girando na tela

async startCareer() {
    if (!this.currentPlayer.name || this.currentPlayer.name.trim() === '') { alert('Digite o seu nome, imbecil!'); return; }
    if (!this.currentPlayer.position) { alert('Escolha uma posição!'); return; }
    if (!this.currentPlayer.region) { alert('Escolha uma região!'); return; }

    // MÁGICA DA EUROPA AQUI
    if (this.currentPlayer.region === 'Europa') {
      const paisesEuropa = ['Albânia', 'Alemanha', 'Andorra', 'Armênia', 'Áustria', 'Azerbaijão', 'Belarus', 'Bélgica', 'Bósnia e Herzegovina', 'Bulgária', 'Cazaquistão', 'Chipre', 'Croácia', 'Dinamarca', 'Eslováquia', 'Eslovênia', 'Espanha', 'Estônia', 'Finlândia', 'França', 'Geórgia', 'Grécia', 'Hungria', 'Irlanda', 'Islândia', 'Itália', 'Letônia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedônia do Norte', 'Malta', 'Moldávia', 'Mônaco', 'Montenegro', 'Noruega', 'Países Baixos', 'Polônia', 'Portugal', 'Reino Unido', 'República Tcheca', 'Romênia', 'Rússia', 'San Marino', 'Sérvia', 'Suécia', 'Suíça', 'Turquia', 'Ucrânia'];
      this.currentPlayer.country = paisesEuropa[Math.floor(Math.random() * paisesEuropa.length)];
    } else {
      this.currentPlayer.country = this.currentPlayer.region; // Se for EUA ou Brasil, fica a região mesmo
    }

    this.isFlipped = false; this.isRevealed = false; this.displayOvr = '??';
    this.currentPlayer.ovr = this.rouletteService.generateInitialOvr();
    
    // A MÁGICA DOS ARQUEÓTIPOS (Versão Completa)
    const archetypes = [
      // --- SCORERS (Os Fominhas) ---
      { nome: 'Sharpshooter', icone: '🎯', boost: 'pts_3pt', cor: '#ff0055' },
      { nome: 'Mid-Range Maestro', icone: '🎻', boost: 'pts_mid', cor: '#d4af37' },
      { nome: 'Shot Creator', icone: '✨', boost: 'pts_all', cor: '#ff00ff' },
      { nome: 'High-Flyer (Dunker)', icone: '🚀', boost: 'fg_dunk', cor: '#ff6600' },
      { nome: 'Post Scorer', icone: '🐂', boost: 'pts_post', cor: '#8b4513' },

      // --- PLAYMAKERS (Os Garçons) ---
      { nome: 'Floor General', icone: '🧠', boost: 'ast_pure', cor: '#ffd700' },
      { nome: 'Slashing Playmaker', icone: '⚡', boost: 'ast_pts', cor: '#ffff00' },
      { nome: 'Point Forward', icone: '👁️', boost: 'ast_reb', cor: '#adff2f' },

      // --- DEFENDERS (Os Cadeados) ---
      { nome: 'Beast Defender', icone: '🧱', boost: 'blk_def', cor: '#00ccff' },
      { nome: 'Lockdown Pest', icone: '🔒', boost: 'def_stl', cor: '#4b0082' },
      { nome: 'Rim Protector', icone: '🛡️', boost: 'blk_pure', cor: '#708090' },
      { nome: 'Two-Way Slasher', icone: '⚔️', boost: 'pts_def', cor: '#dc143c' },

      // --- BIGS & REBOUNDERS (Os Donos do Garrafão) ---
      { nome: 'Glass Cleaner', icone: '🧽', boost: 'reb_pure', cor: '#00ffcc' },
      { nome: 'Paint Beast', icone: '🦍', boost: 'reb_blk', cor: '#8b0000' },
      { nome: 'Stretch Big', icone: '🏹', boost: 'pts_reb', cor: '#ff1493' },
      { nome: 'Lob Threat', icone: '🚁', boost: 'fg_reb', cor: '#00fa9a' },

      // --- HYBRIDS (Os Faz-Tudo) ---
      { nome: '3-and-D Wing', icone: '🦇', boost: 'pts_def_3', cor: '#1e90ff' },
      { nome: 'All-Around Superstar', icone: '👑', boost: 'all', cor: '#ffdf00' }
    ];
    // Sorteia um e gruda no jogador
    this.currentPlayer.archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

    const offer1 = await this.rouletteService.spinCollege(this.currentPlayer.ovr);
    let offer2 = await this.rouletteService.spinCollege(this.currentPlayer.ovr);

    while(offer2.name === offer1.name) {
      offer2 = await this.rouletteService.spinCollege(this.currentPlayer.ovr);
    }

    this.currentPlayer.collegeOffers = [offer1, offer2];
    this.roletaRolou = true;
  }

  flipCard() {
    this.isFlipped = true;
    this.animateSuspense(); // Começa o show quando vira a carta
  }

animateSuspense() {
    const target = this.currentPlayer.ovr;
    let current = Math.min(60, target); // começa no mínimo entre 60 e o target
    
    const interval = setInterval(() => {
      this.displayOvr = current;
      
      if (current >= target) { // checa ANTES de incrementar
        clearInterval(interval);
        setTimeout(() => {
          this.isRevealed = true;
          this.cdr.detectChanges();
        }, 1000);
        return;
      }
      
      current++;
    }, 60);
  }

getTierClass() {
    if (!this.currentPlayer.ovr) return '';
    if (this.currentPlayer.ovr >= 75) return 'tier-powerhouse';
    if (this.currentPlayer.ovr >= 70) return 'tier-high';
    if (this.currentPlayer.ovr >= 65) return 'tier-mid';
    return 'tier-low';
  }

  escolherFaculdade(faculdadeEscolhida: any) {
    this.currentPlayer.college = faculdadeEscolhida;
    this.careerState.player = this.currentPlayer;
    this.router.navigate(['/hub']);
  }

irParaHub() {
    // Salva o jogador no nosso "Memory Card"
    this.careerState.player = this.currentPlayer;
    // Viaja para a próxima tela
    this.router.navigate(['/hub']);
  }
  
}
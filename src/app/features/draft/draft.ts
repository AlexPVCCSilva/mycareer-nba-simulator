import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CareerStateService } from '../../core/services/career-state';

@Component({
  selector: 'app-draft',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './draft.html',
  styleUrl: './draft.css'
})
export class DraftComponent implements OnInit {
  public careerState = inject(CareerStateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  displayedPicks: any[] = [];
  draftTerminado = false;
  posicaoDoUsuario = 0;
  
  // Guardamos o intervalo aqui para poder matar ele depois
  draftInterval: any; 

  ngOnInit() {
    if (!this.careerState.player) {
      this.router.navigate(['/']);
      return;
    }
    this.iniciarDraft();
  }

  iniciarDraft() {
    const timesEmbaralhados = [...this.careerState.nbaTeams].sort(() => Math.random() - 0.5);
    const nomesEmbaralhados = [...this.careerState.randomNames].sort(() => Math.random() - 0.5);

    const ovr = this.careerState.player.ovr;
    if (ovr >= 80) this.posicaoDoUsuario = Math.floor(Math.random() * 3) + 1; 
    else if (ovr >= 75) this.posicaoDoUsuario = Math.floor(Math.random() * 7) + 4; 
    else if (ovr >= 70) this.posicaoDoUsuario = Math.floor(Math.random() * 10) + 11; 
    else this.posicaoDoUsuario = Math.floor(Math.random() * 10) + 21; 

    this.careerState.nbaDraftClass = [];
    for (let i = 0; i < 30; i++) {
      const pickNumber = i + 1;
      const team = timesEmbaralhados[i];

      if (pickNumber === this.posicaoDoUsuario) {
        this.careerState.playerNbaTeam = team;
        this.careerState.nbaDraftClass.push({
          pick: pickNumber,
          team: team,
          isUser: true,
          playerInfo: this.careerState.player
        });
      } else {
        this.careerState.nbaDraftClass.push({
          pick: pickNumber,
          team: team,
          isUser: false,
          playerInfo: { 
            name: nomesEmbaralhados[i], 
            ovr: Math.floor(Math.random() * (75 - 65 + 1)) + 65 
          }
        });
      }
    }

    let currentPick = 0;
    this.draftInterval = setInterval(() => {
      this.displayedPicks.push(this.careerState.nbaDraftClass[currentPick]);
      currentPick++;
      
      this.cdr.detectChanges(); 
      window.scrollTo(0, document.body.scrollHeight);

      if (currentPick >= 30) {
        clearInterval(this.draftInterval);
        this.draftTerminado = true;
        this.cdr.detectChanges();
      }
    }, 1500); 
  }

  // --- A MÁGICA DE PULAR ---
  pularAnimacao() {
    // 1. Mata o relógio de suspense
    if (this.draftInterval) {
      clearInterval(this.draftInterval);
    }
    
    // 2. Joga os 30 caras na tela de uma vez só
    this.displayedPicks = [...this.careerState.nbaDraftClass];
    
    // 3. Avisa que o draft acabou e manda a tela pro final
    this.draftTerminado = true;
    this.cdr.detectChanges();
    window.scrollTo(0, document.body.scrollHeight);
  }

  irParaNbaHub() {
    this.router.navigate(['/nba']);
  }
}
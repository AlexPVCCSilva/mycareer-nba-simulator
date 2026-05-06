import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouletteService {
  private http = inject(HttpClient);

  // 1. Gera o OVR aleatório
  generateInitialOvr(): number {
    const min = 60;
    const max = 78;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 2. A Roleta de Faculdades com peso dinâmico
  async spinCollege(ovr: number) {
    // Lê o arquivo JSON
const colleges = await firstValueFrom(this.http.get<any[]>('ncaa-teams.json'));
    // Calcula os pesos
    const collegesWithWeights = colleges.map(c => {
      let weight = 10; // Peso padrão para não quebrar
      
      if (c.tier === 'Powerhouse') weight = ovr >= 75 ? 50 : (ovr >= 70 ? 5 : 1);
      if (c.tier === 'High') weight = ovr >= 70 ? 40 : 10;
      if (c.tier === 'Mid') weight = 30;
      if (c.tier === 'Low') weight = ovr <= 65 ? 60 : 5;

      return { ...c, weight };
    });

    // Gira a roleta
    const totalWeight = collegesWithWeights.reduce((acc, c) => acc + c.weight, 0);
    let random = Math.random() * totalWeight;

    for (const college of collegesWithWeights) {
      if (random < college.weight) return college;
      random -= college.weight;
    }
    
    return collegesWithWeights[0]; // Fallback
  }
}
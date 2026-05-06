import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CareerStateService {
  player: any = {
    name: '',
    position: '',
    region: '',
    ovr: 60,
    jerseyNumber: 0 // <-- O NÚMERO DA CAMISA AQUI!
  }; 
  
  currentYear: number = 1; 
  nbaDraftClass: any[] = []; 
  playerNbaTeam: any = null; 

  // Troquei o "abv" por "espn" pra bater certinho com o link das imagens!
  nbaTeams = [
    { name: 'Atlanta Hawks', espn: 'atl', color: '#e03a3e', bg: '#26282a' },
    { name: 'Boston Celtics', espn: 'bos', color: '#007A33', bg: '#121212' },
    { name: 'Brooklyn Nets', espn: 'bkn', color: '#ffffff', bg: '#000000' },
    { name: 'Charlotte Hornets', espn: 'cha', color: '#1d1160', bg: '#00788c' },
    { name: 'Chicago Bulls', espn: 'chi', color: '#ce1141', bg: '#000000' },
    { name: 'Cleveland Cavaliers', espn: 'cle', color: '#860038', bg: '#041e42' },
    { name: 'Dallas Mavericks', espn: 'dal', color: '#00538c', bg: '#002b5e' },
    { name: 'Denver Nuggets', espn: 'den', color: '#fec524', bg: '#0e2240' },
    { name: 'Detroit Pistons', espn: 'det', color: '#c8102e', bg: '#1d428a' },
    { name: 'Golden State Warriors', espn: 'gs', color: '#ffc72c', bg: '#1d428a' },
    { name: 'Houston Rockets', espn: 'hou', color: '#ce1141', bg: '#000000' },
    { name: 'Indiana Pacers', espn: 'ind', color: '#fdbb30', bg: '#002d62' },
    { name: 'LA Clippers', espn: 'lac', color: '#c8102e', bg: '#1d428a' },
    { name: 'Los Angeles Lakers', espn: 'lal', color: '#fdb927', bg: '#552583' },
    { name: 'Memphis Grizzlies', espn: 'mem', color: '#5d76a9', bg: '#12173f' },
    { name: 'Miami Heat', espn: 'mia', color: '#98002e', bg: '#000000' },
    { name: 'Milwaukee Bucks', espn: 'mil', color: '#00471b', bg: '#eee1c6' },
    { name: 'Minnesota Timberwolves', espn: 'min', color: '#78be20', bg: '#0c2340' },
    { name: 'New Orleans Pelicans', espn: 'no', color: '#85714d', bg: '#0c2340' },
    { name: 'New York Knicks', espn: 'ny', color: '#f58426', bg: '#006bb6' },
    { name: 'Oklahoma City Thunder', espn: 'okc', color: '#ef3b24', bg: '#007ac1' },
    { name: 'Orlando Magic', espn: 'orl', color: '#c4ced4', bg: '#0077c0' },
    { name: 'Philadelphia 76ers', espn: 'phi', color: '#ed174c', bg: '#006bb6' },
    { name: 'Phoenix Suns', espn: 'phx', color: '#e56020', bg: '#1d1160' },
    { name: 'Portland Trail Blazers', espn: 'por', color: '#e03a3e', bg: '#000000' },
    { name: 'Sacramento Kings', espn: 'sac', color: '#5a2d81', bg: '#000000' },
    { name: 'San Antonio Spurs', espn: 'sa', color: '#c4ced4', bg: '#000000' },
    { name: 'Toronto Raptors', espn: 'tor', color: '#ce1141', bg: '#000000' },
    { name: 'Utah Jazz', espn: 'utah', color: '#f9a01b', bg: '#002b5c' },
    { name: 'Washington Wizards', espn: 'was', color: '#e31837', bg: '#002b5c' }
  ].map(team => ({
    ...team,
    // Essa mágica pega a sigla e já monta a URL da foto em alta qualidade!
    logoUrl: `https://a.espncdn.com/i/teamlogos/nba/500/${team.espn}.png` 
  }));

  randomNames = ["Miguel Cabral", "Carlos Queiroz", "Bernardo Medeiros","Marcus Johnson", "Caleb Williams", "DeAndre Smith", "Elijah Davis", 
    "Tyler Robinson", "Jaden Thompson", "Isaiah Brown", "Trevor White", 
    "Malik Harris", "Connor Wilson", "Jordan Clark", "Zachary Lewis", 
    "Miles Walker", "Cameron Hall", "Xavier Young",
    // Europeus
    "Luka Kovačić", "Mateo Garcia", "Sven Berg", "Dimitris Pappas", 
    "Nikola Ilić", "Jean-Luc Moreau", "Klaus Wagner", "Tomasz Novak", 
    "Giannis Roussos", "Arvydas Balciunas", "Pau Costa", "Enzo Romano", 
    "Stefan Popović", "Henrik Larsen", "Viktor Petrov"]
  getYearName(): string {
    const years = ['Freshman (1º Ano)', 'Sophomore (2º Ano)', 'Junior (3º Ano)', 'Senior (4º Ano)'];
    return years[this.currentYear - 1] || 'Formado';
  }

  getDraftStock(): string {
    if (!this.player) return 'Desconhecido';
    const ovr = this.player.ovr;
    if (ovr >= 80) return 'Top 3 Pick (Lottery)';
    if (ovr >= 75) return 'Top 10 Pick';
    if (ovr >= 70) return '1º Round (Pick 11-20)';
    if (ovr >= 65) return '1º Round (Pick 21-30)';
    return 'Undrafted';
  }
}
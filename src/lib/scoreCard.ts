export interface ScoreCardData {
  title: string;
  subtitle: string;
  score: number;
  answered: number;
  retries: number;
  weaknesses: string[];
}

const WIDTH = 1200;
const HEIGHT = 630;

export function downloadScoreCard(data: ScoreCardData) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#fbf6ee';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#b85228';
  ctx.font = '600 22px sans-serif';
  ctx.fillText('VEYRA INTERVIEW SCORE', 80, 90);

  ctx.fillStyle = '#0e1217';
  ctx.font = '500 56px sans-serif';
  ctx.fillText(data.title, 80, 180);

  ctx.fillStyle = '#5e6670';
  ctx.font = '400 26px sans-serif';
  ctx.fillText(data.subtitle, 80, 225);

  ctx.fillStyle = '#ff6a2b';
  ctx.font = '600 170px sans-serif';
  ctx.fillText(String(Math.round(data.score)), 80, 430);

  ctx.fillStyle = '#5e6670';
  ctx.font = '400 26px sans-serif';
  ctx.fillText('out of 100 overall', 80, 480);

  ctx.fillStyle = '#0e1217';
  ctx.font = '500 28px sans-serif';
  ctx.fillText(`${data.answered} questions answered  ·  ${data.retries} retries`, 80, 540);

  ctx.fillStyle = '#5e6670';
  ctx.font = '400 24px sans-serif';
  const weakness = data.weaknesses.length > 0 ? data.weaknesses.slice(0, 2).join(', ') : 'None recorded';
  ctx.fillText(`Focus next: ${weakness}`, 80, 590);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'veyra-score.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

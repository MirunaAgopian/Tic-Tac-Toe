let fields = [
    null, 
    null, 
    null, 
    null, 
    null, 
    null, 
    null, 
    null, 
    null
];

let currentPlayer = 'cross'; // start with cross

function render() {
    const container = document.getElementById('container');
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let cellContent = '';
            if (fields[index] === 'cross') {
                cellContent = generateCrossSVG(80);
            } else if (fields[index] === 'circle') {
                cellContent = generareCitcleSVG(72);
            }

            html += `<td data-index="${index}" onclick="fillTD(${index})">${cellContent}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';
    container.innerHTML = html;
}

function generareCitcleSVG(size = 80) {
  const color = '#3498db';
  const stroke = Math.max(4, Math.floor(size / 12));
  const r = (size / 2) - stroke;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = (2 * Math.PI * r).toFixed(2);

  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Outer stroke -->
  <circle cx="${cx}" cy="${cy}" r="${r}"
          fill="none"
          stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}">
    <animate attributeName="stroke-dashoffset"
             from="${circumference}" to="0"
             dur="300ms" fill="freeze" />
  </circle>

  <!-- Interior fill -->
  <circle cx="${cx}" cy="${cy}" r="${r - stroke/2}"
          fill="${color}" fill-opacity="0">
    <animate attributeName="fill-opacity"
             begin="300ms" dur="200ms"
             from="0" to="0.2"
             fill="freeze" />
  </circle>
</svg>`;
}

/**
 * Returns an animated cross ("X") SVG as a string.
 * - Two lines are drawn one after another.
 * @param {number} size - width/height in px (default 80)
 */
function generateCrossSVG(size = 60) {
  const color = '#e74c3c';
  const stroke = Math.max(4, Math.floor(size / 12));
  const offset = stroke; // keep strokes inside viewBox
  const end = size - offset;

  const diagLength = Math.sqrt(Math.pow(end - offset, 2) * 2).toFixed(2);

  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- First line -->
  <line x1="${offset}" y1="${offset}" x2="${end}" y2="${end}"
        stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${diagLength}" stroke-dashoffset="${diagLength}">
    <animate attributeName="stroke-dashoffset"
             from="${diagLength}" to="0"
             dur="250ms" fill="freeze" />
  </line>

  <!-- Second line -->
  <line x1="${end}" y1="${offset}" x2="${offset}" y2="${end}"
        stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${diagLength}" stroke-dashoffset="${diagLength}">
    <animate attributeName="stroke-dashoffset"
             from="${diagLength}" to="0"
             dur="250ms" begin="250ms" fill="freeze" />
  </line>
</svg>`;
}

function fillTD(index) {
    if (fields[index] !== null) return; // prevent overwriting

    const randomSymbol = Math.random() < 0.5 ? 'cross' : 'circle';
    fields[index] = randomSymbol;
    render();
}

function fillTD(index) {
    if (fields[index] !== null) return;

    fields[index] = currentPlayer;
    const result = checkWinner();

    if (result) {
        render();
        drawWinningLine(result.pattern);
        showWinnerMessage(result.winner);
    } else {
        currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';
        render();
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return { winner: fields[a], pattern };
        }
    }

    return null;
}

function showWinnerMessage(winner) {
    const message = document.createElement('div');
    message.textContent = `🎉 Congratulations! The ${winner === 'cross' ? 'X' : 'O'} has won!`;
    message.style.position = 'absolute';
    message.style.top = '70%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = '#fff';
    message.style.padding = '20px';
    message.style.border = '2px solid #333';
    message.style.fontSize = '24px';
    message.style.zIndex = '1000';
    message.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    message.style.borderRadius = '8px';
    message.style.color = 'red'; // 🔴 This sets the text color to red

    document.body.appendChild(message);
}

function drawWinningLine(pattern) {
    const table = document.querySelector('#container table');
    const cells = pattern.map(i => document.querySelector(`td[data-index="${i}"]`));
    const rects = cells.map(cell => cell.getBoundingClientRect());
    const tableRect = table.getBoundingClientRect();

    // Calculate center positions of first and last cells in the winning pattern
    const startX = rects[0].left + rects[0].width / 2 - tableRect.left;
    const startY = rects[0].top + rects[0].height / 2 - tableRect.top;
    const endX = rects[2].left + rects[2].width / 2 - tableRect.left;
    const endY = rects[2].top + rects[2].height / 2 - tableRect.top;

    // Create SVG overlay
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", tableRect.width);
    svg.setAttribute("height", tableRect.height);
    svg.style.position = "absolute";
    svg.style.top = `${table.offsetTop}px`;
    svg.style.left = `${table.offsetLeft}px`;
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "10";

    // Create line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "#50e73cff");
    line.setAttribute("stroke-width", "6");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
    document.getElementById('container').appendChild(svg);
}


function resetGame() {
    // Reset game state
    fields = Array(9).fill(null);
    currentPlayer = 'cross';

    // Clear board
    render();

    // Remove winning line if present
    const svg = document.querySelector('#container svg');
    if (svg) svg.remove();

    // Remove winner message if present
    const message = document.querySelector('body > div');
    if (message && message.textContent.includes('Congratulations')) {
        message.remove();
    }
}


let fields = [
    'cross', 
    null, 
    'circle', 
    null, 
    null, 
    null, 
    null, 
    null, 
    null
];

function render() {
    const container = document.getElementById('container');
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let cellContent = '';
            if (fields[index] === 'cross') {
                cellContent = '<span class="cross">X</span>';
            } else if (fields[index] === 'circle') {
                cellContent = '<span class="circle">O</span>';
            }

            html += `<td>${cellContent}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';
    container.innerHTML = html;
}

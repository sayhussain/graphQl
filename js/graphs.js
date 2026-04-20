// Graph 1: XP Progress Over Time (Line Chart)
function drawXpGraph(allXp) {
    const svg = document.getElementById('xpGraph');
    const width = 600;
    const height = 300;
    const padding = 50;
    
    if (!allXp || allXp.length === 0) {
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle">No XP data available</text>';
        return;
    }
    
    // Calculate cumulative XP
    let cumulativeXp = 0;
    const cumulativeArray = allXp.map((item) => {
        cumulativeXp += item.amount;
        return cumulativeXp;
    });
    
    // Get max cumulative XP for scaling
    const maxCumulativeXp = cumulativeArray[cumulativeArray.length - 1] || 1;
    
    const points = allXp.map((item, index) => {
        return {
            x: padding + (index / (allXp.length - 1)) * (width - 2 * padding),
            y: height - padding - (cumulativeArray[index] / maxCumulativeXp) * (height - 2 * padding),
            amount: cumulativeArray[index]
        };
    });
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', height - padding);
    xAxis.setAttribute('x2', width - padding);
    xAxis.setAttribute('y2', height - padding);
    xAxis.setAttribute('stroke', '#999');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding);
    yAxis.setAttribute('y1', padding);
    yAxis.setAttribute('x2', padding);
    yAxis.setAttribute('y2', height - padding);
    yAxis.setAttribute('stroke', '#999');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // Draw line
    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p.x + ' ' + p.y).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#667eea');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    
    // Draw points
    points.forEach(p => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#667eea');
        svg.appendChild(circle);
    });
}

// Graph 2: Pass vs Fail (Bar Chart)
function drawPassFailGraph(projects) {
    const svg = document.getElementById('passFailGraph');
    const width = 600;
    const height = 300;
    const padding = 50;
    
    if (!projects || projects.length === 0) {
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle">No project data available</text>';
        return;
    }
    
    // Count pass/fail (assuming positive amount = pass)
    let pass = 0, fail = 0;
    projects.forEach(p => {
        if (p.amount > 0) pass++;
        else fail++;
    });
    
    const total = pass + fail;
    const barWidth = 60;
    const barGap = 100;
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', height - padding);
    xAxis.setAttribute('x2', width - padding);
    xAxis.setAttribute('y2', height - padding);
    xAxis.setAttribute('stroke', '#999');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding);
    yAxis.setAttribute('y1', padding);
    yAxis.setAttribute('x2', padding);
    yAxis.setAttribute('y2', height - padding);
    yAxis.setAttribute('stroke', '#999');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // Draw bars
    const passHeight = (pass / total) * (height - 2 * padding);
    const passBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    passBar.setAttribute('x', padding + 40);
    passBar.setAttribute('y', height - padding - passHeight);
    passBar.setAttribute('width', barWidth);
    passBar.setAttribute('height', passHeight);
    passBar.setAttribute('fill', '#27ae60');
    svg.appendChild(passBar);
    
    // Pass label
    const passLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    passLabel.setAttribute('x', padding + 70);
    passLabel.setAttribute('y', height - padding + 20);
    passLabel.setAttribute('text-anchor', 'middle');
    passLabel.setAttribute('font-size', '12');
    passLabel.textContent = 'Pass: ' + pass;
    svg.appendChild(passLabel);
    
    // Fail bar
    const failHeight = (fail / total) * (height - 2 * padding);
    const failBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    failBar.setAttribute('x', padding + 40 + barGap);
    failBar.setAttribute('y', height - padding - failHeight);
    failBar.setAttribute('width', barWidth);
    failBar.setAttribute('height', failHeight);
    failBar.setAttribute('fill', '#e74c3c');
    svg.appendChild(failBar);
    
    // Fail label
    const failLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    failLabel.setAttribute('x', padding + 70 + barGap);
    failLabel.setAttribute('y', height - padding + 20);
    failLabel.setAttribute('text-anchor', 'middle');
    failLabel.setAttribute('font-size', '12');
    failLabel.textContent = 'Fail: ' + fail;
    svg.appendChild(failLabel);
}

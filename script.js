const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let graph = { nodes: {}, edges: [] };
let sortedNodes = [];
let inDegrees = {};
let nodePositions = {};
let sortingInProgress = false;

const predefinedGraphs = {
  graph1: {
    nodes: [{ id: "1", x: 100, y: 100 }, { id: "2", x: 200, y: 200 }, { id: "3", x: 300, y: 100 }],
    edges: [["1", "2"], ["2", "3"]]
  },
  graph2: {
    nodes: [{ id: "A", x: 150, y: 150 }, { id: "B", x: 250, y: 150 }, { id: "C", x: 200, y: 250 }],
    edges: [["A", "B"], ["B", "C"], ["A", "C"]]
  },
  graph3: {
    nodes: [{ id: "X", x: 100, y: 300 }, { id: "Y", x: 200, y: 300 }, { id: "Z", x: 150, y: 400 }],
    edges: [["X", "Y"], ["Y", "Z"], ["X", "Z"]]
  },
  graph4: {
    nodes: [{ id: "1", x: 100, y: 100 }, { id: "2", x: 200, y: 100 }, { id: "3", x: 300, y: 100 }, { id: "4", x: 400, y: 100 }],
    edges: [["1", "2"], ["2", "3"], ["3", "4"], ["1", "3"], ["2", "4"]]
  },
  graph5: {
    nodes: [{ id: "A", x: 100, y: 100 }, { id: "B", x: 200, y: 150 }, { id: "C", x: 300, y: 100 }, { id: "D", x: 400, y: 200 }],
    edges: [["A", "B"], ["B", "C"], ["C", "D"], ["A", "D"]]
  },
  graph6: {
    nodes: [{ id: "1", x: 100, y: 100 }, { id: "2", x: 200, y: 200 }, { id: "3", x: 300, y: 200 }, { id: "4", x: 400, y: 100 }],
    edges: [["1", "2"], ["2", "3"], ["4", "1"]]
  },
  graph7: {
    nodes: [{ id: "A", x: 50, y: 50 }, { id: "B", x: 150, y: 150 }, { id: "C", x: 250, y: 250 }, { id: "D", x: 350, y: 50 }],
    edges: [["A", "B"], ["B", "C"], ["C", "D"], ["A", "D"]]
  },
  graph8: {
    nodes: [{ id: "P", x: 100, y: 200 }, { id: "Q", x: 200, y: 250 }, { id: "R", x: 300, y: 150 }, { id: "S", x: 400, y: 250 }],
    edges: [["P", "Q"], ["Q", "R"], ["R", "S"], ["P", "S"]]
  },
  graph9: {
    nodes: [{ id: "X", x: 150, y: 100 }, { id: "Y", x: 250, y: 200 }, { id: "Z", x: 350, y: 100 }, { id: "W", x: 450, y: 200 }],
    edges: [["X", "Y"], ["Y", "Z"], ["Z", "W"], ["X", "Z"], ["Y", "W"]]
  },
  graph10: {
    nodes: [{ id: "1", x: 50, y: 50 }, { id: "2", x: 150, y: 150 }, { id: "3", x: 250, y: 250 }, { id: "4", x: 350, y: 350 }, { id: "5", x: 450, y: 450 }],
    edges: [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["1", "3"], ["2", "4"], ["3", "5"]]
  },
  graph11: {
    nodes: [{ id: "A", x: 100, y: 150 }, { id: "B", x: 200, y: 100 }, { id: "C", x: 300, y: 150 }],
    edges: [["C", "A"]]
  },
  graph12: {
    nodes: [{ id: "I", x: 200, y: 100 }, { id: "II", x: 300, y: 200 }, { id: "III", x: 400, y: 300 }, { id: "IV", x: 500, y: 400 }],
    edges: [["I", "II"], ["II", "III"], ["III", "IV"], ["I", "IV"]]
  },
  graph13: {
    nodes: [{ id: "1", x: 150, y: 100 }, { id: "2", x: 250, y: 150 }, { id: "3", x: 350, y: 200 }, { id: "4", x: 450, y: 150 }],
    edges: [["1", "2"], ["3", "4"], ["2", "4"]]
  },
  graph14: {
    nodes: [{ id: "1", x: 50, y: 50 }, { id: "2", x: 150, y: 150 }, { id: "3", x: 250, y: 250 }, { id: "4", x: 350, y: 350 }, { id: "5", x: 450, y: 450 }],
    edges: [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["1", "3"], ["2", "4"], ["3", "5"]]
  },
  graph15: {
    nodes: [{ id: "A", x: 100, y: 150 }, { id: "B", x: 200, y: 100 }, { id: "C", x: 300, y: 150 }],
    edges: []
  },
  graph16: {
    nodes: [{ id: "P", x: 100, y: 100 }, { id: "Q", x: 200, y: 200 }, { id: "R", x: 300, y: 300 }, { id: "S", x: 400, y: 400 }, { id: "T", x: 500, y: 500 }],
    edges: [["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "T"], ["P", "R"], ["Q", "S"], ["R", "T"]]
  },
  graph17: {
    nodes: [{ id: "A", x: 100, y: 100 }, { id: "B", x: 150, y: 150 }, { id: "C", x: 200, y: 100 }, { id: "D", x: 250, y: 150 }],
    edges: [["A", "B"], ["B", "C"], ["C", "D"], ["A", "D"]]
  },
  graph18: {
    nodes: [{ id: "1", x: 200, y: 100 }, { id: "2", x: 250, y: 200 }, { id: "3", x: 350, y: 200 }, { id: "4", x: 400, y: 300 }],
    edges: [["1", "2"], ["2", "3"], ["3", "4"], ["1", "3"]]
  },
  graph19: {
    nodes: [{ id: "P", x: 50, y: 50 }, { id: "Q", x: 150, y: 150 }, { id: "R", x: 250, y: 250 }, { id: "S", x: 350, y: 350 }],
    edges: [["P", "Q"], ["Q", "R"], ["R", "S"]]
  },
  graph20: {
    nodes: [{ id: "1", x: 100, y: 200 }, { id: "2", x: 200, y: 250 }, { id: "3", x: 300, y: 150 }],
    edges: [["1", "2"], ["2", "3"]]
  }
};

function loadPredefinedGraph() {
  const selectedGraph = document.getElementById("graphSelect").value;
  if (selectedGraph === "default") return;

  const { nodes, edges } = predefinedGraphs[selectedGraph];
  graph = { nodes: {}, edges: [] };
  sortedNodes = [];
  inDegrees = {};
  nodePositions = {};
  sortingInProgress = false;

  nodes.forEach(({ id, x, y }) => {
    graph.nodes[id] = { x, y };
    inDegrees[id] = 0;
    nodePositions[id] = { x, y };
  });

  edges.forEach(([from, to]) => {
    graph.edges.push([from, to]);
    if (inDegrees[to] !== undefined) inDegrees[to]++;
  });

  drawGraph();
}

function loadGraphData() {
  graph = { nodes: {}, edges: [] };
  sortedNodes = [];
  inDegrees = {};
  nodePositions = {};
  sortingInProgress = false;

  const nodesInput = document.getElementById('nodesInput').value.trim();
  nodesInput.split('\n').forEach(line => {
    const [id, x, y] = line.split(',').map(item => item.trim());
    graph.nodes[id] = { x: parseInt(x), y: parseInt(y) };
    inDegrees[id] = 0;
    nodePositions[id] = { x: parseInt(x), y: parseInt(y) };
  });

  const edgesInput = document.getElementById('edgesInput').value.trim();
  edgesInput.split('\n').forEach(line => {
    const [from, to] = line.split(',').map(item => item.trim());
    graph.edges.push([from, to]);
    if (inDegrees[to] !== undefined) inDegrees[to]++;
  });

  drawGraph();
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  graph.edges.forEach(edge => {
    const [from, to] = edge;
    const fromNode = graph.nodes[from];
    const toNode = graph.nodes[to];

    const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
    gradient.addColorStop(0, '#2196F3');
    gradient.addColorStop(1, '#4CAF50');
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();

    drawArrowHead(fromNode, toNode);
  });

  for (const [id, { x, y }] of Object.entries(graph.nodes)) {
    const isSorted = sortedNodes.includes(id);
    const nodeColor = isSorted ? '#4CAF50' : '#2196F3';
    const hoverEffect = isSorted ? 'rgba(0, 128, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)';

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
    nodeGradient.addColorStop(0, nodeColor);
    nodeGradient.addColorStop(1, hoverEffect);
    ctx.fillStyle = nodeGradient;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fillText(id, x - 5, y + 5);
  }
}

function drawArrowHead(fromNode, toNode) {
  const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
  const arrowLength = 12;
  const offsetX = Math.cos(angle) * 20;
  const offsetY = Math.sin(angle) * 20;

  const arrowX = toNode.x - offsetX;
  const arrowY = toNode.y - offsetY;

  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - arrowLength * Math.cos(angle - Math.PI / 6), arrowY - arrowLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - arrowLength * Math.cos(angle + Math.PI / 6), arrowY - arrowLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function startTopologicalSort() {
  if (sortingInProgress) return;

  sortingInProgress = true;
  let queue = [];
  for (const node in inDegrees) {
    if (inDegrees[node] === 0) queue.push(node);
  }
  visualizeStep(queue);
}

function visualizeStep(queue) {
  if (queue.length === 0) {
    sortingInProgress = false;
    return;
  }

  const node = queue.shift();
  sortedNodes.push(node);

  document.getElementById('currentNodeInfo').innerHTML = `<span>${node}</span> is being processed.<br/> Current Sorted Order: ${sortedNodes.join(", ")}`;

  drawGraph();

  graph.edges.forEach(([from, to]) => {
    if (from === node) {
      inDegrees[to]--;
      if (inDegrees[to] === 0) {
        queue.push(to);
      }
    }
  });

  setTimeout(() => visualizeStep(queue), 1000);
}

function reset() {
  document.getElementById('nodesInput').value = '';
  document.getElementById('edgesInput').value = '';
  graph = { nodes: {}, edges: [] };
  sortedNodes = [];
  inDegrees = {};
  sortingInProgress = false;
  drawGraph();
}

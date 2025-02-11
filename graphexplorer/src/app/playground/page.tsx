'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

interface GraphProps {
  isDarkMode: boolean;
}

const Graph: React.FC<GraphProps> = ({ isDarkMode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [adjacencyList, setAdjacencyList] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => (d as Node).id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.selectAll('*').remove();

    const link = svg.append('g')
      .attr('stroke', isDarkMode ? '#666' : '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .attr('stroke', isDarkMode ? '#333' : '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(drag(simulation));
      
    node.append('circle')
      .attr('r', 12)
      .attr('fill', isDarkMode ? '#8B5CF6' : '#69b3a2');

    node.append('text')
      .text((d: Node) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', isDarkMode ? '#e5e7eb' : '#374151')
      .style('font-size', '10px')
      .style('font-weight', '500');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: d3.SimulationLinkDatum<Node>) => (d.source as Node).x ?? 0)
        .attr('y1', (d: d3.SimulationLinkDatum<Node>) => (d.source as Node).y ?? 0)
        .attr('x2', (d: d3.SimulationLinkDatum<Node>) => (d.target as Node).x ?? 0)
        .attr('y2', (d: d3.SimulationLinkDatum<Node>) => (d.target as Node).y ?? 0);

      node
        .attr('transform', (d: Node) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [nodes, links, isDarkMode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdjacencyList(event.target.value);
    const parsedData = parseAdjacencyList(event.target.value);
    setNodes(parsedData.nodes);
    setLinks(parsedData.links);
  };

  const parseAdjacencyList = (input: string) => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeSet = new Set<string>();

    // Convert input to valid JSON format
    try {
      input = input.replace(/(\d+)\s*:/g, '"$1":');
      input = input.replace(/'/g, '"'); // Replace single quotes with double quotes if needed
      const adjacencyList = JSON.parse(input);

      // Add nodes
      Object.keys(adjacencyList).forEach((key) => {
        nodes.push({ id: key });
        nodeSet.add(key);
      });

      // Add links
      Object.keys(adjacencyList).forEach((key) => {
        adjacencyList[key].forEach((neighbor: number) => {
          const neighborId = neighbor.toString();
          if (nodeSet.has(neighborId)) {
            links.push({ source: key, target: neighborId });
          }
        });
      });

      // console.log('Parsed Nodes:', nodes);
      // console.log('Parsed Links:', links);

    } catch (error) {
      console.error('Invalid input format:', error);
    }

    return { nodes, links };
  };

  return (
    <div>
      <input
        type="text"
        value={adjacencyList}
        onChange={handleInputChange}
        placeholder="Enter adjacency list"
      />
      <svg 
        ref={svgRef} 
        width="800" 
        height="600"
        className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg`}
      ></svg>
    </div>
  );
};

const Playground: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Update body class when dark mode changes
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-colors duration-200`}>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold">Graph Playground</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full hover:scale-110 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
        <Graph isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Playground;

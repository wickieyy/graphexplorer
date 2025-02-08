'use client'
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

interface GraphProps {
  nodes: Node[];
  links: Link[];
}

const Graph: React.FC<GraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

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
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .call(drag(simulation));

    node.append('title')
      .text((d: Node) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: d3.SimulationLinkDatum<Node>) => (d.source as Node).x ?? 0)
        .attr('y1', (d: d3.SimulationLinkDatum<Node>) => (d.source as Node).y ?? 0)
        .attr('x2', (d: d3.SimulationLinkDatum<Node>) => (d.target as Node).x ?? 0)
        .attr('y2', (d: d3.SimulationLinkDatum<Node>) => (d.target as Node).y ?? 0);

      node
        .attr('cx', (d: Node) => d.x ?? 0)
        .attr('cy', (d: Node) => d.y ?? 0);
    });

    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [nodes, links]);

  return (
    <svg ref={svgRef} width="800" height="600"></svg>
  );
};

const Playground: React.FC = () => {
  const nodes = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  const links: Link[] = [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    { source: '3', target: '4' },
    { source: '4', target: '1' },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold mb-6">Graph Playground</h1>
      <Graph nodes={nodes} links={links} />
    </div>
  );
};

export default Playground;

<!-- <template>
	<div id='main' class='flex justify-center mt-10'>
	</div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'

import * as d3 from 'd3'

const test = ref(null)
const data = ref({
	nodes: [{
		id: 'asd',
		group: 'R'
	}, {
		id: 'qwe',
		group: 'SW'
	}, {
		id: 'zxc',
		group: 'R'
	}, {
		id: 'sdf',
		group: 'SW'
	}, {
		id: 'xcv',
		group: 'AP'
	}],
	links: [{
		source: 'asd',
		target: 'zxc',
		sPort: 'f0/1',
		tPort: 'f0/2',
		distance: 150
	}, {
		source: 'asd',
		target: 'qwe',
		sPort: 'f0/3',
		tPort: 'f0/4',
		distance: 150
	}, {
		source: 'qwe',
		target: 'zxc',
		sPort: 'f0/5',
		tPort: 'f0/6',
		distance: 150
	}, {
		source: 'sdf',
		target: 'xcv',
		sPort: 'f0/7',
		tPort: 'f0/8',
		distance: 150
	}, {
		source: 'asd',
		target: 'sdf',
		sPort: 'f0/9',
		tPort: 'f0/10',
		distance: 150
	}]
})


function ForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links // an iterable of link objects (typically [{source, target}, …])
}, {
  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeRadius = 10, // node radius, in pixels
  nodeStrength,
	listDistance = ({distance}) => distance,
	linkPorts = ({sPort, tPort}) => [sPort, tPort],
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = '#999', // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeLinecap = 'round', // link stroke linecap
  linkStrength,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  invalidation // when this promise resolves, stop the simulation
} = {}) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern)
  const LS = d3.map(links, linkSource).map(intern)
  const LT = d3.map(links, linkTarget).map(intern)
	const D = d3.map(links, listDistance).map(intern)
	const P = d3.map(links, linkPorts).map(intern)
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i]
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle)
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern)
  const L = typeof linkStroke !== 'function' ? null : d3.map(links, linkStroke)

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}))
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], distance: D[i], ports: P[i]}))
	// console.log(links)

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G)

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors)

  // Construct the forces.
  const forceNode = d3.forceManyBody()
  const forceLink = d3.forceLink(links).id(({index: i}) => N[i]).distance(d => d.distance)
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength)
  if (linkStrength !== undefined) forceLink.strength(linkStrength)

  const simulation = d3.forceSimulation(nodes)
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('center',  d3.forceCenter())
      .on('tick', ticked)

  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100% height: auto height: intrinsic')


	const glinks = svg.selectAll('g.glink').data(links).enter().append('g')
	
	const link = glinks.append('line').attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
      .attr('stroke-opacity', linkStrokeOpacity)
      .attr('stroke-linecap', linkStrokeLinecap)
	
	const linkSourceLabel = glinks.append('text').text(d => d.ports[0])
		.attr('text-anchor', 'end')


	const gnodes = svg.selectAll('g.gnode').data(nodes).enter().append('g')

	const node = gnodes.append('circle')
		.attr('r', nodeRadius)
		.call(drag(simulation))
	
	node.on('click', () => {
		console.log('B:A')
	})

	gnodes.append('text').text(d => d.id)
		.attr('alignment-baseline', 'central')
		.call(drag(simulation))

  if (L) link.attr('stroke', ({index: i}) => L[i])
  if (G) node.attr('fill', ({index: i}) => color(G[i]))
  if (T) node.append('title').text(({index: i}) => T[i])
  if (invalidation != null) invalidation.then(() => simulation.stop())

  function intern(value) {
    return value !== null && typeof value === 'object' ? value.valueOf() : value
  }

  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

		linkSourceLabel
			.attr('x', d => {
				if (d.target.x > d.source.x) {
					return d.source.x + (d.target.x - d.source.x)/2
				}
				else {
					return d.target.x + (d.source.x - d.target.x)/2
				}
			})
			.attr('y', d => {
				if (d.target.y > d.source.y) {
					return d.source.y + (d.target.y - d.source.y)/2
				}
				else {
					return d.target.y + (d.source.y - d.target.y)/2
				}
			})
		
		gnodes.attr('transform', d => {
			return 'translate(' + [d.x, d.y] + ')'
		})
  }

  function drag(simulation) {    
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }
    
    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }
    
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }


  return Object.assign(svg.node(), {scales: {color}})
}

onMounted(() => {
	test.value = ForceGraph(data.value, {
		nodeId: d => d.id,
		nodeGroup: d => d.group,
		nodeTitle: d => `${d.id}\n${d.group}`,
		nodeRadius: 16,
		width: 1280,
		height: 720
	})

	console.log(test.value)
	document.getElementById('main').appendChild(test.value)


})
</script> -->

<!-- <template>
	<div class='flex justify-center mt-20 '>
		<div 
			id='mynetwork' 
			class='border-black border-2'
			:style='d'
		>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { DataSet } from 'vis-data/peer'
import { Network } from 'vis-network/peer'

const w = ref('1600px')
const h = ref('700px')

const d = computed(() => {
	return `width: ${w.value}}; height: ${h.value}`
})

const nodes = new DataSet([
  { id: 1, label: 'Node 1', title: 'TEST' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' }
])

// create an array with edges
const edges = new DataSet([
  { from: 1, to: 5, label: 'edge'},
  { from: 1, to: 5, label: 'edge'},
	{ from: 1, to: 2 },
	{ from: 2, to: 5 },
	{ from: 2, to: 4 },
	{ from: 3, to: 4 },
	{ from: 3, to: 2 }
])

onMounted(() => {
	// create a network
	const container = document.getElementById('mynetwork');
	const data = {
		nodes: nodes,
		edges: edges
	}
	const options = {
		width: w.value,
		height: h.value
	}
	const network = new Network(container, data, options)
})

</script> -->


<template>
	<div>
		<div 
			id='network' 
			class='border-black border-2'
			:style='d'
		>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'
import popper from 'cytoscape-popper'
import tippy, { sticky } from 'tippy.js'

cytoscape.use(popper)

const w = ref('1920px')
const h = ref('888px')

const tooltip = ref(null)
const tt = ref(null)

const d = computed(() => {
	return `width: ${w.value}; height: ${h.value}`
})

onMounted(() => {
	cydagre(cytoscape)
	const cy = cytoscape({
		container: document.getElementById('network'),
    boxSelectionEnabled: false,
    autounselectify: true,
		elements: {
			nodes: [
				{ data: { id: 0, name: 'RU-KURGAN-HQ01-SW01', type: 'SW', description: '' }}, 
				{ data: { id: 1, name: 'RU-KURGAN-HQ01-SW02', type: 'SW', description: '' }},
				{	data: { id: 2, name: 'RU-KURGAN-HQ01-SW03', type: 'SW', description: '' }},
				{ data: { id: 3, name: 'RU-KURGAN-HQ01-SW04', type: 'SW', description: '' }},
				{ data: { id: 4, name: 'RU-KURGAN-HQ01-SW05', type: 'SW', description: 'Join' }},
				{ data: { id: 5, name: 'RU-KURGAN-HQ01-SW06', type: 'SW', description: 'Branch Out' }},
				{ data: { id: 6, name: 'RU-KURGAN-HQ01-R01', type: 'R', description: '' }},
				{ data: { id: 7, name: 'RU-KURGAN-HQ01-R02', type: 'R', description: '' }}
			],
			edges: [
				{ data: { source: 0, target: 1, sLabel: 'Fa0/43', tLabel: 'Fa0/2' }},
				{ data: { source: 1, target: 0, sLabel: 'Fa0/1', tLabel: 'Fa0/44' }},
				{ data: { source: 0, target: 2, sLabel: 'Fa0/4', tLabel: 'Fa0/44' }},
				{ data: { source: 1, target: 3, sLabel: 'Fa0/5', tLabel: 'Fa0/21' }},
				{ data: { source: 1, target: 4, sLabel: 'Gi0/1', tLabel: 'Gi0/3' }},
				{ data: { source: 1, target: 5, sLabel: 'Fa0/8', tLabel: 'Fa0/25' }},
				{ data: { source: 4, target: 6, sLabel: 'Fa0/23', tLabel: 'Fa0/1' }},
				{ data: { source: 4, target: 7, sLabel: 'Fa0/47', tLabel: 'Fa0/1' }}
			]
		},

		style: cytoscape
      .stylesheet()
      .selector('node')
      .css({
				'background-image': (node) => {
					return node.data('type') === 'R' ? '/Router.png' : '/Switch.png'
				},
				'background-clip': 'none',
				'bounds-expansion' : 5,
				'text-margin-y': 10,
				'font-size': 10,
        content: 'data(name)',
        'text-wrap': 'wrap',
        'text-valign': 'bottom',
        'text-halign': 'center',
      })
      .selector('edge')
      .css({
        'text-outline-color': 'white',
        'text-outline-width': 1,
        'text-valign': 'center',
        'text-halign': 'left',
        'curve-style': 'bezier',
        width: 2,
        'line-color': 'gray',
				'edge-distances': 'node-position'
      })
			.selector('edge.mouseover')
			.css({
				'source-label': 'data(sLabel)',
				'target-label': 'data(tLabel)',
				'font-size': 14,
				'source-text-offset': 50,
				'target-text-offset': 50,
				'z-index': 100
			}),

		layout: {
      name: 'dagre',
      spacingFactor: 2.5,
      rankDir: 'TB',
      fit: true
		}
	})

	const toolTipNode = (el) => {
		let ref = el.popperRef()

		tooltip.value = document.createElement('div')
		let tip = tippy(tooltip.value, {
			theme: 'custom',
			getReferenceClientRect: ref.getBoundingClientRect,
			trigger: 'manual',
			content: () => {
				let div = document.createElement('div')

				div.innerHTML = el._private.data.id + '<br>' + el._private.data.description
				return div
			},
			arrow: false,
			// placement: 'top-start',
			placement: 'top',
			hideOnClick: false,
			sticky: 'reference',
			appendTo: document.getElementById('network'),
			plugins: [sticky]
		})

		return tip
	}

	// right click event
	cy.on('cxttap', 'node', (event) => {
		console.log(event.target)
	})

	cy.on('mouseover', 'node', (event) => {
		tt.value = toolTipNode(event.target)
		tt.value.show()
	})

	cy.on('mouseout', 'node', () => {
		tt.value.destroy()
	})

	cy.on('mouseover', 'edge', (event) => {
		event.target.addClass('mouseover')
	})

	cy.on('mouseout', 'edge', (event) => {
		event.target.removeClass('mouseover')
	})
})
</script>

<style>
.tippy-box[data-theme~='custom'] {
	background-color: rgb(213, 248, 225);
	border-width: 2px;
	border-radius: 10px;
	border-color: black;
	font-size: 14px;
	width: 175px;
  text-align: center;
	padding: 8px;
}
</style>
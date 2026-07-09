import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { hierarchy, tree } from 'd3-hierarchy'

const CorporateTree = ({ company, structuralData, freeData }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = 400

    // Create hierarchy data based on available information
    const children = []

    // Add subsidiaries from Wikidata if available
    if (freeData?.wikidata?.subsidiaries && freeData.wikidata.subsidiaries.length > 0) {
      children.push({
        name: 'Subsidiaries',
        children: freeData.wikidata.subsidiaries.map(sub => ({ name: typeof sub === 'object' ? sub.label || sub.id : sub }))
      })
    } else {
      children.push({
        name: 'Subsidiaries',
        children: [
          { name: 'Regional Operations' },
          { name: 'International Holdings' },
          { name: 'Special Purpose Entities' }
        ]
      })
    }

    // Add business units
    children.push({
      name: 'Business Units',
      children: [
        { name: 'Core Products' },
        { name: 'Services Division' },
        { name: 'R&D' }
      ]
    })

    // Add parent company if available
    if (freeData?.wikidata?.parentCompany) {
      const treeData = {
        name: typeof freeData.wikidata.parentCompany === 'object' 
          ? freeData.wikidata.parentCompany.label || freeData.wikidata.parentCompany.id 
          : freeData.wikidata.parentCompany,
        children: [
          {
            name: company.company.name,
            children: children
          }
        ]
      }
      
      const root = hierarchy(treeData)
      const treeLayout = tree().size([width - 100, height - 100])
      treeLayout(root)

      const g = svg
        .append('g')
        .attr('transform', 'translate(50,50)')

      // Add links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        )
        .attr('fill', 'none')
        .attr('stroke', 'rgba(148, 163, 184, 0.3)')
        .attr('stroke-width', 2)

      // Add nodes
      const nodes = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)

      nodes.append('circle')
        .attr('r', d => d.children ? 8 : 5)
        .attr('fill', d => d.children ? '#3b82f6' : '#10b981')
        .attr('stroke', '#1e40af')
        .attr('stroke-width', 2)

      nodes.append('text')
        .attr('dy', d => d.children ? -12 : 15)
        .attr('x', d => d.children ? 0 : 10)
        .style('text-anchor', d => d.children ? 'middle' : 'start')
        .style('fill', '#e2e8f0')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif')
        .text(d => d.data.name)
    } else {
      const treeData = {
        name: company.company.name,
        children: children
      }

      const root = hierarchy(treeData)
      const treeLayout = tree().size([width - 100, height - 100])
      treeLayout(root)

      const g = svg
        .append('g')
        .attr('transform', 'translate(50,50)')

      // Add links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        )
        .attr('fill', 'none')
        .attr('stroke', 'rgba(148, 163, 184, 0.3)')
        .attr('stroke-width', 2)

      // Add nodes
      const nodes = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)

      nodes.append('circle')
        .attr('r', d => d.children ? 8 : 5)
        .attr('fill', d => d.children ? '#3b82f6' : '#10b981')
        .attr('stroke', '#1e40af')
        .attr('stroke-width', 2)

      nodes.append('text')
        .attr('dy', d => d.children ? -12 : 15)
        .attr('x', d => d.children ? 0 : 10)
        .style('text-anchor', d => d.children ? 'middle' : 'start')
        .style('fill', '#e2e8f0')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif')
        .text(d => d.data.name)
    }

  }, [company, structuralData, freeData])

  return (
    <div className="w-full overflow-x-auto">
      <svg 
        ref={svgRef} 
        width="100%" 
        height="400"
        style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}
      />
    </div>
  )
}

export default CorporateTree

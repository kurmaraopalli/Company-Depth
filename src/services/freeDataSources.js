import axios from 'axios'

// Wikidata API - No API key required
export const fetchWikidataCompany = async (companyName) => {
  try {
    // Search for company in Wikidata
    const searchResponse = await axios.get(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(companyName)}&language=en&format=json&limit=5`
    )

    if (searchResponse.data.search && searchResponse.data.search.length > 0) {
      const entityId = searchResponse.data.search[0].id
      
      // Get detailed entity data
      const entityResponse = await axios.get(
        `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&format=json`
      )

      if (entityResponse.data.entities && entityResponse.data.entities[entityId]) {
        const entity = entityResponse.data.entities[entityId]
        return parseWikidataEntity(entity)
      }
    }
    return null
  } catch (error) {
    console.error('Wikidata API error:', error)
    return null
  }
}

const parseWikidataEntity = (entity) => {
  const claims = entity.claims || {}
  
  return {
    id: entity.id,
    label: entity.labels?.en?.value || '',
    description: entity.descriptions?.en?.value || '',
    headquarters: getClaimValue(claims, 'P159'), // headquarters location
    founded: getClaimValue(claims, 'P571'), // inception
    country: getClaimValue(claims, 'P17'), // country
    industry: getClaimValue(claims, 'P452'), // industry
    parentCompany: getClaimValue(claims, 'P749'), // parent organization
    subsidiaries: getClaimValues(claims, 'P355'), // subsidiary
    website: getClaimValue(claims, 'P856'), // official website
    stockSymbol: getClaimValue(claims, 'P249'), // stock ticker
    employees: getClaimValue(claims, 'P1128'), // employees
    revenue: getClaimValue(claims, 'P2139'), // revenue
  }
}

const getClaimValue = (claims, propertyId) => {
  if (!claims[propertyId] || !claims[propertyId][0]) return null
  
  const claim = claims[propertyId][0]
  if (claim.mainsnak?.datavalue?.value) {
    return claim.mainsnak.datavalue.value
  }
  return null
}

const getClaimValues = (claims, propertyId) => {
  if (!claims[propertyId]) return []
  
  return claims[propertyId]
    .filter(claim => claim.mainsnak?.datavalue?.value)
    .map(claim => claim.mainsnak.datavalue.value)
}

// Wikipedia API - No API key required
export const fetchWikipediaSummary = async (companyName) => {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(companyName)}`
    )
    
    return {
      title: response.data.title,
      extract: response.data.extract,
      thumbnail: response.data.thumbnail?.source,
      url: response.data.content_urls?.desktop?.page,
    }
  } catch (error) {
    console.error('Wikipedia API error:', error)
    return null
  }
}

// GitHub API - No API key required for basic data
export const fetchGitHubOrgData = async (companyName) => {
  try {
    // Try to find GitHub organization
    const orgName = companyName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '')
    
    const response = await axios.get(`https://api.github.com/orgs/${orgName}`)
    
    return {
      name: response.data.name,
      login: response.data.login,
      description: response.data.description,
      publicRepos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      avatar: response.data.avatar_url,
      blog: response.data.blog,
      location: response.data.location,
      url: response.data.html_url,
    }
  } catch (error) {
    console.error('GitHub API error:', error)
    return null
  }
}

// Combined free data fetch
export const fetchFreeCompanyData = async (companyName) => {
  const [wikidata, wikipedia, github] = await Promise.all([
    fetchWikidataCompany(companyName),
    fetchWikipediaSummary(companyName),
    fetchGitHubOrgData(companyName),
  ])

  return {
    wikidata,
    wikipedia,
    github,
    hasData: !!(wikidata || wikipedia || github),
  }
}

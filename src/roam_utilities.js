
export const updateBlock = (uid, snippet) => {
  const success = window.roamAlphaAPI.updateBlock(
    {
      "block":
      {
        "uid": uid,
        "string": snippet
      }
    })

  return success
}

export const getCurrContext = async () => {
  const currBlockId = document.activeElement.id.slice(-9)
  const currContext = await window.roamAlphaAPI.q('[:find (pull ?a [*]) :in $ ?id :where [?a :block/uid ?id]]', currBlockId)
  return currContext[0][0].string
}

export const getAllTags = () => {
  const tagPages = window.roamAlphaAPI.q('[ :find (pull ?e [*]) :where [?e :node/title] ] ')
  const tags = tagPages.map( page => page[0].title)
  return tags
}

export const getUidFromTextAreaElement = (element) => {
  const uid = element.attributes[2].nodeValue.slice(-9)
  return uid
}

export const getPageData = pageName => {
	const queryString = '[ :find (pull ?e [ :node/title :block/string :block/children :block/uid {:block/children ...} ]) :in $ ?name :where [?e :node/title ?name]]'
	return window.roamAlphaAPI.q(queryString, pageName)
}

export const getReferences = pageName => {
    const queryString = '[ :find (pull ?e [:node/title {:block/_refs [:block/string] }]) :in $ ?name :where [?e :node/title ?name]]'
    return window.roamAlphaAPI.q(queryString, pageName)
}

export const filterRoamJunk = string => {
  let outString = string.replace(/\[\[.+\]\]/, "") // Clear square brackets
  .replace(/\{\{.+\}\}/, "") // Clear curly brackets
  .replace(/\(\(.+\)\)/, "") // Clear double parentheses
  .replace(/#.+\s/, "") // Clear hashtags
  return outString
}
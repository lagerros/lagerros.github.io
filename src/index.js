import {getConfigFromPage} from "roam-client";
import userEvent from "@testing-library/user-event";

const config = getConfigFromPage("roam/js/GPT3-token");
const auth = config["API"]?.trim();

// GPT3 integration
const completion_url = "https://api.openai.com/v1/engines/ada/completions"
const search_url = "https://api.openai.com/v1/engines/ada/search"


const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': auth
           }

const options = (query) => ({
  method: "POST",
  headers: HEADERS,
   body: JSON.stringify(query)
})

// TODO: gah fix this

const requestC = async query => {
  let response = await fetch(completion_url, options( query ))
  return response
}

const requestS = async query => {
    let response = await fetch(search_url, options( query ))
    return response
  }

// This is really ugly and probably breaks a lot of stuff! #TODO
// let window: any

const getCurrContext = async () => {
  const currBlockId = document.activeElement.id.slice(-9)
  const currContext = await window.roamAlphaAPI.q('[:find (pull ?a [*]) :in $ ?id :where [?a :block/uid ?id]]', currBlockId)
  return currContext[0][0].string
}

const getAllTags = () => {
  const tagPages = window.roamAlphaAPI.q('[ :find (pull ?e [*]) :where [?e :node/title] ] ')
  const tags = tagPages.map( page => page[0].title)
  return tags
}


const semSearch = async (documents, query) => {
    const params = ({
        "documents": documents,
        "query": query
    })

    const r = requestS(params).then( async r =>
        await r.json() )

    const response = await r
    const data = response.data
    return data
}

const complete = async (prompt) => {
}

const formatTag = s => {
  const tag = / /.test(s) ? "#[["+s+"]]" : "#"+s
  return tag
}

const filterRoamJunk = string => {
    // TODO: debug this, not working
    let outString = string.slice(0)
    outString.replace(/\[\[.+\]\]/, "") // Clear square brackets
    .replace(/\{\{.+\}\}/, "") // Clear curly brackets
    .replace(/\(\(.+\)\)/, "") // Clear double parentheses
    .replace(/#.+\s/, "") // Clear hashtags
    return outString
}

const objToString = (obj,prefix="") => {
    /** Turns a given roam object into a markdown string representation **/
    let string = ""
    if (obj.title) { string += obj.title+"\n" }
    if (obj.string) { string += filterRoamJunk(obj.string)+"\n" }
    prefix += "*"
    if (obj.children) { obj.children.forEach( child => string += prefix+" "+objToString(child, prefix) ) }
    return(string)
}

const isStubPage = tag => {
    const data = getPageData(tag)[0][0]

    // Check if page has no content
    let textLength = 0
    const hasChildren = (data.children != undefined)
    if (hasChildren) {
        textLength += objToString.length
    }
    // Check if tag has been used less than 3 times
    const refs = getReferences(tag)[0][0]["_refs"]

    return !( hasChildren || textLength >= 50 || refs.length >= 3)
}

const getPageData = pageName => {
	const queryString = '[ :find (pull ?e [ :node/title :block/string :block/children :block/uid {:block/children ...} ]) :in $ ?name :where [?e :node/title ?name]]'
	return window.roamAlphaAPI.q(queryString, pageName)
}

const getReferences = pageName => {
    const queryString = '[ :find (pull ?e [:node/title {:block/_refs [:block/string] }]) :in $ ?name :where [?e :node/title ?name]]'
    return window.roamAlphaAPI.q(queryString, pageName)
}

const filterTags = tag => {
    if (
        /, 202\d/.test(tag) || // Filter out dates
        isStubPage(tag)
    ) { return false}
    else { return true }
}

// Roam integration
const keydownEventListener = async (e) => {
  if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {

    const prompt = document.activeElement.value
    const q = ({
      "prompt": prompt,
      "max_tokens": 50
    })

    requestC(q).then( async r => userEvent.type(
      e.target,
      await r.json().then( async s =>  await s.choices[0].text ))
    )
  }
};

const autoTagListener = async (e) => {
  if (e.shiftKey && e.ctrlKey && e.key === "T" && document.activeElement.tagName === "TEXTAREA") {

    const tags = getAllTags().filter( filterTags )
    console.log("tags", tags)
    const context = await getCurrContext()
    console.log("context", context)
    const response = await semSearch(tags, context)
    const data = [...response]
    const sortedTags = data.sort( (a, b) => a.score - b.score )
    const topTags = sortedTags.slice(-3).map( obj => tags[obj.document])
    const tagString = topTags.map( tag => formatTag(tag) ).join(" ")
    userEvent.type(
      e.target,
      tagString
    )
  }
};

document.addEventListener("keydown", keydownEventListener);
document.addEventListener("keydown", autoTagListener);

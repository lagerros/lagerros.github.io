import {getConfigFromPage} from "roam-client";
import userEvent from "@testing-library/user-event";

const config = getConfigFromPage("roam/js/GPT3-token");
const auth = config["API"]?.trim();

// GPT3 integration
const completion_url = "https://api.openai.com/v1/engines/davinci/completions"
const search_url = "https://api.openai.com/v1/engines/davinci/search"


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
    console.log(await response)

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
    let outString = string.slice(0, -1)
    outString.replace(/\[\[.+\]\]/, "") // Clear square brackets
    .replace(/\{\{.+\}\}/, "") // Clear curly brackets
    .replace(/\(\(.+\)\)/, "") // Clear double parentheses
    .replace(/#.+\s/, "") // Clear hashtags
    return outString
}

const objToString = obj => {
    console.log("obj", obj)

    /** Turns a given roam object into a single string representation **/
    let string = ""
    if (obj.title) { string += obj.title+"\n" }
   // console.log(string)
    if (obj.string) { string += "* "+filterRoamJunk(obj.string)+"\n" }
   // console.log(string)

    if (obj.children) {
        obj.children.forEach( child => string += "* "+objToString(child) )
    }
  //  console.log("made it thru with", string)

    return(string)
}

const isStubPage = tag => {
    const data = getPageData(tag)[0][0]
    console.log(objToString(data))
    const textLength = 0
    // Check if page has no content
    const hasChildren = (data.children != undefined)
    if (hasChildren) {

    }
    // Check if tag has been used less than 3 times
}

const getPageData = pageName => {
	const queryString = '[ :find (pull ?e [ :node/title :block/string :block/children :block/uid {:block/children ...} ]) :in $ ?name :where [?e :node/title ?name]]'
	return window.roamAlphaAPI.q(queryString, pageName)
}

isStubPage("Zoo")
isStubPage("TODO")

console.log(getPageData("Zoo"))

const filterTags = tag => {

    if (
        // Filter out dates
        /, 202\d/.test(tag) ||
        // Filter tags
        isStubPage(tag)

    ) { return false}

    else { return true }
}

// Roam integration
const keydownEventListener = async (e) => {
  if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {
    console.log("that stuff from in here?")

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

    console.log("update!!")

    const tags = getAllTags().slice(0,200)
    console.log("tags", tags)
    const context = await getCurrContext()
    console.log("context", context)
    const data = await semSearch(tags, context)
    console.log(await data)
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

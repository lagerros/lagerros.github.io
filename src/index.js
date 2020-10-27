import {getConfigFromPage} from "roam-client";
import userEvent from "@testing-library/user-event";

const config = getConfigFromPage("roam/js/GPT3-token");
const auth = config["API"]?.trim();

// GPT3 integration
const main_url = "https://api.openai.com/v1/engines/davinci/completions"

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': auth
           }

const options = (query) => ({
  method: "POST",
  headers: HEADERS,
   body: JSON.stringify(query)
})

const request = async query => {
  let response = await fetch(main_url, options( query ))
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

  const r = request(params).then( async r =>
      await r.json())

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

// Roam integration
const keydownEventListener = async (e) => {
  if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {
    console.log("that stuff from in here?")

    const prompt = document.activeElement.value

    const q = ({
      "prompt": prompt,
      "max_tokens": 50
    })

    request(q).then( async r => userEvent.type(
      e.target,
      await r.json().then( async s =>  await s.choices[0].text ))
    )
  }
};

const autoTagListener = async (e) => {
  if (e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {

    console.log("update!!")

    const tags = getAllTags()
    console.log(tags)
    const context = await getCurrContext()
    console.log(context)
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

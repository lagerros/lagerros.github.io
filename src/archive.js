
// const semSearch = async (documents, query) => {
//     const params = ({
//         "documents": documents,
//         "query": query
//     })

//     const r = requestS(params).then( async r =>
//         await r.json() )

//     const response = await r
//     const data = response.data
//     return data
// }

// const formatTag = s => {
//   const tag = / /.test(s) ? "#[["+s+"]]" : "#"+s
//   return tag
// }


// const objToString = (obj,prefix="") => {
//     /** Turns a given roam object into a markdown string representation **/
//     let string = ""
//     if (obj.title) { string += obj.title+"\n" }
//     if (obj.string) { string += filterRoamJunk(obj.string)+"\n" }
//     prefix += "*"
//     if (obj.children) { obj.children.forEach( child => string += prefix+" "+objToString(child, prefix) ) }
//     return(string)
// }

// const isStubPage = tag => {
//     const data = getPageData(tag)[0][0]

//     // Check if page has no content
//     let textLength = 0
//     const hasChildren = (data.children != undefined)
//     if (hasChildren) {
//         textLength += objToString.length
//     }
//     // Check if tag has been used less than 3 times
//     const refs = getReferences(tag)[0][0]["_refs"]

//     return !( hasChildren || textLength >= 50 || refs.length >= 3)
// }


// const filterTags = tag => {
//     if (
//         /, 202\d/.test(tag) || // Filter out dates
//         isStubPage(tag)
//     ) { return false}
//     else { return true }
// }

// // Roam integration
// Auto-complete block


// userEvent.type(
  // e.target,
  // await response.json().then( async s =>  await s.choices[0].text ))

// const autoTagListener = async (e) => {
//   if (e.shiftKey && e.ctrlKey && e.key === "T" && document.activeElement.tagName === "TEXTAREA") {

//     const tags = getAllTags().filter( filterTags )
//     console.log("tags", tags)
//     const context = await getCurrContext()
//     console.log("context", context)
//     const response = await semSearch(tags, context)
//     const data = [...response]
//     const sortedTags = data.sort( (a, b) => a.score - b.score )
//     const topTags = sortedTags.slice(-3).map( obj => tags[obj.document])
//     const tagString = topTags.map( tag => formatTag(tag) ).join(" ")
//     userEvent.type(
//       e.target,
//       tagString
//     )
//   }
// };
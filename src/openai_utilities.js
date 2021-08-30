import {getConfigFromPage} from "roam-client";
const config = getConfigFromPage("roam/js/GPT3-token");
const auth = config["API"]?.trim();

const completion_url = "https://api.openai.com/v1/engines/ada/completions"
const search_url = "https://api.openai.com/v1/engines/ada/search"

const auth = config["API"]?.trim();

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': auth
           }

const options = (query) => ({
  method: "POST",
  headers: HEADERS,
   body: JSON.stringify(query)
})



export const requestCompletion = async query => {
  let response = await fetch(completion_url, options( query ))
  return response
}

// const requestS = async query => {
//     let response = await fetch(search_url, options( query ))
//     return response
//   }

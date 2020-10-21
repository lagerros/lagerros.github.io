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

// Roam integration
const keydownEventListener = async (e: KeyboardEvent) => {
    if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {

      const prompt = (<HTMLTextAreaElement>document.activeElement).value

      const q = ({
        "prompt": prompt,
        "max_tokens": 50
      })

      request(q).then( async r => userEvent.type(
        e.target as HTMLTextAreaElement,
        await r.json().then( async s =>  await s.choices[0].text ))
      )
    }
  };

  document.addEventListener("keydown", keydownEventListener);

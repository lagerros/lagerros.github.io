console.log("back again from vs code, with typescript and webpack!!")

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

const q = ({
  "prompt": "Today, we will learn about tigers -- these fascinating beasts of the great open wild.",
  "max_tokens": 50
})

const request = async (query) => {
  return await fetch(main_url, options( query ))

}

const haha = request(q).then(response => response.json())

console.log(haha.then( r => console.log(r.choices[0].text)))


// Roam operation
let searchText = "";
let emojiOn = false;
let menuItemIndex = 0;
let currentTarget: HTMLTextAreaElement = document.createElement("textarea");

const insertEmoji = (target: HTMLTextAreaElement, emojiCode: string) => {
    console.log("this guy is inside insertEmoji")
    const initialValue = target.value;
    const preValue = initialValue.substring(
      0,
      initialValue.length - searchText.length
    );
    target.setSelectionRange(preValue.length, initialValue.length);
    userEvent.type(target, "{backspace}");
    userEvent.type(target, emojiCode);
  };

const inputEventListener = async (e: InputEvent) => {
    if (e.data === ":") {
        insertEmoji(e.target as HTMLTextAreaElement, "hi there!");
    }
  };

  document.addEventListener("input", inputEventListener);
console.log("3344 why would it be >50mb? something's wrong here...")

console.log("hmmmmmmmmm")

import {getConfigFromPage} from "roam-client";
import userEvent from "@testing-library/user-event";

const config = getConfigFromPage("roam/js/GPT3-token");
const auth = config["API"]?.trim();

console.log("auth", auth)

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

// function getSelectionText() {
//   var text = "";
//   if (window.getSelection) {
//       text = window.getSelection().toString();
//   } else if (document.selection && document.selection.type != "Control") {
//       text = document.selection.createRange().text;
//   }
//   return text;
// }

const keydownEventListener = async (e: KeyboardEvent) => {
    if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {

      const prompt = (<HTMLTextAreaElement>document.activeElement).value

      const q = ({
        "prompt": prompt,
        "max_tokens": 50
      })

      const request = async query => {
        let response = await fetch(main_url, options( query ))
        return response
      }

      request(q).then(async r =>
          insertEmoji(e.target as HTMLTextAreaElement, await r.json().then( async s =>  await s.choices[0].text ))
        )

      console.log("oh my gooooo")
    }
  };

  document.addEventListener("keydown", keydownEventListener);

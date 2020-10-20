console.log("j stuff!")

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

const q = ({
  "prompt": "Today, we will learn about tigers -- these fascinating beasts of the great open wild.",
  "max_tokens": 50
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

const inputEventListener = async (e: InputEvent) => {
    if (e.data === ":") {

        const request = async (query) => {
          return await fetch(main_url, options( query ))
        }

        const haha = await request(q).then(r => r.json())
        console.log("gosh, guess I'm hacking",
          haha.then( r =>
            insertEmoji(e.target as HTMLTextAreaElement, r.choices[0].text )
          )
        )
      //  const hehe = await haha.then(r => r.choices[0].text)
     //   console.log(haha.then( r => console.log(r.choices[0].text)))
        ;

    }
  };

  document.addEventListener("input", inputEventListener);

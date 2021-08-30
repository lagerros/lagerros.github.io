import {updateBlock, getUidFromTextAreaElement} from "./roam_utilities.js"
import {requestCompletion} from "./openai_utilities.js"

const completionListener = async (e) => {
  if (e.key === "G" && e.shiftKey && e.ctrlKey && document.activeElement.tagName === "TEXTAREA") {

    const prompt = document.activeElement.value
    const query = ({
      "prompt": prompt,
      "max_tokens": 50
    })

    const uid = getUidFromTextAreaElement(document.activeElement)

    requestCompletion(query).then( response => response.json() ).then( j => updateBlock(uid, prompt+j.choices[0].text))
  }
};

document.addEventListener("keydown", completionListener);
// document.addEventListener("keydown", autoTagListener);

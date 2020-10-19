console.log("back again from vs code!")
import userEvent from "@testing-library/user-event";

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
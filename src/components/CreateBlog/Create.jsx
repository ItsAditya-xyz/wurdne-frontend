import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// Components
import Navbar from "../Navbar/Navbar";
import TextBarButton from "./TextBarButton";

import "highlight.js/styles/atom-one-dark.css";

export default function Create() {
  const guideText = `# Guide is still a WIP!`;
  const appendBodyActions = {
    H1: "# || ",
    H2: "## || ",
    H3: "### || ",
    bold: "**||**",
    italic: "*||*",
    quote: "\n> || ",
    code: "\n```\n||```",
    link: "[||](Link)",
    embed: "%[||]",
    list: "\n- || ",
    "list-ol": "\n1. || ",
    image: "[!||](Link)"
  }

  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [currentTab, setCurrentTab] = useState(0); // 0: Write, 1: Preview, 2: Guide
  const [headDropOpen, setHeadDropOpen] = useState(false);

  const titleTextArea = useRef(undefined);
  const bodyTextArea = useRef(undefined);


  // Event Listeners
  const onTitleChange = e => {
    setTitleText(e.target.value);
    updateHeight(titleTextArea, 50);
  }

  const onBodyChange = e => {
    setBodyText(e.target.value);
    updateHeight(bodyTextArea, 300); // 296
  }

  const onBarBtnClicked = (e, actionID) => {
    // Get Selection
    let selectionStart = bodyTextArea.current.selectionStart;
    let selectionEnd = bodyTextArea.current.selectionEnd;
    // Add Text to it for the particular button
    let outText = getFormattedString(appendBodyActions[actionID], selectionStart, selectionEnd);
    setBodyText(outText);
    bodyTextArea.current.focus();
  }


  // Utility Functions
  const updateHeight = (element, minHeight = 96) => {
    // Change the height of the textarea if the content is larger
    if (element.current.scrollHeight >= minHeight) {
      element.current.style.height = "1px";
      element.current.style.height = `${element.current.scrollHeight+4}px`;
    }
  }

  const getFormattedString = (text, pointerStart, pointerEnd) => {
    let textToAdd = text.split("||");
    if (textToAdd[1] === " ") textToAdd[1] = "";
    let finalText = bodyText.substring(0, pointerStart) + textToAdd[0] + bodyText.substring(pointerStart, pointerEnd) + textToAdd[1] + bodyText.substring(pointerEnd);
    return finalText;
  }

  const openHeadDropdown = e => {
    setHeadDropOpen(!headDropOpen);
  }

  return (
    <>
      <Navbar title='Wurdne' />

      <div className="mt-24 w-4/5 m-auto px-8 mb-6">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button className="p-2 border-emerald-500 border rounded-md duration-300 hover:bg-emerald-500 hover:text-white">
              <i className="far fa-image"></i> Set Cover
            </button>
            <button className="p-2 border-emerald-500 border rounded-md duration-300 hover:bg-emerald-500 hover:text-white">
              <i className="fas fa-hashtag"></i> Add Tags
            </button>
          </div>
          <div className="btns-left">
            <button className="p-2 border-emerald-500 border rounded-md mx-2 duration-300 hover:bg-emerald-500 hover:text-white">Publish</button>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <textarea name="title" id="blogTitle" className="resize-none w-full rounded-md p-2 text-2xl font-bold border-transparent border no-ring focus:border-gray-300" rows="1" placeholder="Title..." value={titleText} onChange={onTitleChange} ref={titleTextArea}></textarea>
        </div>

        <div className="pr-4 mt-4 flex justify-between bg-gray-200 border border-gray-300 rounded-t-lg">
          <div className="text-views text-lg flex">
            <div className={`tab rounded-tl-lg ${currentTab == 0 && "active"}`} onClick={() => setCurrentTab(0)}>
              <i className="fas fa-pencil"></i> Write
            </div>
            <div className={`tab ${currentTab == 1 && "active"}`} onClick={() => setCurrentTab(1)}>
              <i className="fas fa-eye"></i> Preview
            </div>
            <div className={`tab ${currentTab == 2 && "active"}`} onClick={() => setCurrentTab(2)}>
              <i className="fas fa-book"></i> Guide
            </div>
          </div>
          <div className="text-btns flex gap-4">
            <div className="flex items-center" onClick={e => openHeadDropdown(e)}>
              <div className="inline-block relative cursor-pointer">
                <i className="fas fa-heading mr-2"></i>
                <i className="fas fa-chevron-down"></i>

                <ul className={`absolute ${!headDropOpen && "hidden"}  pt-1`}>
                <li className="">
                  <TextBarButton icon="h1" onClickHandler={e => onBarBtnClicked(e, "H1")} />
                </li>
                <li className="">
                    <TextBarButton icon="h2" onClickHandler={e => onBarBtnClicked(e, "H2")} />
                </li>
                <li className="">
                    <TextBarButton icon="h3" onClickHandler={e => onBarBtnClicked(e, "H3")} />
                </li>
              </ul>
              </div>
            </div>
            <TextBarButton icon="bold" onClickHandler={e => onBarBtnClicked(e, "bold")} />
            <TextBarButton icon="italic" onClickHandler={e => onBarBtnClicked(e, "italic")} />
            <TextBarButton icon="quote-left" onClickHandler={e => onBarBtnClicked(e, "quote")} />
            <TextBarButton icon="code" onClickHandler={e => onBarBtnClicked(e, "code")} />
            <TextBarButton icon="brackets-curly" onClickHandler={e => onBarBtnClicked(e, "link")} />
            <TextBarButton icon="list-ul" onClickHandler={e => onBarBtnClicked(e, "list")} />
            <TextBarButton icon="list-ol" onClickHandler={e => onBarBtnClicked(e, "list-ol")} />
            <TextBarButton icon="camera" onClickHandler={e => onBarBtnClicked(e, "image")} />
          </div>
        </div>

        {/* Write Tab */}
        <div className={`text-area ${currentTab != 0 && "hidden"}`}>
          <textarea className="resize-none w-full border border-gray-300 p-2 rounded-b-lg text-lg min-h-24 no-ring focus:border-gray-300" rows="10" placeholder="Write your story..." value={bodyText} onChange={onBodyChange} ref={bodyTextArea}></textarea>
        </div>

        {/* Preview + Guide Tab */}
        <div className={`preview-md ${![1, 2].includes(currentTab) && "hidden"}`}>
          <ReactMarkdown className="markdown-container unreset" rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
            {currentTab == 1 ? bodyText : guideText}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}

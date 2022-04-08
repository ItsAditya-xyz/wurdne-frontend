import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// Components
import Navbar from "../Navbar/Navbar";
import TextBarButton from "./TextBarButton";

// Other Imports
import guideText from "../Utils/GuideText";

import "highlight.js/styles/atom-one-dark.css";

export default function Create() {
  // const guideText = `# Guide is still a WIP!`;
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
    image: "![||](Link)"
  }

  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [currentTab, setCurrentTab] = useState(0); // 0: Write, 1: Preview, 2: Guide
  const [headDropOpen, setHeadDropOpen] = useState(false);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [postCover, setPostCover] = useState("");
  const [postTags, setPostTags] = useState([]);

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

  const onCoverInputChange = e => {
    let url = URL.createObjectURL(e.target.files[0]);
    setPostCover(url);
  }

  const onTagInputChange = e => {
    const text = e.target.value;

    if (text[text.length - 1] === " ") {
      let newTag = text.split(" ")[0]
      setPostTags([...postTags, newTag]);
      e.target.value = "";
    }
  }

  const onInputKeyDown = e => { // Remove Tags
    if (postTags.length <= 0) return;
    if (e.code === "Backspace" && e.target.value === "") {
      let newTags = [...postTags];
      newTags.splice(newTags.length - 1, 1);
      setPostTags(newTags);
    }
  }

  const onPublishBtnClicked = e => {
    // Publish
    console.log("Publishing...");
    alert("Publishing...Not really");
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

  return (
    <>
      <Navbar title='Wurdne' />

      <div className="mt-24 w-screen md:w-4/5 m-auto px-2 md:px-8 mb-6">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button className="p-2 border-emerald-500 border rounded-md duration-300 hover:bg-emerald-500 hover:text-white" onClick={e => setCoverModalVisible(true)}>
              <i className="far fa-image"></i> Set Cover
            </button>
            <button className="p-2 border-emerald-500 border rounded-md duration-300 hover:bg-emerald-500 hover:text-white" onClick={e => setTagModalVisible(true)}>
              <i className="fas fa-hashtag"></i> Add Tags
            </button>
          </div>
          <div className="btns-left">
            <button className="p-2 border-emerald-500 border rounded-md mx-2 duration-300 hover:bg-emerald-500 hover:text-white" onClick={onPublishBtnClicked}>Publish</button>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <textarea name="title" id="blogTitle" className="resize-none w-full rounded-md p-2 text-2xl font-bold border-transparent border no-ring focus:border-gray-300" rows="1" placeholder="Title..." value={titleText} onChange={onTitleChange} ref={titleTextArea}></textarea>
        </div>

        <div className="md:pr-4 mt-4 flex flex-col-reverse items-center md:flex-row md:justify-between bg-gray-200 border border-gray-300 rounded-t-lg">
          <div className="text-views w-full md:text-lg flex">
            <div className={`tab md:rounded-tl-lg ${currentTab == 0 && "active"}`} onClick={() => setCurrentTab(0)}>
              <i className="fas fa-pencil"></i> Write
            </div>
            <div className={`tab ${currentTab == 1 && "active"}`} onClick={() => setCurrentTab(1)}>
              <i className="fas fa-eye"></i> Preview
            </div>
            <div className={`tab ${currentTab == 2 && "active"}`} onClick={() => setCurrentTab(2)}>
              <i className="fas fa-book"></i> Guide
            </div>
          </div>
          <div className="text-btns flex gap-2 p-2 md:p-0 md:gap-4">
            <div className="flex items-center" onClick={e => setHeadDropOpen(!headDropOpen)}>
              <div className="inline-block relative cursor-pointer">
                <i className="fas fa-heading mr-1"></i>

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
              <i className="fas fa-chevron-down"></i>
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

      {/* Modals */}
      <div className={`absolute top-0 left-0 z-30 w-screen h-screen flex justify-center items-center bg-semi-transparent ${coverModalVisible || tagModalVisible || "hidden"}`}> 
        <div className={`bg-gray-50 rounded-lg ${!coverModalVisible && "hidden"}`}>
          <div className="px-8 py-3 text-2xl font-bold border-b border-b-gray-300 bg-gray-300 rounded-t-lg">
            Set Cover Image
          </div>
          <div className="px-8 py-4">
            <input type="file" accept="image/png, image/jpeg" onChange={onCoverInputChange} />
            {/* To Do */}
            <div className="preview w-96">
              <img src={postCover} alt="Cover Image Preview" className="max-w-96 max-h-96" />
            </div>
          </div>
          <div className="px-8 py-3 text-xl font-bold border-t border-t-gray-300 bg-gray-300 rounded-b-lg flex justify-end gap-2">
            <button className="px-2 py-1 text-white bg-red-600 border-red-700 hover:bg-red-700 border rounded-lg duration-300" onClick={e => setCoverModalVisible(false)}>Close</button>
            <button className="px-2 py-1 text-white bg-emerald-600 border-emerald-700 hover:bg-emerald-700 border rounded-lg duration-300" onClick={e => setCoverModalVisible(false)}>Save</button>
          </div>
        </div>

        <div className={`bg-gray-50 rounded-lg ${!tagModalVisible && "hidden"}`}>
          <div className="px-8 py-3 text-2xl font-bold border-b border-b-gray-300 bg-gray-300 rounded-t-lg">
            Set Tags
          </div>
          <div className="px-8 py-4">
            <label htmlFor="tagInput" className="text-lg">Select Tags: </label>
            <div className="input-row flex items-center border p-2 rounded-md border-gray-500">
              {postTags.map((tag, idx) => (<div className="tag-badge" key={idx}>{tag}</div>))}
              <input type="text" className="w-full no-ring border-0 p-1" onChange={onTagInputChange} onKeyDown={onInputKeyDown} id="tagInput" />
            </div>
            
          </div>
          <div className="px-8 py-3 text-xl font-bold border-t border-t-gray-300 bg-gray-300 rounded-b-lg flex justify-end gap-2">
            <button className="px-2 py-1 text-white bg-red-600 border-red-700 hover:bg-red-700 border rounded-lg duration-300" onClick={e => setTagModalVisible(false)}>Close</button>
            <button className="px-2 py-1 text-white bg-emerald-600 border-emerald-700 hover:bg-emerald-700 border rounded-lg duration-300" onClick={e => setTagModalVisible(false)}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import TextEditorBar from './TextEditorBar';

import guideText from "../Utils/GuideText";

const TextEditor = ({ titleText, bodyText, setTitleText, setBodyText, uploadImage }) => {
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
    image: "![||](Loading...)",
  };

  const [currentTab, setCurrentTab] = useState(0); // 0: Write, 1: Preview, 2: Guide
  const titleTextArea = useRef(undefined);
  const bodyTextArea = useRef(undefined);

  // Event Handlers
  const onBarBtnClicked = async (e, actionID, rawImage) => {
    // Get Selection
    let selectionStart = bodyTextArea.current.selectionStart;
    let selectionEnd = bodyTextArea.current.selectionEnd;
    // Add Text to it for the particular button
    let outText = getFormattedString(
      appendBodyActions[actionID],
      selectionStart,
      selectionEnd
    );
    setBodyText(outText);
    if (actionID === "image") {
      bodyTextArea.current.readonly = true;
      const response = await uploadImage(rawImage);
      console.log(response);
      // @todo Make it more reliable and prevent from changing the image tags at other places
      const newText = outText.replace("![](Loading...)", `![](${response.ImageURL})`);
      setBodyText(newText);
      console.log(newText);
      bodyTextArea.current.readonly = false;
    }
    bodyTextArea.current.focus();
  };

  const onTitleChange = (e) => {
    setTitleText(e.target.value);
    updateHeight(titleTextArea, 50);
  };

  const onBodyChange = (e) => {
    setBodyText(e.target.value);
    updateHeight(bodyTextArea, 300); // 296
  };

  // Utility Functions
  const updateHeight = (element, minHeight = 96) => {
    // Change the height of the textarea if the content is larger
    if (element.current.scrollHeight >= minHeight) {
      element.current.style.height = "1px";
      element.current.style.height = `${element.current.scrollHeight + 4}px`;
    }
  };

  const getFormattedString = (text, pointerStart, pointerEnd) => {
    let textToAdd = text.split("||");
    if (textToAdd[1] === " ") textToAdd[1] = "";
    let finalText =
      bodyText.substring(0, pointerStart) +
      textToAdd[0] +
      bodyText.substring(pointerStart, pointerEnd) +
      textToAdd[1] +
      bodyText.substring(pointerEnd);
    return finalText;
  };

  return (
    <>
      {/* Title Element */}
      <div className='flex flex-col mt-6'>
        <textarea
          name='title'
          id='blogTitle'
          className='resize-none w-full rounded-md p-2 text-2xl font-bold border-transparent border no-ring focus:border-gray-300'
          rows='1'
          placeholder='Title...'
          value={titleText}
          onChange={onTitleChange}
          ref={titleTextArea}
        ></textarea>
      </div>

      {/* Text Editor bar */}
      <TextEditorBar currentTab={currentTab} setCurrentTab={setCurrentTab} onBarBtnClicked={onBarBtnClicked} />

      {/* Write Tab */}
      <div className={`text-area ${currentTab != 0 && "hidden"}`}>
        <textarea
          className='resize-none w-full border border-gray-300 p-2 rounded-b-lg text-lg min-h-24 no-ring focus:border-gray-300'
          rows='10'
          placeholder='Write your story...'
          value={bodyText}
          onChange={onBodyChange}
          ref={bodyTextArea}
        ></textarea>
      </div>

      {/* Preview + Guide Tab */}
      <div className={`preview-md ${![1, 2].includes(currentTab) && "hidden"}`}>
        <ReactMarkdown
          className='markdown-container unreset'
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}>
          {currentTab == 1 ? bodyText : guideText}
        </ReactMarkdown>
      </div>
    </>
  )
}

export default TextEditor
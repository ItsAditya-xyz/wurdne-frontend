import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import TextBarButton from "./TextBarButton";

// @todo - 
// Line 15

export default function Create() {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [currentTab, setCurrentTab] = useState(0); // 0: Write, 1: Preview, 2: Guide

  const switchTab = tabIdx => {
    setCurrentTab(tabIdx);
    // Change Component
  };

  const onTitleChange = e => {
    setTitleText(e.target.value);
  };

  const onBodyChange = e => {
    setBodyText(e.target.value);
  };

  return (
    <>
      <Navbar title='Wurdne' />

      <div className="mt-24 w-4/5 m-auto px-8">
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
          <textarea name="title" id="blogTitle" className="resize-none w-full rounded-md p-2 text-2xl font-bold border-gray-500 border-none outline-none" rows="1" placeholder="Title..." value={titleText} onChange={onTitleChange}></textarea>
        </div>

        <div className="pr-4 mt-4 flex justify-between bg-gray-200 border border-gray-300 rounded-t-lg">
          <div className="text-views text-lg flex">
            <div className={`tab rounded-tl-lg ${currentTab == 0 && "active"}`} onClick={() => switchTab(0)}>
              <i className="fas fa-pencil"></i> Write
            </div>
            <div className={`tab ${currentTab == 1 && "active"}`} onClick={() => switchTab(1)}>
              <i className="fas fa-eye"></i> Preview
            </div>
            <div className={`tab ${currentTab == 2 && "active"}`} onClick={() => switchTab(2)}>
              <i className="fas fa-book"></i> Guide
            </div>
          </div>
          <div className="text-btns flex gap-4">
            <TextBarButton icon="heading" />
            <TextBarButton icon="bold" />
            <TextBarButton icon="italic" />
            <TextBarButton icon="quote-left" />
            <TextBarButton icon="code" />
            <TextBarButton icon="brackets-curly" />
            <TextBarButton icon="list-ul" />
            <TextBarButton icon="list-ol" />
            <TextBarButton icon="camera" />
          </div>
        </div>

        <div className="text-area">
          <textarea className="resize-none w-full border border-gray-300 p-2 h-fit rounded-b-lg text-lg" rows="10" placeholder="Write your story..." value={bodyText} onChange={onBodyChange}></textarea>
        </div>
      </div>
    </>
  );
}

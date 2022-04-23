import React, { useState } from 'react';

import TextBarButton from "./TextBarButton";

const TextEditorBar = ({currentTab, setCurrentTab, onBarBtnClicked}) => {
  const [headDropOpen, setHeadDropOpen] = useState(false);

  return (
    <div className='md:pr-4 mt-4 flex flex-col-reverse items-center md:flex-row md:justify-between bg-gray-200 border border-gray-300 rounded-t-lg'>
          <div className='text-views w-full md:text-lg flex'>
            <div
              className={`tab md:rounded-tl-lg ${currentTab == 0 && "active"}`}
              onClick={() => setCurrentTab(0)}>
              <i className='fas fa-pencil'></i> Write
            </div>
            <div
              className={`tab ${currentTab == 1 && "active"}`}
              onClick={() => setCurrentTab(1)}>
              <i className='fas fa-eye'></i> Preview
            </div>
            <div
              className={`tab ${currentTab == 2 && "active"}`}
              onClick={() => setCurrentTab(2)}>
              <i className='fas fa-book'></i> Guide
            </div>
          </div>
          <div className='text-btns hidden md:flex gap-2 p-2 md:p-0 md:gap-4'>
            <div
              className='flex items-center'
              onClick={(e) => setHeadDropOpen(!headDropOpen)}>
              <div className='inline-block relative cursor-pointer'>
                <i className='fas fa-heading mr-1'></i>

                <ul className={`absolute ${!headDropOpen && "hidden"}  pt-1`}>
                  <li className=''>
                    <TextBarButton
                      icon='h1'
                      onClickHandler={(e) => onBarBtnClicked(e, "H1")}
                    />
                  </li>
                  <li className=''>
                    <TextBarButton
                      icon='h2'
                      onClickHandler={(e) => onBarBtnClicked(e, "H2")}
                    />
                  </li>
                  <li className=''>
                    <TextBarButton
                      icon='h3'
                      onClickHandler={(e) => onBarBtnClicked(e, "H3")}
                    />
                  </li>
                </ul>
              </div>
              <i className='fas fa-chevron-down'></i>
            </div>
            <TextBarButton
              icon='bold'
              onClickHandler={(e) => onBarBtnClicked(e, "bold")}
            />
            <TextBarButton
              icon='italic'
              onClickHandler={(e) => onBarBtnClicked(e, "italic")}
            />
            <TextBarButton
              icon='quote-left'
              onClickHandler={(e) => onBarBtnClicked(e, "quote")}
            />
            <TextBarButton
              icon='code'
              onClickHandler={(e) => onBarBtnClicked(e, "code")}
            />
            <TextBarButton
              icon='brackets-curly'
              onClickHandler={(e) => onBarBtnClicked(e, "link")}
            />
            <TextBarButton
              icon='list-ul'
              onClickHandler={(e) => onBarBtnClicked(e, "list")}
            />
            <TextBarButton
              icon='list-ol'
              onClickHandler={(e) => onBarBtnClicked(e, "list-ol")}
            />
            <TextBarButton
              icon='camera'
              onClickHandler={(e) => onBarBtnClicked(e, "image")}
            />
          </div>
        </div>
  )
}

export default TextEditorBar
import React, { useState, useEffect, useRef } from "react";
import DesoApi from "../../tools/desoAPI";
import Deso from "deso-protocol";

// Components
import Navbar from "../Navbar/Navbar";
import TopBtnBar from "./TopBtnBar";
import TextEditor from "./TextEditor";
import { useNavigate, useParams } from "react-router-dom";

import "highlight.js/styles/atom-one-dark.css";
import Loader from "../Utils/Loader";

const da = new DesoApi();
const deso = new Deso();

export default function Edit() {
  const { postHash } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(true);
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [postCover, setPostCover] = useState("");
  const [postTags, setPostTags] = useState([]);
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState("");

  const tagInput = useRef();

  useEffect(async () => {
    const publicKey = localStorage.getItem("login_key");
    if (publicKey === undefined || publicKey === null) {
      window.location.href = "/";
    } else {
      //get public key from local storage
      setLoggedInPublicKey(publicKey);
      const response = await deso.posts.getSinglePost({
        PostHashHex: postHash,
      });
      if (!response.PostFound) {
        console.log("An Error Occured!");
        return;
      }

      const postData = response.PostFound;
      if (publicKey !== postData.PosterPublicKeyBase58Check) {
        console.log("You are not authorized to edit this post!");
        return;
      }
      setTitleText(postData.PostExtraData.Title);
      setBodyText(postData.Body);
      let imgURL = "";
      try {
        imgURL = postData.ImageURLs[0];
      } catch (e) {
        imgURL = "";
      }
      setPostCover(imgURL);
      setPostTags(postData.PostExtraData.Tags.split(" "));

      setIsloading(false);
    }
  }, []);

  // Event Listeners
  const onCoverInputChange = async (e) => {
    let rawImage = e.target.files[0];
    if (!rawImage) {
      setPostCover(null);
    }
    let url = URL.createObjectURL(rawImage);
    const response = await uploadImage(rawImage);
    if (response) {
      setCoverImageURL(response.ImageURL);
    }
    setPostCover(url);
    e.target.value = "";
  };

  const onTagInputChange = (e) => {
    const text = e.target.value;

    if (text[text.length - 1] === " ") {
      let newTag = text.split(" ")[0];
      setPostTags([...postTags, newTag]);
      if (postTags.length + 1 >= 5) {
        tagInput.current.readOnly = true;
      }
      console.log(postTags.length);
      e.target.value = "";
    }
  };

  const onInputKeyDown = (e) => {
    // Remove Tags
    if (postTags.length <= 0) return;
    if (e.code === "Backspace" && e.target.value === "") {
      let newTags = [...postTags];
      newTags.splice(newTags.length - 1, 1);
      setPostTags(newTags);
      if (newTags.length <= 5) {
        tagInput.current.readOnly = false;
      }
    }
  };

  const onPublishBtnClicked = async (e) => {
    // Publish
    if (isPosting) {
      return;
    }
    console.log(titleText);
    console.log(coverImageURL);
    console.log(postTags);
    console.log(bodyText);
    setIsPosting(true);
    console.log("Updating...");
    let stringTags = postTags.join(" ");
    const reqeustPayload = {
      UpdaterPublicKeyBase58Check: loggedInPublicKey,
      BodyObj: {
        Body: bodyText,
        VideoURLs: [],
        ImageURLs: [coverImageURL],
      },
      PostExtraData: {
        Title: titleText,
        Tags: stringTags,
      },
      PostHashHexToModify: postHash,
    };

    const response = await deso.posts.submitPost(reqeustPayload);

    console.log("post doneee");
    console.log(response);
    if (response) {
      const createdPostHashHex = response.PostHashHex;
      //const userJwt = await deso.identity.getJwt(undefined);
      /*const backendSubmitResponse = await da.submitBlog(
        loggedInPublicKey,
        titleText,
        createdPostHashHex,
        stringTags.toLowerCase(),
        response.TstampNanos,
        userJwt
      );*/
      //console.log(backendSubmitResponse);
      navigate(`/post/${postHash}`);
      //will redirect to the published post
    }
    setIsPosting(false);
  };

  // Utilities
  const uploadImage = async (rawImage) => {
    const request = undefined;
    const JwtToken = await deso.identity.getJwt(request);
    const response = await da.uploadImage(
      rawImage,
      loggedInPublicKey,
      JwtToken
    );
    return response;
  };

  return (
    <>
      <Navbar title='Wurdne' />
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className='mt-24 w-screen md:w-4/5 m-auto px-2 md:px-8 mb-6'>
            <TopBtnBar
              setTagModalVisible={setTagModalVisible}
              publishHandler={onPublishBtnClicked}
              isPosting={isPosting}
              coverImgHandler={onCoverInputChange}
              buttonName= "Update"
            />

            {/* Cover Image Preview */}

            <div
              className={`cover-preview bg-center rounded-lg bg-no-repeat w-2/3 mx-auto h-96 bg-cover relative  ${
                !postCover && "hidden"
              }`}
              style={{ backgroundImage: `url(${postCover})` }}>
              <div className='cover-toolkit absolute top-0 right-0 m-5 flex items-center'>
                <button
                  className='px-4 py-2 bg-red-600 text-white opacity-75 hover:opacity-100 duration-300 rounded-lg'
                  onClick={() => setPostCover(null)}>
                  <i className='fal fa-close'></i>
                </button>
              </div>
            </div>

            <TextEditor
              titleText={titleText}
              bodyText={bodyText}
              setTitleText={setTitleText}
              setBodyText={setBodyText}
              uploadImage={uploadImage}
            />
          </div>
          {/* Modals */}
          <div
            className={`absolute top-0 left-0 z-30 w-screen h-screen flex justify-center items-center bg-semi-transparent ${
              !tagModalVisible && "hidden"
            }`}>
            {/* Tag Modal */}
            <div
              className={`bg-gray-50 rounded-lg ${
                !tagModalVisible && "hidden"
              }`}>
              <div className='px-8 py-3 text-2xl font-bold border-b border-b-gray-300 bg-gray-300 rounded-t-lg'>
                Set Tags
              </div>
              <div className='px-8 py-4'>
                <label htmlFor='tagInput' className='text-lg'>
                  Select Tags:{" "}
                </label>
                <div className='input-row flex items-center border p-2 rounded-md border-gray-500'>
                  {postTags.map((tag, idx) => (
                    <div className='tag-badge' key={idx}>
                      {tag}
                    </div>
                  ))}
                  <input
                    type='text'
                    className='w-full no-ring border-0 p-1'
                    onChange={onTagInputChange}
                    onKeyDown={onInputKeyDown}
                    id='tagInput'
                    ref={tagInput}
                  />
                </div>
              </div>
              <div className='px-8 py-3 text-xl font-bold border-t border-t-gray-300 bg-gray-300 rounded-b-lg flex justify-end gap-2'>
                <button
                  className='px-2 py-1 text-white bg-red-600 border-red-700 hover:bg-red-700 border rounded-lg duration-300'
                  onClick={(e) => setTagModalVisible(false)}>
                  Close
                </button>
                <button
                  className='px-2 py-1 text-white bg-emerald-600 border-emerald-700 hover:bg-emerald-700 border rounded-lg duration-300'
                  onClick={(e) => setTagModalVisible(false)}>
                  Save
                </button>
              </div>
            </div>
          </div>{" "}
        </div>
      )}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Deso from 'deso-protocol';
import { DateTime } from 'luxon';

import Navbar from '../Navbar/Navbar';

const Post = () => {
  const { hash } = useParams();

  const [postTitle, setPostTitle] = useState("Post Title");
  const [postpfp, setPostpfp] = useState("");
  const [postUsername, setPostUserName] = useState("itsAditya");
  const [postDate, setPostDate] = useState("September 21, 2021");
  const [postCover, setPostCover] = useState("");
  const [postBody, setPostBody] = useState("Loading...");
  const [postTags, setPostTags] = useState([]);

  useEffect(async () => {
    const deso = new Deso();
    
    const response = await deso.posts.getSinglePost({PostHashHex: hash});
    if (response.status != 200) {
      console.log("An Error Occured!");
      return;
    }

    const postData = response.data.PostFound;
    setPostBody(postData.Body);
    setPostCover(postData.ImageURLs[0]);
    setPostUserName(postData.ProfileEntryResponse.Username);
    setPostTitle(postData.PostExtraData.title || "Post Title");
    setPostTags(JSON.parse(postData.PostExtraData.tags) || []);

    const timestamp = postData.TimestampNanos;
    setPostDate(DateTime.fromMillis(timestamp / 1e6).toLocaleString(DateTime.DATE_FULL));

    const postPublicKey = postData.ProfileEntryResponse.PublicKeyBase58Check;
    const pfp = await deso.user.getSingleProfilePicture(postPublicKey);
    setPostpfp(pfp);

  }, [hash]);
  

  return (
    <>
        <Navbar title="Wurdne" />

        <div className="mt-24 mx-auto w-screen md:w-5/6 px-2 md:px-8">
          <div className="post-head">
            <div className="text-4xl font-bold break-words">
              {postTitle}
            </div>
            <div className="flex">
              <div className="p-2">
                <img src={postpfp} alt={`${postUsername}'s Avatar`} className="rounded-full h-12 w-12" />
              </div>
              <div className="user-text flex flex-col justify-center p-2 text-gray-800">
                <Link to={`/users/${postUsername}`} className="username font-bold hover:underline">
                  {postUsername}
                </Link>
                <div className="post-date italic">
                  {postDate}
                </div>
              </div>
            </div>
          </div>

        <div className="cover-img py-4">
          <img src={postCover} alt="" className="rounded-lg md:max-w-4xl w-full mx-auto" />
        </div>

        <ReactMarkdown
          className="post-content text-xl break-words unreset"
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {postBody}
        </ReactMarkdown>

        <div className="tag-bar py-2 flex gap-2">
          { 
            postTags.map((tag, idx) => {
              return (
                <Link key={idx} to={`/tag/${tag.replace(" ", "-")}`} className="tag-capsule p-2 border border-gray-600 rounded-full hover:bg-gray-600 hover:text-white duration-300">
                  # {tag}
                </Link>)
            })
          }
          
        </div>
      </div>
    </>
  )
}

export default Post
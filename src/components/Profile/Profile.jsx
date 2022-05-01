import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Deso from "deso-protocol";
import Navbar from "../Navbar/Navbar";
import Loader from "../../components/Utils/Loader";
import DesoApi from "../../tools/desoAPI";
export default function Profile() {
  const { userName } = useParams();
  console.log(userName);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [blogsByUser, setBlogsByUser] = useState([]);

  const deso = new Deso();
  const desoAPI = new DesoApi();
  useEffect(async () => {
    try {
      const response = await deso.user.getSingleProfile({ Username: userName });
      setProfileData(response);
      const publicKeyOfUser = response.Profile.PublicKeyBase58Check;
      const blogByUserResponse = await desoAPI.getBlogsByPublicKey(
        publicKeyOfUser
      );
      setBlogsByUser(blogByUserResponse.postsFound);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return (
    <>
      <Navbar title='Wurdne' />
      {isLoading ? (
        <div className='my-28'>
          {" "}
          <Loader />
        </div>
      ) : profileData === null ? (
        <div className='mx-auto md:w-5/6 px-2 py-12 md:px-8 my-32'>
          profile not found with that username{" "}
        </div>
      ) : (
        <div className='mx-auto md:w-5/6 px-2 py-32 md:px-8'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2'>
              <img
                className='rounded-full w-32 h-32 md:w-48 md:h-48'
                src={`https://diamondapp.com/api/v0/get-single-profile-picture/${profileData.Profile.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default_profile_pic.png
                    `}
                alt='profile pic'
              />
            </div>
            <div className='w-full md:w-1/2'>
              <div className='flex flex-col md:flex-row'>
                <div className='w-full md:w-1/2'>
                  <h1 className='text-2xl font-bold'>
                    {profileData.Profile.Username}
                  </h1>
                  <p className='text-gray-700'>
                    {profileData.Profile.Description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {blogsByUser.map((item) => {
            return (
              <div className='my-32' key={item.postHashHex}>
                {item.postHashHex}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

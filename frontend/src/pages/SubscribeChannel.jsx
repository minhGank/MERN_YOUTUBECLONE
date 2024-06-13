import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .no_video_from_subscribe_list {
    display: flex;
    align-items: center;
    justify-content: center;
    h3 {
      color: white;
    }
  }
`;

export default function Subscribe() {
  const [subscribeVideo, setSubscribeVideo] = useState([]);

  const showToastMessage = (result, msg) => {
    if (result === true) {
      toast.success(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  //fetch videos from subscribe channels function
  useEffect(() => {
    const fetchSubcribeVideo = async () => {
      try {
        const res = await axios.get("/getVideofromSubscribeChannels");
        if (res.data.status == false) {
          showToastMessage(false, res.data.msg);
          return null;
        }
        return res.data.videosFromSubscribeChannels;
      } catch (error) {
        console.log(error);
      }
      const result = fetchSubcribeVideo();
      if (!result) {
        return;
      } else {
        setSubscribeVideo(result);
      }
    };
  });

  return (
    <Container>
      {Array.isArray(subscribeVideo) && subscribeVideo.length > 0 ? (
        subscribeVideo.map((video) => {
          return <Card />;
        })
      ) : (
        <div className="no_video_from_subscribe_list">
          <h3>There's no video from your subscribe channels</h3>
        </div>
      )}

      <ToastContainer />
    </Container>
  );
}

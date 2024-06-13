import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .No_Video_Available {
    p {
      color: white;
    }
  }
`;

const Home = () => {
  const [videos, setVideos] = useState([]);

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get("http://localhost:7000/getRandomVideo");
        showToastMessage(res.data.status, res.data.msg);
        if (res.data.status === true) {
          return res.data.status;
        }
      } catch (error) {
        console.log(error);
      }
      const fetchVideos = fetchVideo();
      setVideos(fetchVideos);
    };
    fetchVideo();
  }, []);
  return (
    <Container>
      {Array.isArray(videos) && videos.length > 0 ? (
        videos?.map((video) => {
          return <Card />;
        })
      ) : (
        <div className="No_Video_Available">
          <p>No video is available</p>
        </div>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Home;

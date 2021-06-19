import React, { useState, useCallback, useEffect } from "react";
import { classList } from "dynamic-class-list";

import emptyHeart from "../images/heart-empty.svg";
import fillHeart from "../images/hear-fill.svg";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { UUID } from "../utils/constants";

function shareOnFB({ title, url }) {
  const fullUrl = encodeURI(`https://tusharsharma.dev${url}`);
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}&t=${title}`;
  typeof window !== "undefined" &&
    window.open(
      fbUrl,
      "FacebookWindow",
      "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=500,height=500"
    );
  return false;
}

function shareOntwitter({ title, url }) {
  const fullUrl = encodeURI(`https://tusharsharma.dev${url}`);
  const tweetUrl = `https://twitter.com/intent/tweet?url=${fullUrl}&via=tusharf5&text=${title}`;
  typeof window !== "undefined" &&
    window.open(
      tweetUrl,
      "TwitterWindow",
      "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=500,height=500"
    );
  return false;
}

async function fetchLikesCount() {
  try {
    const resp = await fetch(
      "https://tusharsharma-website.firebaseio.com/likes/.json"
    );
    const body = await resp.json();
    return body;
  } catch (e) {
    console.error("fetchLikesCount", e);
    return {};
  }
}

async function registerLike(postId) {
  return fetch(
    `https://obscure-journey-06568.herokuapp.com/?id=${encodeURIComponent(
      postId
    )}`
  );
}

export default function PostFooter({ title, url, postId }) {
  const [likes, setLikes] = useState(false);
  const [shake, setShake] = useState(true);
  const [uuid] = useLocalStorage(UUID);
  const [liked, setLiked] = useLocalStorage(`${uuid}::${postId}`, false);

  // effect on likes
  const onLike = useCallback(() => {
    if (!liked) {
      setLiked(true);
      setLikes(likes + 1);
      registerLike(postId).catch((e) => {
        setLiked(false);
        console.log(e);
      });
    }
  }, [liked, setLiked, setLikes, likes, postId]);

  // fetch likes side effect
  useEffect(() => {
    const __getlikes = async () => {
      // bad hack need to force update like state
      setLiked(!liked);
      const likes = await fetchLikesCount();
      const count = likes[postId] | null;
      setLikes(count);
      // bad hack need to force update like state
      setLiked(liked);
    };
    __getlikes();
  }, [postId, setLikes]);

  // shaking side effect
  useEffect(() => {
    let intervalId = null;
    let interval = null;
    if (!liked) {
      interval = setInterval(() => {
        setShake(true);
        intervalId = setTimeout(() => {
          setShake(false);
        }, 1000);
      }, 10000);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(intervalId);
    };
  }, [setShake]);

  return (
    <footer className="footer">
      <div className="social-react">
        <img
          alt="heart like"
          className={classList({
            liked: liked,
            unliked: !liked,
            shakeMe: liked ? false : shake,
          })}
          onClick={onLike}
          src={liked ? fillHeart : emptyHeart}
        />
        <span>{likes ? likes : null}</span>
      </div>
      <div className="social-share">
        <div className="line"></div>
        <div className="links">
          <a

            href="https://twitter.com/tusharf5?ref_src=twsrc%5Etfw"
            className="twitter-follow-button"
            data-show-count="true"
            data-dnt="true"
          >
            Follow
          </a>
        </div>
      </div>
    </footer>
  );
}

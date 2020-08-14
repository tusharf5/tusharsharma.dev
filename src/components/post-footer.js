import React, { useState, useCallback, useEffect, useRef } from "react";
import { classList } from "dynamic-class-list";

import emptyHeart from "../images/heart-empty.svg";
import fillHeart from "../images/hear-fill.svg";

import loadDb from "../utils/load-firebase-db";
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

export default function PostFooter({ title, url, id: postId }) {
  const [likes, setLikes] = useState(false);
  const [shake, setShake] = useState(true);
  const [uuid, setUuid] = useLocalStorage(UUID, null);
  const [liked, setLiked] = useLocalStorage(`${uuid}::${postId}`, false);

  const image = useRef(null);

  useEffect(() => {
    !uuid && setUuid(nanoid(23));
  }, []);

  const onLike = useCallback(() => {
    const registerLike = () =>
      fetch(
        `https://obscure-journey-06568.herokuapp.com/?id=${encodeURIComponent(
          postId
        )}`
      );
    if (!liked) {
      try {
        registerLike();
      } catch {}
    }
    setLiked(!liked);
  }, [postId, setLiked, liked]);

  useEffect(() => {
    const onLikes = newLikes => setLikes(newLikes.val());
    let db;

    const fetchData = async () => {
      db = await loadDb();
      db.child(postId).on("value", onLikes);
    };

    fetchData();

    return function cleanup() {
      db.child(postId).off("value", onLikes);
    };
  }, [postId, setLikes]);

  useEffect(() => {
    let intervalId = null;
    const interval = setInterval(() => {
      setShake(true);
      intervalId = setTimeout(() => {
        setShake(false);
      }, 1000);
    }, 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(intervalId);
    };
  }, [setShake]);

  return (
    <footer className="footer">
      <div className="social-react">
        <img
          ref={image}
          alt="heart like"
          className={classList({
            liked: liked,
            unliked: !liked,
            shakeMe: liked ? false : shake
          })}
          onClick={onLike}
          src={liked ? fillHeart : emptyHeart}
        />
        <span>{likes ? likes : null}</span>
      </div>
      <div className="social-share">
        <div className="line"></div>
        <span>Share article</span>
        <div className="links">
          <div
            onClick={() => shareOntwitter({ title, url })}
            aria-label="twitter"
            role="button"
            tabIndex="0"
          >
            Twitter
          </div>
          <div
            onClick={() => shareOnFB({ title, url })}
            aria-label="facebook"
            role="button"
            tabIndex="0"
          >
            Facebook
          </div>
        </div>
      </div>
    </footer>
  );
}

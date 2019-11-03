import React from 'react';

function shareOnFB({ title, url }) {
  const fullUrl = encodeURI(`https://tusharsharma.dev${url}`);
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}&t=${title}`;
  window.open(
    fbUrl,
    'FacebookWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=500,height=500'
  );
  return false;
}

function shareOntwitter({ title, url }) {
  const fullUrl = encodeURI(`https://tusharsharma.dev${url}`);
  const tweetUrl = `https://twitter.com/intent/tweet?url=${fullUrl}&via=tusharf5&text=${title}`;
  window.open(
    tweetUrl,
    'TwitterWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=500,height=500'
  );
  return false;
}

export default function PostFooter({ title, url }) {
  return (
    <footer className='footer'>
      <div className='line'></div>
      <span>Share article</span>
      <div className='links'>
        <div
          onClick={() => shareOntwitter({ title, url })}
          aria-label='twitter'
          role='button'
          tabIndex='0'>
          Twitter
        </div>
        <div
          onClick={() => shareOnFB({ title, url })}
          aria-label='facebook'
          role='button'
          tabIndex='0'>
          Facebook
        </div>
      </div>
    </footer>
  );
}

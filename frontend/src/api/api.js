const subscribe = async (subToID) => {
  const res = await fetch(`/api/account/subscribe/${subToID}`);
  return res;
};

const unsubscribe = async (unsubID) => {
  const res = await fetch(`/api/account/unsubscribe/${unsubID}`);
  return res;
};

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const fetchVideo = async (query) => {
  const csrftoken = getCookie('csrftoken')

  const res = await fetch(`/api/video/get/${query}`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
      },
  })
  if (res.status == 200) {
    const data = await res.json()
    return data
  } else if (res.status == 404) {
    return 404
  }
}

export { subscribe, unsubscribe, fetchVideo, getCookie };
const subscribe = async (subToID) => {
  const res = await fetch(`/api/account/subscribe/${subToID}`);
  return res;
};

const unsubscribe = async (unsubID) => {
  const res = await fetch(`/api/account/unsubscribe/${unsubID}`);
  return res;
};

export { subscribe, unsubscribe };
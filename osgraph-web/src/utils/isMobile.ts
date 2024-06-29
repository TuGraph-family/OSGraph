export const getIsMobile = () => {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return flag;
};

export const isIOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /(iphone|ipad|ipod|ios)/i.test(userAgent);
};

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += " " + className;
};

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
};

// 动态修改当前浏览器的BOM-title
export const updateTitle = (title: string) => {
  document.title = title;
};

// 动态修改当前浏览器的BOM-icon
export const updateIcon = (href: string = "") => {
  const el = document.createElement("link");
  if (!el) return;
  el.setAttribute("type", "image/x-icon");
  el.setAttribute("rel", "shortcut icon");
  el.setAttribute("href", href || "./favicon.ico");
  document.getElementsByTagName("head")[0].appendChild(el);
};

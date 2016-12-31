export const $$ = (selector, context = document) => {
  const elements = context.querySelectorAll(selector);
  return Array.prototype.slice.call(elements);
};

export const $ = (selector, context = document) => {
  const element = context.querySelector(selector);
  return element;
};

export const exists = obj =>
  Boolean(obj) && (obj !== null && obj !== undefined && obj !== '');

export const isArray = obj =>
  exists(obj) && Array.isArray(obj);

export const isObject = obj =>
  exists(obj) && typeof obj === 'object';

export const defer = (func, time = 0) => {
  return setTimeout(() => func(), time);
};

export const send = (url, method, data) => {
  const xhr = new window.XMLHttpRequest();
  const _e = encodeURIComponent;
  const isFormData = data instanceof window.FormData;
  let dataPairs = [];

  if (typeof data === 'object' && !isFormData) {
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        dataPairs.push(_e(key) + '=' + _e(data[key]));
      }
    }
    data = dataPairs.join('&').replace(/%20/g, '+');
  }

  const promise = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      }
    };
  });

  xhr.open(method, url);

  if (!isFormData) {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  xhr.send(data);

  return promise;
};

export const getOffset = el => {
  var rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
};

export const cloneObj = obj => {
  return Object.assign({}, obj);
};

// used instead of a shim for classList.[add/remove]([,classString])
// the shim seemed overly complicated
export const applyEach = (obj, method, arr) => {
  arr.forEach(el => {
    obj[method](el);
  });
};

export const post = (url, data) => send(url, 'POST', data);
export const get = (url, data) => send(url, 'GET', data);

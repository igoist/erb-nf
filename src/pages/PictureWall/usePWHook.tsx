import * as React from 'react';
import { useRequest } from 'ahooks';

const { useState, useEffect } = React;

const baseUrl = 'http://localhost:6085';

const transformResult = (l: any) => {
  for (let i = 0; i < l.length; i++) {
    l[i].currentIndex = i;
    l[i].colored = `${l[i].path}`;
  }
  return l;
};

const ff = (url: string) => {
  console.log('ff: ', url);
  return fetch(url)
    .then((res: any) => res.json())
    .then((r: any) => {
      if (r.Code === 0) {
        return r.list;
      } else {
        return [];
      }
    })
    .catch((e) => {
      console.log('ff error: ', e);
      return [];
    });
};

// '/Users/Egoist/Documents/Pictures/素材/gif'
const handleRequest = (path = '') => {
  return new Promise(async (resolve) => {
    console.log('here is ', path);
    if (path === '') {
      resolve([]);
      return;
    }
    let formData = new FormData();
    formData.append('path', path + '/');

    let r;

    try {
      r = await fetch(`${baseUrl}/api/v1/file`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'text/html; charset=UTF-8'
        // },
        body: formData
      })
        .then((res: any) => res.json())
        .then((r: any) => {
          if (r.Code === 0) {
            return r.list;
          } else {
            return [];
          }
        })
        .catch((e) => {
          console.log('ff error: ', e);
          return [];
        });
    } catch (err) {
      console.log('PictureWall request err', err);
    }

    resolve(transformResult(r));
  });
};

const usePWHook = () => {
  const [path, setPath] = useState('');
  // const [result, setResult] = useState([]);

  const { data, error, loading, run } = useRequest(handleRequest);

  useEffect(() => {
    run(path);
  }, [path]);

  return {
    path,
    loading,
    data,
    setPath
  };
};

export default usePWHook;

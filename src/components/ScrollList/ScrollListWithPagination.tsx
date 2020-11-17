import * as React from 'react';

import ScrollListWithKeyBoard from './ScrollListWithKeyBoard';

const { useEffect, useState } = React;

const ScrollListWithPagination = (props: any) => {
  const [page, setPage] = useState(1);
  const [initFlag, setInitFlag] = useState(true);

  useEffect(() => {
    console.log('current page: ', page);
    if (page === 1 && initFlag) {
      setInitFlag(false);
    } else {
      props.toPage(page);
    }
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      console.log(`${e.keyCode} == ${e.ctrlKey}`);
      if (e.keyCode === 78 && e.ctrlKey) {
        setPage(page + 1);
      }

      if (e.keyCode === 80 && e.ctrlKey) {
        setPage(page > 1 ? page - 1 : 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return <ScrollListWithKeyBoard {...props} />;
};

export default ScrollListWithPagination;

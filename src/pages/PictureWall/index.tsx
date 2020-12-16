import * as React from 'react';
import { ScrollList } from '@Components';
import { Button, Image, Upload } from 'antd';
import 'antd/dist/antd.css';
import 'antd/dist/antd.dark.css';
import { SearchResultProps } from '@Types';
import usePWHook from './usePWHook';

const { useState, useEffect, useRef } = React;

const { ScrollListWithKeyBoard } = ScrollList;

const PW = () => {
  const [fileList, setFileList] = useState([]);
  const inputRef = useRef();
  const { path, loading, data, setPath } = usePWHook();

  useEffect(() => {
    const tmpI: any = inputRef.current;
    console.log('==', tmpI);

    tmpI.setAttribute('webkitdirectory', '');
    tmpI.setAttribute('directory', '');
    tmpI.setAttribute('multiple', '');
  }, []);

  const handleChange = (info: any) => {
    console.log('handleChange', info);
    // console.log('handleChange', info.fileList[0].originFileObj.path);
    console.log('handleChange', info.target.files[0]);
    if (info.target.files[0]) {
      setPath(info.target.files[0].path);
    }
    return;
    let tmpFileList = [...info.fileList];

    // 2. Read from response and show file link
    tmpFileList = tmpFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(tmpFileList);
  };

  const props = {
    // action: 'http://localhost:6085/api/v1/file',
    fileList,
    directory: true,
    multiple: true,
    onChange: handleChange,
    // ref: inputRef
  };

  console.log('hereda: ', data);

  const tmpP: SearchResultProps = {
    arr: data as Array<any>,
    tagH: 10
  }

  const T = (loading: boolean) => {
    if (loading) {
      return <div>loading!</div>;
    } else {
      return <ScrollListWithKeyBoard {...tmpP} />;
    }
  };

  if (path === '') {
    return (
      <div className='pages-pw-wrap'>
        {/* <Image width={200} src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' /> */}

        {/* <Upload {...props}>
          <Button>Upload</Button>
        </Upload> */}

        <input type='file' name='xx' ref={inputRef} onChange={handleChange} />
      </div>
    );
  } else {
    return T(loading);
  }
};

export default PW;

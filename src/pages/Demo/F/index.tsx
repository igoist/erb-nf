import * as React from 'react';

const { useState, useEffect, useRef } = React;

const F = () => {
  const [fileList, setFileList] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const tmpI: any = inputRef.current;

    // tmpI.setAttribute('webkitdirectory', '');
    // tmpI.setAttribute('directory', '');
    tmpI.setAttribute('multiple', '');
  }, []);

  const handleChange = (info: any) => {
    console.log('handleChange', info);
    // console.log('handleChange', info.fileList[0].originFileObj.path);
    // console.log('handleChange', info.target.files[0]);
    // if (info.target.files[0]) {
    //   console.log(info.target.files[0].path);
    // }
    // if (info.target.files) {
    //   console.log(info.target.files);
    // }
    // return;

    let tmpFileList = [...info.fileList];

    // 2. Read from response and show file link
    // tmpFileList = tmpFileList.map((file) => {
    //   if (file.response) {
    //     // Component will show file.url as link
    //     file.url = file.response.url;
    //   }
    //   return file;
    // });

    setFileList(tmpFileList);
  };

  const handleSubmit = () => {
    console.log(`fileList: `, fileList);
  };

  return (
    <div>
      <div>FFFFFFFFF</div>

      <input type='file' name='xx' ref={inputRef} onChange={handleChange} />

      <div onClick={handleSubmit}>Button</div>
    </div>
  );
};

export default F;

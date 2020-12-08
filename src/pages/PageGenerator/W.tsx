import * as React from 'react';

/**
 * 所有元素最后渲染出来都会附带 position: absolute 属性，所以...
 *
 * 属性带 px 的都以 number 表示
 */

const pxArr = ['width', 'height', 'top', 'right', 'bottom', 'left'];

const handleStyle = (style: any) => {
  let newStyle: any = {};
  for (let i in style) {
    if (pxArr.indexOf(i) !== -1) {
      newStyle[i] = style[i] + 'px';
    } else {
      newStyle[i] = style[i];
    }
  }

  return newStyle;
};

const ElementGenerator = (props: any) => {
  const { prefix, id, type, style, selected, onClick, text } = props;

  let wStyle: any = {};

  if (style.top !== undefined) {
    wStyle.top = `${style.top - 10}px`;
  }

  if (style.right !== undefined) {
    wStyle.right = `${style.right - 10}px`;
  }

  if (style.bottom !== undefined) {
    wStyle.bottom = `${style.bottom - 10}px`;
  }

  if (style.left !== undefined) {
    wStyle.left = `${style.left - 10}px`;
  }

  if (selected) {
    wStyle.borderColor = '#ff00ff';
  }

  // console.log('herhe: ', wStyle, style, refHook);

  if (type === 'div') {
    return (
      <div className={`${prefix}-w`} style={wStyle} onClick={onClick} data-id={id}>
        <div className={`${prefix}-div`} style={handleStyle(style)}>
          {text}
        </div>
      </div>
    );
  }
};

const W = (props: any) => {
  const { prefix } = props;
  const { data, id, refBody, dispatch } = props;

  const handleItemClick = (id: number) => {
    dispatch({
      type: 'ItemSelected',
      payload: {
        id
      }
    });
  };

  const renderData = () =>
    data.map((item: any) => {
      if (item.type === 'div') {
        const props = {
          prefix,
          ...item,
          selected: item.id === id,
          text: item.style.text,
          onClick: () => handleItemClick(item.id)
        };
        return <ElementGenerator {...props} />;
      }
    });

  return (
    <div className={`${prefix}-main`} ref={refBody}>
      <div className='xx'>XXX</div>
      <div className={`${prefix}-w`}>
        <div className={`${prefix}-div`}></div>
      </div>

      {renderData()}
    </div>
  );
};

export default W;

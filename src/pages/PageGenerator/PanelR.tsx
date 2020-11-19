import * as React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

// const Editable = (props: any) => {
//   const { field, style } = props;
//   return (
//     <div>
//       {field}: {style[field]}
//     </div>
//   );
// };

const PanelR = (props: any) => {
  const { prefix } = props;
  const { data, id, dispatch } = props;

  // const renderField = (style: any) => {
  //   let tmp: any = [];
  //   for (let i in style) {
  //     tmp.push(<Editable field={i} style={style} />);
  //   }

  //   return tmp;
  // };

  const returnHandleValueChange = (field: string, fT: any) => {
    return (e: any) => {
      let v = e.target.value;

      // how to validate
      if (fT === 'number') {
        v = parseInt(v);
      }

      if (typeof v === fT) {
        dispatch({
          type: 'ItemUpdate',
          payload: {
            field,
            value: v
          }
        });
      }
    };
  };

  const renderForm = (style: any) => {
    let tmp: any = [];
    for (let i in style) {
      tmp.push(
        <Form.Item label={i} name={i}>
          <Input style={{ width: '80px' }} onChange={returnHandleValueChange(i, typeof style[i])} />
        </Form.Item>
      );
    }

    return tmp;
  };

  const renderSelect = () => {
    let tmp = [];
    for (let i = 0; i < data.length; i++) {
      tmp.push(
        <Option value={data[i].id}>
          {data[i].id}: {data[i].type}
        </Option>
      );
    }

    return tmp;
  };

  const handleItemSelect = (v: any) => {
    dispatch({
      type: 'ItemSelected',
      payload: {
        id: v === undefined ? -1 : v
      }
    });
  };

  const renderData = () => {
    if (id !== -1) {
      const item: any = data[id];
      return (
        <>
          <div>id: {id}</div>
          <div>type: {item.type}</div>
          {/* {renderField(item.style)} */}
          <Form initialValues={item.style}>{renderForm(item.style)}</Form>
        </>
      );
    } else {
      return (
        <Select placeholder='Select the item' onChange={handleItemSelect} allowClear>
          {renderSelect()}
        </Select>
      );
    }
  };

  return <div className={`${prefix}-panel-r`}>{renderData()}</div>;
};

export default PanelR;

import useModelVisible from '../useModelVisible';
import { returnItemStruct } from '../struct';

const api = '/api/v1/item/';

export default () => {
  const { visible: visibleFormAddItem, closeModel: closeFormAddItem, openModel: openFormAddItem } = useModelVisible();

  const onFormAddItemFinish = async (values: any) => {
    closeFormAddItem();

    console.log('onFormAddItemFinish: ', values);

    let r = await fetch(`http://localhost:6085${api}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => res);

    console.log('onFormAddItemFinish msg: ', r);
  };

  const addItemFields = returnItemStruct();

  return {
    addItemFields,
    visibleFormAddItem,
    closeFormAddItem,
    openFormAddItem,
    onFormAddItemFinish,
  };
};

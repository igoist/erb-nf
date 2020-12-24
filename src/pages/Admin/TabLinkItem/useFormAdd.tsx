import useModelVisible from '../useModelVisible';
import { returnItemStruct } from '../struct';

const api = '/api/v1/item/';

export default () => {
  const { visible: visibleFormAddItemType, closeModel: closeFormAddItemType, openModel: openFormAddItemType } = useModelVisible();

  const onFormAddItemTypeFinish = async (values: any) => {
    closeFormAddItemType();

    console.log('onFormAddItemTypeFinish: ', values);

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

    console.log('onFormAddItemTypeFinish msg: ', r);
  };

  const addItemTypeFields = returnItemStruct();

  return {
    addItemTypeFields,
    visibleFormAddItemType,
    closeFormAddItemType,
    openFormAddItemType,
    onFormAddItemTypeFinish,
  };
};

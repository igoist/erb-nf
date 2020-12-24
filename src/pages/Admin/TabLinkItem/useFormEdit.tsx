import * as React from 'react';
import useModelVisible from '../useModelVisible';
import { returnItemStruct } from '../struct';

const { useState } = React;

const api = '/api/v1/item/';

export default () => {
  const [initialValues, setInitialValues] = useState(null);
  const { visible: visibleFormEditItem, closeModel: closeFormEditItem, openModel } = useModelVisible();

  const openFormEditItem = (item: any) => {
    console.log('openFormEditItem: ', item);

    setInitialValues(item);

    openModel();
  };

  const onFormEditItemFinish = async (values: any) => {
    closeFormEditItem();

    console.log('onFormEditItemFinish: ', values);

    let id = values.id;

    delete values.id;

    let r = await fetch(`http://localhost:6085${api}${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => res);

    console.log('onFormEditItemFinish msg: ', r);
  };

  return {
    editItemFields: returnItemStruct(true),
    visibleFormEditItem,
    initialValuesFormEdit: initialValues,
    closeFormEditItem,
    openFormEditItem,
    onFormEditItemFinish,
  };
};

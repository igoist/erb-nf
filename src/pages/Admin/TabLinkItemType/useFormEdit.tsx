import * as React from 'react';
import useModelVisible from '../useModelVisible';
import { returnItemTypeStruct } from '../struct';

const { useState } = React;

const api = '/api/v1/item/type/';

export default () => {
  const [initialValues, setInitialValues] = useState(null);
  const { visible: visibleFormEditItemType, closeModel: closeFormEditItemType, openModel } = useModelVisible();

  const openFormEditItemType = (item: any) => {
    console.log('openFormEditItemType: ', item);

    setInitialValues(item);

    openModel();
  };

  const onFormEditItemTypeFinish = async (values: any) => {
    closeFormEditItemType();

    console.log('onFormEditItemTypeFinish: ', values);

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

    console.log('onFormEditItemTypeFinish msg: ', r);
  };

  return {
    editItemTypeFields: returnItemTypeStruct(true),
    visibleFormEditItemType,
    initialValuesFormEdit: initialValues,
    closeFormEditItemType,
    openFormEditItemType,
    onFormEditItemTypeFinish,
  };
};

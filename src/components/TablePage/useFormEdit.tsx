import * as React from 'react';
import { useModelVisible } from '@Hooks';

import { UseFormEditProps } from '@Types';

const { useState } = React;

export default ({ api, fieldsStruct }: UseFormEditProps) => {
  const [initialValues, setInitialValues] = useState(null);
  const { visible: visibleFormEdit, closeModel: closeFormEdit, openModel } = useModelVisible();

  const openFormEdit = (item: any) => {
    console.log('openFormEdit: ', item);

    setInitialValues(item);

    openModel();
  };

  const onFormEditFinish = async (values: any) => {
    closeFormEdit();

    console.log('onFormEditFinish: ', values);

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

    console.log('onFormEditFinish msg: ', r);
  };

  return {
    editFields: fieldsStruct, // returnItemTypeStruct(true),
    visibleFormEdit,
    initialValuesFormEdit: initialValues,
    closeFormEdit,
    openFormEdit,
    onFormEditFinish,
  };
};

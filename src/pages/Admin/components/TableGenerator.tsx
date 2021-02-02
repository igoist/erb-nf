import * as React from 'react';
import { Button, Card, Col, Form, Input, Row, Table, Select } from 'antd';
import { useAntdTable } from 'ahooks';

const returnGetTableData = (api: any, dataFetch: any, handleRes: any) => {
  return ({ current, pageSize }: any, formData: any) => {
    let query = `page=${current}&limit=${pageSize}`;
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        query += `&${key}=${value}`;
      }
    });

    console.log('queryx: ', query);

    if (dataFetch) {
      return dataFetch();
    }

    return fetch(`http://localhost:6085${api}?${query}`)
      .then((res) => res.json())
      .then((res) => ({
        total: res.list.length,
        list: res.list,
      }));
  };
};

type tablePropsType = {
  handleAddBtnClick?: any,
};

const TableGenerator = (config: any) => {
  const { columns, api, tableRowKey, addBtn, withSearch, dataFetch, handleRes } = config;

  console.log('enter TableGenerator, think about when and why?', handleRes);

  return ({ handleAddBtnClick }: tablePropsType) => {
    const [form] = Form.useForm();

    // 这个 refresh ahooks 里根本查不到, umi hooks
    const { tableProps, refresh, search } = useAntdTable(returnGetTableData(api, dataFetch, handleRes), {
      defaultPageSize: 10,
      form,
    });

    const { type, changeType, submit, reset } = search;

    const tmpArr = columns.map((item: any) => {
      if (item.supportSearch) {
        return (
          <Col key={'col-' + (item.dataIndex || item.key)} span={8}>
            <Form.Item label={item.title} name={item.dataIndex}>
              <Input placeholder={item.title} />
            </Form.Item>
          </Col>
        );
      } else {
        return null;
      }
    });

    const BtnRow = () => {
      if (withSearch || addBtn) {
        return (
          <Form.Item style={{ marginBottom: '0', width: '100%' }}>
            {withSearch && (
              <>
                <Button type='primary' style={{ float: 'right', marginLeft: 16 }} onClick={submit}>
                  查询
                </Button>
                <Button onClick={reset} style={{ float: 'right' }}>
                  重置
                </Button>
              </>
            )}
            {addBtn && <Button onClick={handleAddBtnClick}>{addBtn.name}</Button>}
          </Form.Item>
        );
      } else {
        return null;
      }
    };

    const gutterLength = tmpArr.filter((item: any) => item !== null).length;
    // const asfMarginBottom = gutterLength > 0 && (withSearch || addBtn) ? 24 : 0;
    const asfMarginBottom = 0;

    const advanceSearchForm = (
      <Card bordered={false} style={{ margin: '12px 0' }}>
        <Form form={form}>
          <Row gutter={[12, asfMarginBottom]}>{tmpArr}</Row>
          <BtnRow />
        </Form>
      </Card>
    );

    const searchForm = (
      <div style={{ marginBottom: 16 }}>
        <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <Form.Item name="gender">
            <Select style={{ width: 120, marginRight: 16 }} onChange={submit}>
              <Option value="">all</Option>
              <Option value="male">male</Option>
              <Option value="female">female</Option>
            </Select>
          </Form.Item> */}
          <Form.Item name='name'>
            <Input.Search placeholder='enter name' style={{ width: 240 }} onSearch={submit} />
          </Form.Item>
          <Button type='link' onClick={changeType}>
            Advanced Search
          </Button>
        </Form>
      </div>
    );

    return {
      fns: {
        refresh: () => refresh(),
      },
      component: () => (
        <div>
          {/* {type === 'simple' ? searchForm : advanceSearchForm} */}
          {advanceSearchForm}
          <Card bordered={false} style={{ marginBottom: '12px' }}>
            <Table columns={columns} rowKey={tableRowKey} {...tableProps} />
          </Card>
        </div>
      ),
    };
  };
};

export { returnGetTableData, TableGenerator };

export default TableGenerator;

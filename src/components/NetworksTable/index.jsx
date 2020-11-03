import React, { useState } from 'react'
import { Button, Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import './style.scss';

const NetworksTable = (props) => {
  const [searchCol, setSearchCol] = useState('')

  const {
    networks
  } = props

  const getSearchColValues = (searchColValues) => {
    let searchValue = searchColValues
    if (Array.isArray(searchColValues)) {
      searchValue = searchColValues.join(', ')
    }
    if (typeof searchValue === 'string') {
      return searchValue.toLowerCase()
    }
    return ''
  }

  const handleSearch = (confirm, dataIndex) => {
    confirm();
    setSearchCol(dataIndex)
  }


  const getColumnSearchProps = (dataIndex, description) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${description}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      const searchColValues = getSearchColValues(record[dataIndex])
      return searchColValues.includes(value.toLowerCase())
    },
    render: text => searchCol === dataIndex && text
  })

  const tableColumns = [
    {
      title: 'Organization',
      width: '10vw',
      fixed: 'left',
      dataIndex: 'title',
      key: 'title',
      sorter: (a,b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title', 'organizations'),
      render: text => text,
    },
    {
      title: 'City',
      width: '7vw',
      dataIndex: 'city',
      key: 'city',
      sorter: (a,b) => a.city.localeCompare(b.city),
      ...getColumnSearchProps('city', 'cities'),
      render: text => text,
    },
    {
      title: 'State',
      width: '5vw',
      dataIndex: 'state',
      key: 'state',
      sorter: (a,b) => a.state.localeCompare(b.state),
      defaultSortOrder: 'ascend',
      ...getColumnSearchProps('state', 'states'),
      render: text => text,
    },
    {
      title: 'Communities',
      width: '10vw',
      dataIndex: 'community',
      key: 'community',
      sorter: (a,b) => a.community.localeCompare(b.community),
      ...getColumnSearchProps('community', 'communities'),
      render: text => text,
    },
    {
      title: 'Languages',
      width: '10vw',
      dataIndex: 'language',
      key: 'language',
      sorter: (a,b) => {
        // When no languages are included, we get an empty object rather than an empty array.
        // This checks for those circumstances and ensures the languages still sort as expected.
        if (a.language[0] && b.language[0]) {
          return a.language.join().localeCompare(b.language.join())
        }
        if (a.language[0]) return -1
        if (b.language[0]) return 1
        return 0
      },
      ...getColumnSearchProps('language', 'languages'),
      render: languages => languages.length && languages.sort().join(', ')
    },
    {
      title: 'Get Involved',
      width: '10vw',
      dataIndex: 'forms',
      filters: [
        { text: 'General', value: 'generalForm'},
        { text: 'Offer Support', value: 'supportOfferForm' },
        { text: 'Request Support', value: 'supportRequestForm' },
        { text: 'Community', value: 'facebookPage' },
      ],
      onFilter: (value, record) => record[value],
      key: 'forms',
      render: (text, record) => (
        <ul key="resources" className='resources'>
          {record.generalForm && <li key={`${record.generalForm}-general`} className="form-link"><Button ghost href={record.generalForm} target='blank' className='general'>General</Button></li>}
          {record.supportOfferForm && <li key={`${record.supportOfferForm}-offer`} className="form-link"><Button ghost href={record.supportOfferForm} target='blank' className='offer'>Offer Support</Button></li>}
          {record.supportRequestForm && <li key={`${record.supportRequestForm}-request`} className="form-link"><Button ghost href={record.supportRequestForm} target='blank' className='request'>Request Support</Button></li>}
          {record.facebookPage && <li key={`${record.facebookPage}-facebook`} className="form-link"><Button ghost href={record.facebookPage} target='blank' className='other'>Community</Button></li>}
        </ul>
      )
    },
  ]

  return (
    <>
      <Table
        rowKey={network => network.id}
        columns={tableColumns}
        dataSource={networks}
        pagination={{pageSize: 10, hideOnSinglePage: true}}
        scroll={{x: 1080}}
        size='small'
        locale={{filterConfirm: 'Filter'}}
      />
    </>
  )
}

export default NetworksTable
import React from 'react';
import './_style.scss';
import { Menu, Dropdown, Button, Input, DatePicker, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { DEFAULT_DATE_FORMAT } from '../../../utils/constants';
import ButtonPrimary from '../../atoms/ButtonPrimary/button-primary';

const TableFilters = ({ onApplyFilter, filters, defaultFilters, onSearch }) => {
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  const onInputChange = ev => {
    let key = ev.target.id;
    let newFilter = { ...activeFilters, [key]: ev.target.value };

    clearEmptyFilter(key, newFilter);
    filter(newFilter);
  };

  const clearEmptyFilter = (key, obj) => {
    if (!obj[key] || obj[key] === 'none') {
      delete obj[key];
    }
  };

  const onDateChange = (date, key) => {
    let newFilter = { ...activeFilters };

    if (!date) {
      delete newFilter[key];
    } else {
      newFilter[key] = date.format('YYYY-MM-DD'); // backend format
    }

    filter(newFilter);
  };

  const onDropdownChange = value => {
    let key = value.item.props.id;
    let newFilter = { ...activeFilters, [key]: value.key };
    clearEmptyFilter(key, newFilter);
    filter(newFilter);
  };

  const filter = filter => {
    setActiveFilters(filter);
    onApplyFilter(filter);
  };

  const renderInput = key => {
    return (
      <Input
        onChange={onInputChange}
        id={key}
        key={key}
        placeholder={filters[key].name}
        suffix={<UserOutlined />}
      />
    );
  };

  const renderDate = key => {
    return (
      <DatePicker
        locale="es"
        key={key}
        format={DEFAULT_DATE_FORMAT}
        onChange={date => onDateChange(date, key)}
        placeholder={filters[key].name}
      />
    );
  };

  const renderDropdown = (key, values) => {
    const menu = (
      <Menu onClick={onDropdownChange}>
        <Menu.Item id={key} key={'none'}>
          Ninguno
        </Menu.Item>
        {values.map(v => (
          <Menu.Item id={key} key={v}>
            {v}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} key={key}>
        <Button>
          {activeFilters[key] ? activeFilters[key] : filters[key].name} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  const renderFilters = () => {
    let filterComps = [];
    Object.keys(filters).forEach(key => {
      switch (filters[key].type) {
        case 'input':
          filterComps.push(renderInput(key));
          break;
        case 'date':
          filterComps.push(renderDate(key));
          break;
        case 'dropdown':
          filterComps.push(renderDropdown(key, filters[key].data));
          break;
      }
    });
    return filterComps;
  };

  return (
    <div className="TableFilters">
      {renderFilters()} <ButtonPrimary text="Buscar" theme="primary" onClick={onSearch} />
    </div>
  );
};

export default TableFilters;

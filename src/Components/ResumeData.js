//BELOW CODE IS MADE TO TEST WE SHOULD PUT API KEY AND API ENDPOINTS SEPARATELY IN GLOBAL
//USE CODIUMAI EXTESNION FOR CODE EXPLAINATION


import React, { useEffect, useState } from 'react';
import { Table, Tag, Input } from 'antd';
import './ResumeData.css';

const { Search } = Input;

const ResumeData = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ResumeData/get');
        const jsonData = await response.json();

        const columnNames = Object.keys(jsonData[0]);

        const dynamicColumns = columnNames
          .filter((columnName) => columnName !== '__v')
          .map((columnName) => {
            if (columnName === 'skills') {
              return {
                title: columnName,
                dataIndex: columnName,
                key: columnName,
                render: (text) => (
                  <span>
                    {text.map((skill, index) => (
                      <Tag key={index} style={{ marginRight: '5px' }}>
                        {skill}
                      </Tag>
                    ))}
                  </span>
                ),
              };
            } else {
              return {
                title: columnName,
                dataIndex: columnName,
                key: columnName,
              };
            }
          });

        const dataWithKeys = jsonData.map((data, index) => ({
          ...data,
          key: index,
        }));

        setColumns(dynamicColumns);
        setOriginalData(dataWithKeys);
        setFilteredData(dataWithKeys);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchQuery) => {
    const searchWords = searchQuery.toLowerCase().split(' ');

    const filteredResults = originalData.filter((data) => {
      const skills = data.skills.map((skill) => skill.toLowerCase());

      return searchWords.every((word) => skills.some((skill) => skill.includes(word)));
    });

    setFilteredData(filteredResults);
  };


  return (
    <div className="main_container">
      <Search
        placeholder="Search by skills"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        style={{ width: '30%' }} 
      />
      <div className="resumeData_container">
        <div className="resumeData_table">
          <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
        </div>
      </div>
    </div>
  );
};

export default ResumeData;

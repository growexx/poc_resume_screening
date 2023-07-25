//BELOW CODE IS MADE TO TEST WE SHOULD PUT API KEY AND API ENDPOINTS SEPARATELY IN GLOBAL


import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Title, Typography } from 'antd';
import "./FileUpload.css"
import { Link } from 'react-router-dom';


function FileUpload() {
  const { Title } = Typography;
  const [extractedText, setExtractedText] = useState('');
  const [chatGptResponse, setChatGptResponse] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isConverted, setisConverted] = useState(false);


  const inpFileRef = useRef(null);
  const API_KEY = 'ENTER OPEN_AI API KEY';

  useEffect(() => {
    if (chatGptResponse) {
      sendChatGptResponse();
    }
  }, [chatGptResponse]);


  const convertToChatGptResponse = async () => {
    try {
      //MAKE CHANGES IN PROMPT ACCORDINGLY
      const completePrompt = `${extractedText.trim()}\nGive me name email contact skills and experience in number from above text.`;
      const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt: completePrompt,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const chatGptResponse = data.choices[0].text.trim();
        setChatGptResponse(chatGptResponse);
        setisConverted(true);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const sendChatGptResponse = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/process-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatGptResponse }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const extractData = (text) => {
    const nameRegex = /Name:\s*(.*)/;
    const emailRegex = /Email:\s*(.*)/;
    const phoneNumberRegex = /Contact:\s*(.*)/;
    const skillsRegex = /Skills:\s*(.*)/;
    const experienceRegex = /Experience:\s*(.*)/;

    const nameMatch = text.match(nameRegex);
    const emailMatch = text.match(emailRegex);
    const phoneNumberMatch = text.match(phoneNumberRegex);
    const skillsMatch = text.match(skillsRegex);
    const experienceMatch = text.match(experienceRegex);

    const jsonData = {
      name: nameMatch ? nameMatch[1].trim() : '',
      email: emailMatch ? emailMatch[1].trim() : '',
      contact: phoneNumberMatch ? phoneNumberMatch[1].trim() : '',
      skills: skillsMatch ? skillsMatch[1].trim().split(',') : [],
      experience: experienceMatch ? experienceMatch[1].trim() : '',
    };

    return jsonData;
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', inpFileRef.current.files[0]);

      const response = await fetch('http://localhost:3001/api/extract-text', {
        method: 'post',
        body: formData,
      });

      if (response.ok) {
        const extractedText = await response.text();
        setExtractedText(extractedText.trim());
        setIsUploaded(true);
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };






  useEffect(() => {
    const extractedData = extractData(chatGptResponse);
    const data = [extractedData];
    setDataSource(data);
  }, [chatGptResponse]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <span>
          {skills.map((skill, index) => (
            <span key={index} style={{ marginRight: '5px', display: 'inline-block', padding: '5px', border: '1px solid #ccc' }}>
              {skill}
            </span>
          ))}
        </span>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
  ];


  return (
    <div className='div_container'>
      <Title level={3}> Click here to find all Resume Data</Title>
      <div>
        <Link to='/result'>
        <Button type="primary">ResumeData</Button>
        </Link>
      </div>
      <div className='container'>
      <Title level={3}>Upload your Resume To Parse</Title>

        <div className='InputFiles' style={{ margin: "20px" }}>

          <input type="file" ref={inpFileRef} />

          <div className='div_buttons'>
            <Button
              type="primary"
              onClick={handleUpload}
              className={isUploaded ? 'uploaded-button' : ''}
              disabled={isUploaded}
            >
              {isUploaded ? '✓ Uploaded' : 'Upload'}
            </Button>
            <Button
              type="primary"
              onClick={convertToChatGptResponse}
              className={isConverted ? 'converted-button' : ''}
              disabled={isConverted}
            >
              {isConverted ? '✓responseGenerated' : 'Response'}
            </Button>
          </div>



        </div>
        <div className='parsedresult'>
          {chatGptResponse && (
            <div >
              <Table columns={columns} dataSource={dataSource} pagination={false} />
            </div>
          )}
        </div>

      </div>

      <div>




      </div>


    </div>

  );
}

export default FileUpload;
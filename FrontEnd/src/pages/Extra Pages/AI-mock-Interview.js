import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardText, Button, Progress } from 'reactstrap';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Knob from 'pages/AllCharts/knob/knob';
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux"
import { useUser } from 'Authenticator/Usercontext';
import { useNavigate } from 'react-router-dom';
const ResumeParser = (props) => {
  const {user}=useUser();
  const navigator=useNavigate();
  const [Testcount,setTestCount]=useState({
    'userId':'',
    'TestType':''
  })
  // console.log(user);
  useEffect(() => {
    if(user)
    setTestCount({
      'userId':user._id,
      'TestType':'AI'
    })
  }, [user]);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState({
    'ApplicantName': '',
    'JobSkills': '',
    'JobRole': '',
  });
  const [isparsed,setParsed]=useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition({
    // Set recognition options here
    recognitionOptions: {
      continuous: true, // Set to true for continuous recognition
      interimResults: true, // Set to true to receive interim results while speaking
      timeout: 40000, // Adjust the timeout value to your desired duration (e.g., 10 seconds)
    },
  });
  const [Listening, setListeningStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formprogress,setUploadProgress]=useState(null);
  const [waitingForquestions,setwaitingquestions]=useState(false);
  const [questionprogress,setquestionprogress]=useState(null);
  // const [Transcript, setTranscript] = useState('');
  const [positiveScore,setPositiveScore]=useState(null);
  const [negativeScore,setnegativeScore]=useState(0);
  const [neutralScore,setneutralScore]=useState(0);
  const [value_cur,setvalue_cur]=useState(0);
  const [showChart, setShowChart] = useState(false);
  const [Index,SetIndex]=useState(null)
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(false));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
    const breadcrumbItems = [
      { title: "SpeakEZ", link: "#" },
      { title: "AI Interview", link: "#" },
      { title: "Resume ", link: "#" },
  ]

  useEffect(() => {
      props.setBreadcrumbItems('AI Interview', breadcrumbItems)
  })
  const handleSubmit = async () => {
    if(file===null){
      alert("please upload the file");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:4000/ai/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        }
      });

      const { ApplicantName } = response.data;
      // console.log(response.data);
      setParsedData({
        'ApplicantName': `${ApplicantName.first} ${ApplicantName.middle} ${ApplicantName.last}`,
        'JobRole': response.data.CurrentJobRole,
        'JobSkills': response.data.Skills
      });
      if (response.data){
        setParsed(true);
        // console.log(parsedData);
      } 
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  const getQuestion = async () => {
    if(file===null)
      {
        alert("upload a file");
      }
      else
      {
    const questionsArray = [];
    try {
      while(questionsArray.length===0)
      {
      // console.log(parsedData);
      const response = await axios.post(`http://localhost:4000/ai/getquestions`, parsedData,{
        onUploadProgress: progressEvent => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setquestionprogress(progress)
        }
      });

      const questionRegex = /\*\*Question \d+:(.*?)(?=\n\*\*Question|$)/gs;
      let match;
      while ((match = questionRegex.exec(response.data.msg)) !== null) {
        questionsArray.push(match[1].trim());
      }
      // console.log(response.data.msg);
      setQuestions(questionsArray);
      setListeningStates(new Array(questionsArray.length).fill(false))
      setSubmittedAnswers(Array(questionsArray.length).fill(false));
      setAnswers(new Array(questionsArray.length).fill('')); // Initialize answers array
      if(questionsArray.length>0){
        // console.log(questionsArray)
        setwaitingquestions(false)
      }
    }
   } catch (err) {
      console.log(err);
    }
  }
  };
  const handleChangecursor = newValue => {
    setvalue_cur(newValue)
  }
  const handleAnswerChange = (index,answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };
  const Update_Test_Count=async()=>{
    const response=await axios.post(`http://localhost:4000/api/TestCount`,Testcount);
    if(response.data)
      {
        navigator('/dashboard')
      }
    // console.log(response.data);
  }
  const handleSpeechRecognition = (index) => {
    if (Listening[index]) {
      // console.log(transcript)
      handleAnswerChange(index,transcript)
      resetTranscript();
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
    
  };

  
  useEffect(() => {
    if (listening && transcript!=='') {
      handleAnswerChange(Index, transcript);
    }
    // console.log(transcript);
  }, [listening, transcript, Index]);
  
  const SubmitAnswers = async ()=>{
    setPositiveScore(0);
    setnegativeScore(0);
    setneutralScore(0);
    try {
      setShowChart(true);
      // while(showChart)
      for (let i = 1; i <= 100; i++) {
        setTimeout(() => {
          setvalue_cur(i);
        }, i * 30); // Increment value every 10 milliseconds
      }
      const endpoint='https://speakez.cognitiveservices.azure.com';
      const response = await axios.post(`${endpoint}/text/analytics/v3.0/sentiment`, {
        documents: answers.map((value, index) => ({
          id: index,
          text: value
      }))
      }, {
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': '9431067ba17849d196309737b8671e4a'
          }
      });
      console.log(response.data);
      const totalCount = response.data.documents.length;

response.data.documents.forEach(value => {
    setPositiveScore(prevPositiveScore => prevPositiveScore + (value.confidenceScores.positive / totalCount));
    setnegativeScore(prevNegativeScore => prevNegativeScore + (value.confidenceScores.negative / totalCount));
    setneutralScore(prevNeutralScore => prevNeutralScore + (value.confidenceScores.neutral / totalCount));
});

// Convert to percentages
setPositiveScore(prevPositiveScore => parseInt(prevPositiveScore * 100))
setnegativeScore(prevNegativeScore =>parseInt(prevNegativeScore * 100))
setneutralScore(prevNeutralScore =>parseInt(prevNeutralScore * 100))
      // console.log(response.data);
      // console.log(positiveScore,negativeScore,neutralScore)
  } catch (error) {
      console.error('Error analyzing sentiment:');
  }
  
  }
  return (
    <>
      {showChart?<>
      {positiveScore==0?<>
      <div className="overlay">
          <div className="text-center" dir="ltr">
            <h5 className="font-size-14 mb-3">Loading results</h5>
            <Knob
              value={value_cur}
              height={200}
              width={150}
              fgColor="#4ac18e"
              cursor={true}
              displayCustom={() => {
                return false
              }}
              onChange={handleChangecursor}
            />
          </div>
        </div>
        </>:<>
        <div className='d-flex justify-content-around'>
        <div className="text-center" dir="ltr">
                    <h5 className="font-size-14 mb-3">positive Score</h5>
                    <Knob
                      value={positiveScore}
                      fgColor="#23c403"
                      lineCap="round"
                      height={200}
                      width={150}
                      onChange={e => {
                        
                      }}
                    />
                  </div>
                  <div className="text-center" dir="ltr">
                    <h5 className="font-size-14 mb-3">negative Score</h5>
                    <Knob
                      value={negativeScore}
                      fgColor="#ea553d"
                      lineCap="round"
                      height={200}
                      width={150}
                      onChange={e => {
                        
                      }}
                    />
                  </div>
                  <div className="text-center" dir="ltr">
                    <h5 className="font-size-14 mb-3">neutral Score</h5>
                    <Knob
                      value={neutralScore}
                      fgColor="#e27aff"
                      lineCap="round"
                      height={200}
                      width={150}
                      onChange={e => {
                        
                      }}
                    />
                  </div>
                  </div>
                  <center><Button color='primary'onClick={Update_Test_Count}>submit report</Button></center>
        </>}</>:
      <>
      {questions.length === 0 ? <>
      <div>
        <div className="form-group">
          <label className="form-lable">Upload Resume</label>
          <div className='d-flex '>
          <input type="file" className="form-control form-control-file mr-2" required={true} style={{maxWidth:'400px',minWidth:'150px'}} onChange={handleFileChange} data-input="false" data-buttonname="btn-Seconday" color='Danger' />
          <Button onClick={handleSubmit}>Upload</Button>
          </div>
      </div>
      {loading ? (
            <>
            <br />
            <span>Scanning resume</span>
            <Progress striped animated color="bg-primary"  value={formprogress}>
            {formprogress}%
        </Progress></>
        ) : (<>
        {!loading && isparsed?<><br /><center><Button onClick={()=>{getQuestion();setwaitingquestions(true);setParsed(false)}}>Ask Questions</Button></center></>:<></> }
        {waitingForquestions?<>
          <br /><br />
            <span>Loading</span>
            <Progress striped animated color='success' value={questionprogress}></Progress>
        </>:<></>}
        </>

        )}
        </div>
      </> : <>
            
                {questions.map((question, index) => (
                  <Card key={index}>
                    <CardBody>
                      <CardTitle className="h4">Question {index + 1}</CardTitle>
                      <CardText>{question}</CardText>
                      <textarea
                        rows="4"
                        style={{ width: '100%' }}
                        value={answers[index]}
                        disabled={submittedAnswers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      />
                      <div className='d-flex justify-content-between'>
                      <Button 
                      disabled={submittedAnswers[index]}
                      onClick={() => {
                        SetIndex(index);
                        handleSpeechRecognition(index);
                        setListeningStates(prevState => {
                          const updatedListeningStates = [...prevState];
                          updatedListeningStates[index] = !updatedListeningStates[index];
                          return updatedListeningStates;
                        });
                      }}>
                        {Listening[index] ? 'Stop' : 'Start'} Speech Recognition
                  </Button>
                  <Button color={submittedAnswers[index]?'success':'danger'} disabled={submittedAnswers[index]}onClick={()=>{
                 
                  setSubmittedAnswers(prevState => {
                    const updatedListeningStates = [...prevState];
                    updatedListeningStates[index] = true;
                    return updatedListeningStates;
                  });
                  }}>
                    
                    {submittedAnswers[index]?'submitted ':'submit'}
                    </Button></div>
                    </CardBody>
                  </Card>
                ))}
                <center>
                {positiveScore === null ? (
                      <Button color='primary' onClick={SubmitAnswers}>Print report</Button>
                    ) : (
                      <Button color='primary' onClick={Update_Test_Count}>Submit report</Button>
                    )}
                  
                  </center>
                
              </>
            }
            </>
          }
      </>
      
        
  );
};
export default  connect(null, { setBreadcrumbItems })(ResumeParser);

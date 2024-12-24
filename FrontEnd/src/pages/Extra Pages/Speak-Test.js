import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, Button,Spinner } from 'reactstrap';
import Knob from 'pages/AllCharts/knob/knob';
import CollapsibleList from './Collapse-list';
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux"
import { useUser } from 'Authenticator/Usercontext';
import { useNavigate } from 'react-router-dom';
const Speaktest = (props) => {
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
        'TestType':'Written'
      })
    }, [user]);
    const [question, setQuestion] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [timer, setTimer] = useState(300); // 10 minutes in seconds
    const [testStarted, setTestStarted] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [value_cur,setvalue_cur]=useState(0);
    const [results, setResults] = useState(null);
    const breadcrumbItems = [
        { title: "SpeakEZ", link: "#" },
        { title: "Written Test", link: "#" },
        { title: "WET", link: "#" },
    ]
    useEffect(() => {
        props.setBreadcrumbItems('Written test', breadcrumbItems);
    })
    const timerStyle = {
      fontSize:'24px',
      fontWeight:'bold',
      color: timer < 150 ? 'red' : 'black' // Change to red color when less than 1 minute left
  };
    useEffect(() => {

        if (testStarted) {
            // Start the timer when the test starts
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Clear interval when timer reaches 0
            if (timer === 0) {
                setLoadingResults(true);
                handleSubmit();
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [testStarted, timer]);
    const fetchQuestion = () => {
        axios.get('http://localhost:4000/ai/WET-random-question')
            .then(response => {
                setQuestion(response.data.question);
                console.log(response.data.question);
            })
            .catch(error => {
                console.error('Error fetching question:', error);
            });
    };

    const handleChange = event => {
        setUserResponse(event.target.value);
        // adjustTextAreaHeight(event.target);
    };

    

    const handleSubmit = () => {
        console.log("time over");
        // setLoadingResults(true);
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
              setvalue_cur(i);
            }, i * 50); // Increment value every 10 milliseconds
          }
          const singleParagraphResponse = userResponse.replace(/\n/g, ' ').trim();
        axios.post(`http://localhost:4000/ai/English-Score`, { userResponse:singleParagraphResponse })
            .then(response => {
                console.log(response.data)
                setResults(response.data); // Assuming response.data contains the results you want to display
                setTestStarted(false); // Optionally reset testStarted if the test is concluded
            })
            .catch(error => {
                console.error('Error submitting response:', error);
                setLoadingResults(false); // Ensure loading state is reset on error
            });
            setLoadingResults(false)
    };

    // Format timer in minutes and seconds
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTest = () => {
        setTestStarted(true);
        fetchQuestion();
    };
    const handleChangecursor = newValue => {
        setvalue_cur(newValue)
      }
    const Update_test_result=async()=>{
        const response=await axios.post(`http://localhost:4000/api/TestCount`,Testcount);
        if(response.data)
        {
            navigator('/dashboard')
        }
    }
    return (
        <div className="container-fluid">
            
            {!testStarted && !loadingResults && !results && (
                <div className="text-center mt-4">
                    <Button color="primary" onClick={startTest}>Start Test</Button>
                </div>
            )}

            {testStarted && !loadingResults && (
                question === '' ? (
                    <div className="text-center mt-4">
                        <Spinner color="primary" className='mb-2' />
                        <br />
                        <span>Loading question...</span>
                    </div>
                ) : !loadingResults &&(
                    <Card>
                        <CardBody>
                        <div className='d-flex justify-content-between mb-4'>
                            <h2 className="text-center ">Written Test</h2>
                            <div className="timer mr-3">
                                <i className="ion ion-md-alarm mr-2" style={{fontSize:'25px', fontWeight:'bold'}}></i>
                                    <span style={timerStyle}>{formatTime()}</span>
                                </div>
                        </div>
                        <div className="mb-3">
                            <p style={{ fontSize: '16px' }}>{question}</p>
                            
                        </div>
                        <textarea
                            className="form-control"
                            value={userResponse}
                            onChange={handleChange}
                            style={{ minHeight: '400px' }}
                        />
                        <div className="text-center">
                            <Button color="primary" className="mt-2" onClick={()=>{handleSubmit();setLoadingResults(true)}}>Submit</Button>
                        </div>
                    </CardBody>
                </Card>
                )
            )}

            {loadingResults && !results && (
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
            )}

            {results &&(
                <>
               
               {results && (
  <>
                    <div className='d-flex justify-content-between'>
                    <div>
                        <h5>Misspelled Words</h5>
                        <ul>
                        {results.misspelledWords.map((word, index) => (
                            <li key={index}><s>{word.word}</s> &nbsp;{word.suggested}</li>
                        ))}
                        </ul>
                    </div>
                    
                    <CollapsibleList
                        items={results.partsOfSpeech.NOUN}
                        title="Nouns"
                    />
                    
                    <CollapsibleList
                        items={results.partsOfSpeech.ADJ}
                        title="Adjectives"
                    />
                    
                    <CollapsibleList
                        items={results.partsOfSpeech.ADV}
                        title="Adverbs"
                    />
                    
                    <CollapsibleList
                        items={results.partsOfSpeech.VERB}
                        title="Verbs"
                    />
                    
                    </div>
                    <div className='mt-3'>
                    <Card>
                        <h2 className='mt-2'>Summary:</h2>
                        <CardBody>
                            {results.summary.map((value,index)=>(
                                <li key={index}>{value}</li>
                            ))}
                        </CardBody>
                    </Card>
                    <div className="text-center">
                            <Button color="primary" className="mt-2" onClick={()=>{Update_test_result()}}>Save test</Button>
                        </div>
                    </div>
                    
                    </>
                    )}

                    
                </>
            )}
        </div>
            
            
        
    );
};

export default connect(null, { setBreadcrumbItems })(Speaktest);

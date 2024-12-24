import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, Button, Spinner } from 'reactstrap';
import Knob from 'pages/AllCharts/knob/knob';
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useUser } from 'Authenticator/Usercontext';
import { useNavigate } from 'react-router-dom';
const VocalTest = (props) => {
    const [userResponse, setUserResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [testStarted, setTestStarted] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [value_cur, setvalue_cur] = useState(0);
    const [results, setResults] = useState(null);
    const [mismatchCount, setMismatchCount] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const { transcript, listening, resetTranscript } = useSpeechRecognition({
        recognitionOptions: {
            continuous: true,
            interimResults: true,
            timeout: 40000,
        },
    });
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
          'TestType':'Voice'
        })
      }, [user]);
    const startTest = () => {
        setTestStarted(true);
        fetchQuestion();
    };

    const handleChangecursor = newValue => {
        setvalue_cur(newValue);
    };

    const startListeningToUser = () => {
        resetTranscript();
        SpeechRecognition.startListening(); 
    };

    const breadcrumbItems = [
        { title: "SpeakEZ", link: "#" },
        { title: "Vocal Test", link: "#" },
    ];

    useEffect(() => {
        props.setBreadcrumbItems('Vocal test', breadcrumbItems);
    }, [props]);

    const stopListeningAndHandleSubmit = () => {
        SpeechRecognition.stopListening();
        handleSubmit();
    };

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (testStarted) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            if (timer === 0) {
                clearInterval(interval);
                handleSubmit();
            }

            return () => clearInterval(interval);
        }
    }, [testStarted, timer]);

    const fetchQuestion = () => {
        axios.get(`http://localhost:4000/ai/Random-text`)
            .then(response => {
                setQuestion(response.data.Random_Text);
            })
            .catch(error => {
                console.error('Error fetching question:', error);
            });
    };

    const cleanAndSplit = (text) => {
        return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/); // Split by any amount of spaces
    };
    useEffect(() => {
        if (!listening) {
            setUserResponse(prev => prev + transcript);
        }
    }, [listening, transcript]);

    const handleSubmit = () => {
        setLoadingResults(true);
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
              setvalue_cur(i);
              if (i === 100) {
                setLoadingResults(false); 
                }
            }, i * 50); // Increment value every 10 milliseconds
          }
        const singleParagraphResponse = userResponse.replace(/\n/g, ' ').trim();
        console.log(singleParagraphResponse);
        axios.post(`http://localhost:4000/ai/Vocal-Score`, { 
            actualText: question,
            transcribedText: singleParagraphResponse })
            .then(response => {
                console.log(response.data);
                setResults(response.data)
                setTestStarted(false); // Optionally reset testStarted if the test is concluded
            })
            .catch(error => {
                console.error('Error submitting response:', error);
                setLoadingResults(false); // Ensure loading state is reset on error
            });
    };
    const Update_test_result=async()=>{
        const response=await axios.post(`http://localhost:4000/api/TestCount`,Testcount);
        if(response.data)
        {
            navigator('/dashboard')
        }
    }
    return (
        <>
            {!testStarted && !loadingResults && !results &&(
                <div className="text-center mt-4">
                    <Button color="primary" onClick={startTest}>Start Test</Button>
                </div>
            )}
            {testStarted && !loadingResults && (
                question === '' ? (
                    <div className="text-center mt-4">
                        <Spinner color="primary" className='mb-2' />
                        <br />
                        <span>Loading text...</span>
                    </div>
                ) : (
                    <Card>
                        <CardBody>
                            <div className='d-flex justify-content-between mb-4'>
                                <h2 className="text-center">Voice Test</h2>
                                <div className="timer mr-3">
                                    <i className="ion ion-md-alarm mr-2" style={{ fontSize: '25px', fontWeight: 'bold' }}></i>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: timer < 60 ? 'red' : 'black' }}>
                                        {formatTime()}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p style={{ fontSize: '14px' }}>{question}</p>
                            </div>
                            {!listening && (
                                <div className="text-center">
                                    <Button color="primary" className="mt-2" onClick={startListeningToUser}>Start Speaking</Button>
                                </div>
                            )}
                            {listening && (
                                <div className="text-center">
                                    <h3 className="mt-2">Listening....</h3>
                                </div>
                            )}
                            <br />
                            <textarea
                                rows="8"
                                style={{ width: '100%' }}
                                value={listening ? userResponse + transcript : userResponse}
                                onChange={(e) => { }}
                            />

                            <div className='text-center'>
                                <Button onClick={stopListeningAndHandleSubmit}>Submit</Button>
                            </div>

                            {/* Display Results after Submission */}
                        </CardBody>
                    </Card>
                )
            )}
            {loadingResults && (
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
            {results && value_cur === 100 && !loadingResults && (
            <div className="results-container text-center">
                <h5 className="font-size-14 mb-3">Results:</h5>
                <div>
                    <p>
                        <strong>Matched Words:</strong> {results.matchedWords.join(', ')}
                    </p>
                    <p>
                        <strong>Mismatched Words:</strong> {results.mismatchedWords.join(', ')}
                    </p>
                    <p>
                        <strong>Matched Count:</strong> {results.matchedCount} &nbsp;&nbsp;
                        <strong> Mismatched Count:</strong> {results.mismatchedCount} &nbsp;&nbsp;
                        <strong> Accuracy:</strong> {results.accuracy}%
                    </p>
                </div>
                <Button color="primary" className="mt-2" onClick={() => { Update_test_result() }}>
                    Save Test
                </Button>
            </div>
        )}
        </>
    );
};

export default connect(null, { setBreadcrumbItems })(VocalTest);

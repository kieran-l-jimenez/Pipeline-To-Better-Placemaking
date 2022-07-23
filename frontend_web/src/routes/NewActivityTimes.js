import * as React from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import DoneIcon from '@mui/icons-material/Done';
import axios from '../api/axios';

import TimeForm from '../components/TimeForm';
import { testNames } from '../functions/HelperFunctions';
import '../components/controls.css';
import { act } from 'react-dom/test-utils';

function NewActivityTimes(props) {
    const nav = useNavigate();
    const loc = useLocation();
    const [message, setMessage] = React.useState('');
    const response = React.useRef(null);

    const date = new Date();
    const [activity, setActivity] = React.useState({
        title: loc.state.form.title,
        activity: loc.state.form.activity,
        date: loc.state.form.date,
        timer: loc.state.form.timer,
        number: 0
    });

    const [timeSlots, setTimeSlots] = React.useState([]);

    const collections = {
        boundaries_maps: ['boundaries_collections', 'boundary'],
        light_maps: ['light_collections', 'light'],
        moving_maps: ['moving_collections', 'moving'],
        nature_maps: ['nature_collections', 'nature'],
        order_maps: ['order_collections', 'order'],
        sound_maps: ['sound_collections', 'sound'],
        stationary_maps: ['stationary_collections', 'stationary']
    }

    //dynamically adds removes timeSlot cards for the activity
    const timeCards = (timeSlots) => (
        timeSlots.map((value, index)=>(
            <Card key={ value.instance } className='timeSlots'>
                <Card.Body>
                    { value.points ?
                        <TimeForm 
                            type={value.type}
                            instance={value.instance}
                            index={value.index !== index ? index : value.index} 
                            time={value.time} 
                            surveyors={value.maxResearchers} 
                            points={value.points} 
                            deleteTime={ deleteTimeSlot } 
                            updateTime={ updateTimeSlot } 
                            standingPoints={props.projectInfo.standingPoints}
                        /> : 
                        <TimeForm
                            type={value.type}
                            instance={value.instance}
                            index={value.index !== index ? index : value.index}
                            time={value.time}
                            surveyors={value.maxResearchers}
                            deleteTime={deleteTimeSlot}
                            updateTime={updateTimeSlot}
                            standingPoints={props.projectInfo.standingPoints}
                        />
                     }
                </Card.Body>
            </Card>
        ))
    );

    function newTime(e) {
        var temp = timeSlots;
        if (activity.activtity !== 'boundaries_maps' && activity.activtity !== 'light_maps' && activity.activtity !== 'nature_maps' && activity.activtity !== 'order_maps'){
            temp.push({
                type: collections[activity.activity][1],
                instance: activity.number,
                index: temp.length,
                time: `${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`}`,
                maxResearchers: 0,
                points: {},
                researchers: []
            });
        } else {
            temp.push({
                type: collections[activity.activity][1],
                instance: activity.number,
                index: temp.length,
                time: `${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`}`,
                maxResearchers: 0,
                researchers: []
            });
        }
        setTimeSlots(temp);
        //shallow comparison for React to recognize for update
        var num = activity.number;
        num++;
        setActivity({ ...activity, number: num })
    }

    function updateTimeSlot(index, timeForm){
        var temp = [];
        timeSlots.forEach((card, ind) => ind !== index ? temp.push(card) : temp.push(timeForm));
        setTimeSlots(temp);
    }

    function deleteTimeSlot(index) {
        var temp = [];
        timeSlots.forEach((card, ind) => ind !== index ? temp.push(card) : null);
        setTimeSlots(temp);
    }

    const addNewActivity = async (e) => {
        console.log(props.projectInfo._id);
        console.log(collections[activity.activity][0]);

        try {
            const response = await axios.post(`/projects/${props.projectInfo._id}/${collections[activity.activity][0]}`, JSON.stringify({ 
                title: activity.title,
                date: activity.date,
                area: props.projectInfo.subareas[0]._id,
                duration: `${activity.timer}`

            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}` 
                },
                withCredentials: true
            });

            let collectionDetails = await response.data;
            console.log(collectionDetails);

            for(let i = 0; i < timeSlots.length; i++){
                await addNewTimeSlots(timeSlots[i], activity.title, collectionDetails._id, `${activity.activity}/`, timeSlots[i].type)
            }

            console.log('After add new time slots');
            collectionDetails.test_type = collections[activity.activity][1];
            console.log(collectionDetails.test_type);
            collectionDetails.date = new Date(collectionDetails.date);
            console.log(collectionDetails.date);

            let area = props.projectInfo.subareas.findIndex((element) => element._id === collectionDetails.area);
            collectionDetails.area = props.projectInfo.subareas[area];
            console.log('After add new time slots');
            nav('../', { replace: true, state: {team: loc.state.team, project: loc.state.project, userToken: loc.state.userToken} });
            
        } catch (error) {
            console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            response.current.style.display = 'inline-block';
            return;
        }
    }

    const addNewTimeSlots = async (timeSlot, title, id, timeSlotName, type) => {
        var selectedPoints = [];
        if (type !== 'boundary' && type !== 'nature' && type !== 'order' && type !== 'survey'){
            if(timeSlot.points && timeSlot.points.length !== 0){
                Object.entries(timeSlot.points).forEach(([pointInd, bool])=>(
                    bool ? selectedPoints.push(props.projectInfo.standingPoints[pointInd]) : null
                ))
            }
        } else {
            selectedPoints = props.projectInfo.standingPoints;
        }

        console.log(selectedPoints);
        console.log(timeSlot);

        try {
            const response = await axios.post(`/${timeSlotName}`, JSON.stringify({
                title: title,
                standingPoints: selectedPoints,
                researchers: [],
                project: props.projectInfo._id, 
                collection: id,
                date: timeSlot.time,
                maxResearchers: `${timeSlot.maxResearchers}`
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            let activityDetails = await response.data;

        } catch (error) {
            console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            response.current.style.display = 'inline-block';
            return;
        }

    }

    /*console.log(timeSlots);*/

    return(
        <div id='newActivityTimes'>
            <Card id='timeCard'>
                <Card.Header >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <h1>{ activity.title }</h1>
                        <Button id='createActivityButton' className='confirm' onClick={addNewActivity}>Schedule Activity <DoneIcon /></Button>
                    </div>
                    Project: {props.projectInfo.title}
                    <br/>
                    Category: { testNames(activity.activity) }
                    <br />
                    Date: { activity.date }
                    <br />
                    Time per Location: { activity.timer }
                </Card.Header>
                <Card.Body id='timeCardContent'>
                    <span ref={response} style={{ display: 'none', color: 'red' }}>{message}</span>
                    <Button id='newTimeButton' onClick={ newTime } className='scheme'>New Time Slot</Button>
                    { timeCards(timeSlots) }
                </Card.Body>
                <Button component={ Link } to='../activities' state={{team: loc.state.team, project: loc.state.project, userToken: loc.state.userToken}}>Cancel</Button>
            </Card>
        </div>
    );
}

export default NewActivityTimes;
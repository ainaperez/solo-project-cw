import logo from './logo.svg';
import './App.css';
import {Routes, Route, useNavigate, Redirect} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Register from './components/UserAuth/Register';
import Login from './components/UserAuth/Login';
import ProfilePage from './components/Pages/ProfilePage';
import { useEffect, useState } from 'react';
import Context from './components/context/context';
import HomePage from './components/Pages/HomePage';
import * as EventService from './services/event_service';
import * as UserService from './services/user_service';
import * as ActiveUserService from './services/active_user_service';
import EventPage from './components/Pages/EventPage';
import MapPage from './components/Pages/MapPage';
import MyEventsPage from './components/Pages/MyEvents';


function App() {
  const navigate = useNavigate();

  const [events, setEvents] = useState(null);
  const [users, setUsers] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('')

  function sortEvents (data) {
    data.sort(function(a,b){
      return new Date(a.date) - new Date(b.date) ;
    });
  }

  function parseDate (date) {
    let parsedDate = new Date( Date.parse(date))
    return parsedDate
  }

  function getLikedEvents(eventId){
    if(activeUser.savedEvents.length >0) {
      if(activeUser.savedEvents.find(savedEvent => savedEvent === eventId)){
        return true;
      }else{
        return false
      }
    }
  }

  function getJoinedEvents(eventId){
    if(activeUser.joinedEvents.length > 0) {
      if(activeUser.joinedEvents.find(joinedEvent => joinedEvent === eventId)){
        return true;
      }else{
        return false
      }
    }else{
       return false
    }
  }

  function addToSavedEvents(eventId){
    UserService.addSavedEvent(activeUser._id, eventId)
  }

  function removeSavedEvent(eventId){
    UserService.removeSavedEvent(activeUser._id, eventId)
  }
  function addToJoinedEvents(eventId){
    EventService.addUserToJoinedList(activeUser._id, eventId)
    UserService.addJoinedEvent(activeUser._id, eventId)
  }

  function removeJoinedEvent(eventId){
    EventService.removeUserFromJoinedList(activeUser._id, eventId)
    UserService.removeJoinedEvent(activeUser._id, eventId)
  }

   function getAllEvents () {
    if(activeUser){
      console.log(activeUser)
      EventService.getAllEvents(activeUser._id)
      .then(data => {
        data.forEach(el => {
          el.liked = getLikedEvents(el._id)
          el.joining = getJoinedEvents(el._id)
          el.date = parseDate(el.date)
        });
        let now = new Date();
        let filteredFutureEvents = data.filter(el => el.date > now)
        sortEvents(filteredFutureEvents);
        setEvents(filteredFutureEvents)
      })
      .then(() => {
        setIsLoading(false)}
        )
    }
  }

  function getAllUsers () {
    UserService.getAllUsers()
    .then(data => {
      setUsers(data)
    })
  }

  //Manually set for demonstartion
  async function getActiveUser() {
   setActiveUser(await UserService.getUserById("644116416da455b7fc0c8bba"))
  }

  useEffect(() => {
    getAllUsers();
  }, [])

  useEffect(()=> {
      if(users){
        getActiveUser()
      }
  }, [users])

  useEffect(() => {
    getAllEvents();
  }, [activeUser]);


  return (
    <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8663F3',
            colorTextPlaceholder: '#8663F3'
          },
        }}>
    <Context.Provider
      value={{
        navigate,
        setEvents,
        events,
        isLoading,
        users,
        activeUser,
        setActiveUser,
        addToSavedEvents,
        removeSavedEvent,
        addToJoinedEvents,
        removeJoinedEvent,
        setQuery,
        query}}>
    <Routes>
    <Route path="/register" element={<Register />}/>
    <Route path="/profile/:username" element={<ProfilePage />}/>
    <Route path="/event/:eventtitle" element={<EventPage />}/>
    <Route path="/mapview" element={<MapPage />}/>
    <Route path="/myevents" element={<MyEventsPage />}/>

    <Route path="/login" element={<Login />}/>
    <Route path="/" element={<HomePage />}/>

    </Routes>
    </Context.Provider>
    </ConfigProvider>
  );
}

export default App;

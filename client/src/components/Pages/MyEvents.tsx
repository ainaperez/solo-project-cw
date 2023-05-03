import { useEffect, useContext, useState  } from "react";
import Context from "../context/context";
import Layout from "../Layout/Layout";
import { Tabs } from 'antd';
import EventList from "../EventList";
import LoadingComponent from "../UI/LoadingComponent";
import { EventInterface } from "../../types/EventInterface";

const MyEventsPage = () => {

  const {events, activeUser} = useContext(Context);
  const [savedEvents, setSavedEvents] = useState<EventInterface[]>([])
  const [joinedEvents, setJoinedEvents] = useState<EventInterface[]>([])



useEffect(() => {
  async function getJoinedEvents(){
    const temp: EventInterface[] = [];
    await activeUser.joinedEvents.forEach(eventId => {
      temp.push(events.find(event => +event._id === +eventId));
    })
    setJoinedEvents(temp)
  }
  async function getSavedEvents(){
    const temp: EventInterface[] = [];
    await activeUser.savedEvents.forEach(eventId => {
      temp.push(events.find(event => +event._id === +eventId));
    });
    setSavedEvents(temp)
  }
  if(events && activeUser){
    getSavedEvents()
    getJoinedEvents()
  }
}, [activeUser, events])




return(
  <Layout>
    <div>{savedEvents && joinedEvents ?
      <>
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: `Joined events`,
            children: <>{joinedEvents ? <EventList events={joinedEvents} /> : "Loading..."}</>,
          },
          {
            key: '2',
            label: `Saved Events`,
            children: <div>{savedEvents ? <EventList events={savedEvents} /> : "Loading..."}</div>,
          },
          {
            key: '3',
            label: `Past Joined Events`,
            children: `Content of Tab Pane 3`,
          },
        ]}
        />
      </>
    : <LoadingComponent />}
    </div>
  </Layout>
)}

export default MyEventsPage;
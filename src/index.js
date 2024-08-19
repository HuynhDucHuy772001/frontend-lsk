import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventList from './page/events/EventList.js'
import CreateEvent from './page/events/CreateEvent.js';
import EditEvent from './page/events/EditEvent.js'

function App() {
  document.title = "Lịch Sự Kiện"
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EventList />} />
        <Route path='/create' element={<CreateEvent />} />
        <Route path='/edit/:id' element={<EditEvent />} />
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

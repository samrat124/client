import React, { useState } from 'react';
import './App.css';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Facility Booking</h1>
      </header>
      <main>
        <BookingForm />
      </main>
    </div>
  );
}

export default App;

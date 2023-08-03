import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';
 

const timeSlotsClubhouse = [
  { value: '10:00-11:00', label: '10:00 AM', price: 100 },
  { value: '11:00-12:00', label: '11:00 AM', price: 100 },
  { value: '12:00-13:00', label: '12:00 PM', price: 100 },
  { value: '13:00-14:00', label: '01:00 PM', price: 100 },
  { value: '14:00-15:00', label: '02:00 PM', price: 100 },
  { value: '15:00-16:00', label: '03:00 PM', price: 100 },
  { value: '16:00-17:00', label: '04:00 PM', price: 500 },
  { value: '17:00-18:00', label: '05:00 PM', price: 500 },
  { value: '18:00-19:00', label: '06:00 PM', price: 500 },
  { value: '19:00-20:00', label: '07:00 PM', price: 500 },
  { value: '20:00-21:00', label: '08:00 PM', price: 500 },
  { value: '21:00-22:00', label: '09:00 PM', price: 500 },
  { value: '22:00-23:00', label: '10:00 PM', price: 500 },
];

const timeSlotsTennisCourt = [
  { value: '16:00-17:00', label: '04:00 PM', price: 50 },
  { value: '17:00-18:00', label: '05:00 PM', price: 50 },
  { value: '18:00-19:00', label: '06:00 PM', price: 50 },
  { value: '19:00-20:00', label: '07:00 PM', price: 50 },
  { value: '20:00-21:00', label: '08:00 PM', price: 50 },
  { value: '21:00-22:00', label: '09:00 PM', price: 50 },
];

const formatTime12Hour = (time) => {
  const [hour, minute] = time.split(':');
  const formattedHour = (parseInt(hour) % 12) || 12;
  return `${formattedHour}:${minute}`;
};

const BookingForm = () => {
  const [facility, setFacility] = useState('Clubhouse');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState(formatTime12Hour(timeSlotsClubhouse[0].label));
  const [hours, setHours] = useState(1);
  const [endTime, setEndTime] = useState('11:00 AM');
  const [price, setPrice] = useState(100);
  const[changeHour,setChangeHour]=useState(true);

  const handleHoursChange = (e) => {
    const selectedHours = parseInt(e.target.value);
    setHours(selectedHours);

    const timeSlots = facility === 'Clubhouse' ? timeSlotsClubhouse : timeSlotsTennisCourt;
    const startTimeIndex = timeSlots.findIndex((slot) => slot.value === startTime);
    const endTimeIndex = startTimeIndex + selectedHours;
    setEndTime(timeSlots[endTimeIndex - 1].value);

    let bookingPrice = 0;
    for (let i = startTimeIndex; i < endTimeIndex; i++) {
      bookingPrice += timeSlots[i].price;
    }
    setPrice(bookingPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split('T')[0];
    if (date < currentDate) {
      console.error('Booking failed: Cannot book on previous dates.');
      return;
    }

    const bookingData = {
        ["facilityName"]:facility,
        ["date"]:date,
        ["slot"]:`${startTime} - ${endTime}`,
        
      };

    try {
      const response = await axios.post('http://localhost:3002/bookings/create-booking', bookingData);
      console.log('Booking successful:', response.data);
      setFacility('Clubhouse');
      setDate('');
      setStartTime(formatTime12Hour(timeSlotsClubhouse[0].label));
      setHours(1);
      setEndTime('11:00 AM');
      setPrice(100);
    } catch (error) {
      console.error('Booking failed:', error.response.data.message);
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Facility</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Facility:</label>
          <select value={facility} onChange={(e) => setFacility(e.target.value)}>
            <option value="Clubhouse">Clubhouse</option>
            <option value="Tennis Court">Tennis Court</option>
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label>Start Time:</label>
          <select value={startTime} onChange={(e) =>{ setStartTime(e.target.value);setChangeHour(false)}}>
            {facility === 'Clubhouse'
              ? timeSlotsClubhouse.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {formatTime12Hour(slot.label)}
                  </option>
                ))
              : timeSlotsTennisCourt.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {formatTime12Hour(slot.label)}
                  </option>
                ))}
          </select>
        </div>
        <div>
          <label>Duration (hours):</label>
          <select disabled={changeHour}   value={hours} onChange={handleHoursChange}>
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
            <option value={3}>3 hours</option>
          </select>
        </div>
        <div>
          <label>End Time:</label>
          <input type="text" value={endTime} readOnly />
        </div>
        <div>
          <label>Price:</label>
          <input type="text" value={`Rs. ${price}`} readOnly />
        </div>
        <div>
          <button type="submit">Book Facility</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
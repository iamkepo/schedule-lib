export class EventManager {
  constructor() {
    this.events = {}; // An object to store events with dates as keys
  }

  // Add an event with detailed information for a specific date
  addEvent(date, event) {
    if (!this.events[date]) {
      this.events[date] = [];
    }
    this.events[date].push(event);
  }

  addEvents(eventsArray) {
    eventsArray.forEach(event => {
      this.addEvent(event.date, event);
    });
  }

  duplicateEvent(date, event) {
    this.addEvent(date, event);
  }

  updateEvent(date, event) {
    let events = this.getEvents(date);

    const index = events.findIndex(e => e.id == event.id);
    if (index !== -1) {
      events[index] = { ...event };
      this.events[date] = events;      
    } else {
      console.error(`Event with id ${event.id} not found.`);
    }
  }

  moveEvent(oldDate, eventId, newDate) {
    let event = this.events[oldDate].find(item => item.id == eventId);

    if (event) {
      this.events[oldDate] = this.events[oldDate].filter(item => item.id != eventId);
      
      if (this.events[oldDate].length == 0) {
        delete this.events[oldDate];
      }

      if (!this.events[newDate]) {
        this.events[newDate] = [];
      }
      
      this.events[newDate].push({...event, date: newDate});
    }
  }

  updateRecurrencyEvent(newEvent) {
    for (const date in this.events) {
      this.events[date].forEach((event, i) => {
        if (event.recurrency_code === newEvent.recurrency_code) {
          this.updateEvent(date, {...event, ...newEvent})
        }
      });
    }
  }

  moveUpdateEvent(oldDate, event) {
    this.removeEvent(oldDate, event.id);
    this.addEvent(event.date, event);
  }

  moveUpdateHourEvent(oldDate, eventId, newDate, hour) {    
    this.moveEvent(oldDate, eventId, newDate)
    let event = this.events[newDate].find(item => item.id == eventId);
    if(event) {
      event.start_hour = (hour.length == 1 ? ('0'+hour) : hour)+':00';
      if (parseInt(hour) == 23) {
        event.end_hour = '00:00';
      } else {
        event.end_hour = (hour.length == 1 ? ('0'+(parseInt(hour)+1)) : (parseInt(hour)+1))+':00';
      }
      this.updateEvent(newDate, {...event, date: newDate});
    }
  }

  moveEvents(oldDate, newDate) { 
    if (!this.events[newDate]) {
      this.events[newDate] = [];
    }

    this.events[oldDate].forEach(element => {
      this.events[newDate].push({...element, date: newDate});
    });
    
    delete this.events[oldDate];
  }

  // Remove an event by date and title
  removeEvent(date, id) {
    if (this.events[date]) {
      this.events[date] = this.events[date].filter(event => event.id != id);
      if (this.events[date].length == 0) {
        delete this.events[date];
      }
    }
  }
  removeRecurrencyEvent(newEvent) {
    for (const date in this.events) {
      this.events[date].forEach(event => {
        if (event.recurrency_code == newEvent.recurrency_code) {
          this.removeEvent(date, event.id)
        }
      });
    }
  }
  removeDayEvent(day) {
    if (this.events[day]) {
      delete this.events[day];
    }
  }

  removeMonthEvent(month) {
    for (const date in this.events) {
        if (date.startsWith(month)) {
            delete this.events[date];
        }
    }
  }

  removeYearEvent(year) {
      for (const date in this.events) {
          if (date.startsWith(year)) {
              delete this.events[date];
          }
      }
  }
  removeAllEvent() {
    this.events = {}
  }

  getEvent(date, id) {    
    if (this.events[date]) {
      return this.events[date].find(event => event.id == id) || null;
    }
    return null;
  }

  // Get all events for a specific date
  getEvents(date) {
    return this.events[date] || [];
  }

  // Check if there are events for a specific date
  hasEvents(date) {
    return !!this.events[date] && this.events[date].length > 0;
  }

  // Get all events for a specific month and year
  getAllEventsForMonth(year, month) {
    const eventsInMonth = {};
    for (const date in this.events) {
      const eventDate = new Date(date);
      if (eventDate.getMonth() == month && eventDate.getFullYear() == year) {
        eventsInMonth[date] = this.events[date];
      }
    }
    return eventsInMonth;
  }

  // Get all events for a specific year
  getAllEventsForYear(year) {
    const eventsInYear = {};
    for (const date in this.events) {
      const eventDate = new Date(date);
      if (eventDate.getFullYear() == year) {
        eventsInYear[date] = this.events[date];
      }
    }
    return eventsInYear;
  }

  getAllEventsForWeek(startOfWeek) {
    const eventsForWeek = {};
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the end of the week

    for (let d = startOfWeek; d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      const formattedDate = this.formatDate(d);
      if (this.events[formattedDate]) {
        eventsForWeek[formattedDate] = this.events[formattedDate];
      }
    }
    return eventsForWeek;
  }

  getAllEvents() {
    let events = [];
    for (const date in this.events) {
      this.events[date].forEach(event => {
        events.push(event);
      });
    }
    return events;
  }

  formatDate(date) {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }
  getFilteredEvents(ref, event){
    return (ref.id_ref == event.id_ref && ref.type_ref == event.type_ref);
  }
}
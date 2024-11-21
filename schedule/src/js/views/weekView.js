export class WeekView {
  constructor(calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.editable = calendar.editable;
    this.calendar = calendar;
  }

  render() {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = ''; // Clear existing content

    const startOfWeek = this.calendar.getStartOfWeek(this.calendar.currentDate);
    const weekDays = this.langManager.getWeekDays();

    // Create and append week days header
    const weekDaysHeader = document.createElement('div');
    weekDaysHeader.className = 'week-header';
    const dayEmpty = document.createElement('div');
    weekDaysHeader.appendChild(dayEmpty);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(currentDate.getDate() + i);

      const dayElement = document.createElement('div');
      dayElement.className = 'week-day-header';
      dayElement.textContent = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()}`;

      weekDaysHeader.appendChild(dayElement);
    }
    weekView.appendChild(weekDaysHeader);

    // Create and append hours and week days grid
    const grid = document.createElement('div');
    grid.className = 'week-grid';

    for (let hour = 0; hour < 24; hour++) {
      const hourRow = document.createElement('div');
      hourRow.className = 'week-hour-row';

      const hourCell = document.createElement('div');
      hourCell.className = 'week-hour-cell';
      hourCell.textContent = `${hour}:00`;
      hourRow.appendChild(hourCell);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-date';
        dayCell.dataset.date = dateStr;
        dayCell.dataset.hour = hour;

        // Add classes for current/selected dates
        if (dateStr === new Date().toISOString().split('T')[0]) {
            dayCell.classList.add('current-date');
        }
        if (dateStr === this.calendar.currentDate.toISOString().split('T')[0]) {
            dayCell.classList.add('selected-date');
        }

        hourRow.appendChild(dayCell);
      }
      grid.appendChild(hourRow);
    }
    weekView.appendChild(grid);

    // Add events to the week view
    this.renderEvents(grid, startOfWeek);
  }

  renderEvents(grid, startOfWeek) {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const events = this.eventManager.getEvents(dateStr);

      events.forEach(event => {
        this.renderEvent(event, grid, dateStr);
      });
    }
  }

  renderEvent(event, grid, dateStr) {
    const startDateTime = new Date(dateStr + 'T' + event.start_hour);
    const endDateTime = new Date(dateStr + 'T' + event.end_hour);
    const startHour = startDateTime.getHours();
    const durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60); // Duration in hours

    const eventElement = document.createElement('div');
    eventElement.className = 'event-item';
    if (this.editable) {
    eventElement.style.cursor = 'move';  
    eventElement.setAttribute('draggable', 'true')
    }
    eventElement.dataset.date = dateStr;
    eventElement.dataset.id = event.id;

    const startDayCell = grid.querySelector(`.calendar-date[data-date="${dateStr}"][data-hour="${startHour}"]`);

    if (startDayCell) {
      eventElement.style.gridRow = `${startHour + 1} / span ${durationInHours}`;
      eventElement.style.height = `${durationInHours * 100}%`;
      eventElement.style.zIndex = startHour+10; // Adjust z-index based on start hour

      startDayCell.appendChild(eventElement);
    }
  }


  createEventMap() {
    const startOfWeek = this.calendar.getStartOfWeek(this.calendar.currentDate);
    let allEvents = this.eventManager.getAllEventsForWeek(startOfWeek);
    return allEvents;
  }
}
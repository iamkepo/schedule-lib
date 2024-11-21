export class DayView {
  constructor(calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.editable = calendar.editable;
    this.calendar = calendar;
  }

  render() {
      const dayView = document.getElementById('day-view');
      dayView.innerHTML = ''; // Clear existing content

      const dateStr = this.calendar.currentDate.toISOString().split('T')[0];

      // Create and append hours grid
      const hoursGrid = document.createElement('div');
      hoursGrid.className = 'hours-grid';

      for (let hour = 0; hour < 24; hour++) {
          const hourRow = document.createElement('div');
          hourRow.className = 'hour-row';

          const hourLabel = document.createElement('div');
          hourLabel.className = 'hour-label';
          hourLabel.textContent = `${hour}:00`;

          const hourCell = document.createElement('div');
          hourCell.className = 'calendar-date';
          hourCell.dataset.hour = hour;
          hourCell.dataset.date = dateStr;

          hourRow.appendChild(hourLabel);
          hourRow.appendChild(hourCell);

          hoursGrid.appendChild(hourRow);
      }
      dayView.appendChild(hoursGrid);

      // Create and append events for the day
      const events = this.eventManager.getEvents(dateStr);
      if (events.length > 0) {
          this.renderEvents(events, hoursGrid, dateStr);
      } else {
          const noEvents = document.createElement('div');
          noEvents.className = 'no-events';
          noEvents.textContent = this.langManager.translate('NO_EVENTS');
          dayView.appendChild(noEvents);
      }
  }

  renderEvents(events, hoursGrid, dateStr) {
      events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.className = 'event-item';
          if (this.editable) {
            eventElement.style.cursor = 'move';  
            eventElement.style.resize = 'vertical';
            eventElement.setAttribute('draggable', 'true')
          }
        //   eventElement.style.backgroundColor = event.color;
        //   eventElement.textContent = `${event.title}`;
        //   eventElement.title = `${event.title}: ${event.description}`;
          eventElement.dataset.date = dateStr;
          eventElement.dataset.id = event.id;

          const startDateTime = new Date(dateStr + 'T' + event.start_hour);
          const endDateTime = new Date(dateStr + 'T' + event.end_hour);

          const startHour = startDateTime.getHours();
          const duration = (endDateTime - startDateTime) / (60 * 1000); // Duration in minutes
          const hourCell = hoursGrid.querySelector(`.calendar-date[data-hour="${startHour}"]`);

          if (hourCell) {
              eventElement.style.top = `${(startDateTime.getMinutes() / 60) * 100}%`;
              eventElement.style.height = `${(duration / 60) * 100}%`;

              // Adjust z-index based on the hour (earlier hours get lower z-index)
              eventElement.style.zIndex = startHour;

              hourCell.appendChild(eventElement);

              if (this.editable) {
                // Add resize event listener
                this.addResizeEventListener(eventElement, startDateTime, dateStr, event);
              }
          }
      });
  }

  addResizeEventListener(eventElement, startDateTime, dateStr, event) {
    let isResizing = false;

    eventElement.addEventListener('mousedown', () => {
        isResizing = true;
    });

    eventElement.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const newHeight = eventElement.offsetHeight;
            const parentHeight = eventElement.parentElement.offsetHeight;

            // Calculate new duration based on new height
            const durationInMinutes = (newHeight / parentHeight) * 60;
            const newEndDateTime = new Date(startDateTime.getTime() + durationInMinutes * 60000);

            eventElement.dataset.end_hour = `${newEndDateTime.getHours().toString().padStart(2, '0')}:${newEndDateTime.getMinutes().toString().padStart(2, '0')}`;

            // Optional: visually update end time live (e.g., show it in a tooltip)
        }
    });

    eventElement.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;

            const newHeight = eventElement.offsetHeight;
            const parentHeight = eventElement.parentElement.offsetHeight;

            // Calculate new duration based on the new height
            const durationInMinutes = (newHeight / parentHeight) * 60;
            const newEndDateTime = new Date(startDateTime.getTime() + durationInMinutes * 60000);

            eventElement.dataset.end_hour = `${newEndDateTime.getHours().toString().padStart(2, '0')}:${newEndDateTime.getMinutes().toString().padStart(2, '0')}`;

            // Update the event in the event manager
            this.calendar.trigger('update', {
                ...event,
                date: dateStr,
                end_hour: eventElement.dataset.end_hour
            });
        }
    });
  }

  createEventMap() {
      const day = this.eventManager.formatDate(this.calendar.currentDate);
      let allEvents = this.eventManager.getEvents(day);
      
      return allEvents;
  }
}
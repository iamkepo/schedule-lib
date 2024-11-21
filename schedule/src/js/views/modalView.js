import { LangManager } from "../managers/langManager.js";

export class ModalView {
  constructor(defaultLang) {
    this.langManager = new LangManager(defaultLang);
    const modalHtml = `
      <div class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">        
              <button type="button" class="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button>
                <h4 id="title-modal" class="text-center my-4"></h4>
                <div id="event-content"><div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    this.initElements();
    this.initEventListeners();
    this.eventData = {};
    this.chevron = false;
    this.action = '';
  }

  createModal(action) {
    this.title.innerHTML = this.langManager.translate(action);

    this.content.innerHTML = `
      <form class="col-12 text-center" id="event-form">

        <div class="row text-start mb-3">
          <div class="col-4">
            <label for="event-date" class="form-label" data-translate="DATE"></label>
            <input type="date" min="1900-01-01" max="2099-09-13" id="event-date" class="form-control">
          </div>
          <div class="col-4 text-truncate">
            <label for="event-start-hour" class="form-label" data-translate="START_HOUR"></label>
            <input type="time" min="00:00" max="23:00" id="event-start-hour" class="form-control" required>
          </div>
          <div class="col-4">
            <label for="event-end-hour" class="form-label" data-translate="END_HOUR"></label>
            <input type="time" min="00:00" max="23:00" id="event-end-hour" class="form-control" required>
          </div>
        </div>

        <div id="recurrence" class="col text-end"></div>

        <div class="col-12" id="recurrenceEvents"></div>
        ${action == 'UPDATE_EVENT' ? '<button id="confirmDelete" type="button" class="btn btn-danger" data-translate="DELETE"></button>' : ''}
        <button type="submit" class="btn btn-primary" data-translate="SAVE"></button>
      </form>
    `;
  }
  
  initElements() {
    this.modalElement = document.querySelector('.modal');
    this.content = this.modalElement.querySelector('#event-content');
    this.title = document.querySelector('#title-modal');
    this.closeButton = this.modalElement.querySelector('.btn-close');
  }

  initEventListeners() {
    this.closeButton.addEventListener('click', () => this.close());
  }


  checkboxEventDays(dayOfWeek) {  
    return dayOfWeek.map(day => `
      <label class="form-check-label mb-1 me-1 px-1 bg-light rounded-2">
        <input type="checkbox" class="form-check-input d-none" value="${day}"> 
        ${this.langManager.translate(day)}
      </label>
    `).join('');
  }

  recurrenceEvent(state) {
    let limit = '';
    if (this.form.querySelector('#event-limit')) {
      limit = this.form.querySelector('#event-limit').value;
    }

    if(state == true && this.eventData.recurrency_code == null) {
      this.recurrenceEvents.innerHTML = `
        <div class="row mb-3">
          <div class="col-4 text-start ps-3">
            <label for="event-limit" class="form-label">${this.langManager.translate('LIMIT_UNTIL')}</label>
            <input type="date" min="1900-01-01" max="2099-09-13" id="event-limit" value="${limit}" class="form-control" required>
          </div>

          <div class="col-8 text-start">
            <label class="form-label">${this.langManager.translate('DAYS_OF_WEEK')}</label>
            <div id="event-days">
              ${ this.checkboxEventDays(this.langManager.getWeekDays()) }
            </div>
          </div>
        </div>
      `;
      
      
      this.recurrenceEvents.querySelectorAll('.form-check-label').forEach(day => {
        day.onclick = () => {
          const input = day.querySelector('.form-check-input').checked;
          if (input) {
            day.className = 'form-check-label mb-1 me-1 px-1 text-bg-primary rounded-2';
          } else {
            day.className = 'form-check-label mb-1 me-1px-1 bg-light rounded-2';
          }
        };
      });
    } else {
      this.recurrenceEvents.innerHTML = ''
    }

    this.recurrence.innerHTML =`
      <span data-translate="RECURRENCE">${this.langManager.translate('RECURRENCE')}</span>
      <input type="checkbox" ${state ? 'checked' : ''} id="recurrency_code">
    `;

    this.chevron = state;

  }

  open(date) {
    this.action = 'create';
    this.createModal('ADD_EVENT');
    this._prepareModal(date);
  }

  edit(event) {
    this.action = 'update';
    this.createModal('UPDATE_EVENT');
    this._prepareModal(event.date, event);
     
    if (event.recurrency_code == null) {
      this.recurrence.innerHTML = ''
    }
    // Add event listeners for confirm and cancel buttons
    document.getElementById('confirmDelete').addEventListener('click', () => {
      if(this.form.querySelector('#recurrency_code') && this.form.querySelector('#recurrency_code').checked){
        this.trigger('removerecurrence', event);
      } else {
        this.trigger('remove', { date: event.date, event });
      }
      this.close()
    });
  }

  _prepareModal(date, event = {}) {
    this.langManager.translateElements();
    this.modalElement.style.display = 'block';
    this.recurrence = this.modalElement.querySelector('#recurrence');
    this.recurrenceEvents = this.modalElement.querySelector('#recurrenceEvents');
    this.form = this.modalElement.querySelector('#event-form');
    
    this.recurrence.addEventListener('click', () => this.recurrenceEvent(!this.chevron));

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(); 
      this.eventData = {};
      this.form.reset();
    });

    const { 
      id = null, 
      recurrency_code = null, 
      start_hour = '00:00', 
      end_hour = '01:00' 
    } = event;

    this.eventData = { id, last_date: event.date || null, recurrency_code };

    this.recurrenceEvent(false);

    this.form.querySelector('#event-date').value = date.split('T')[0];
    this.form.querySelector('#event-start-hour').value = date.split('T')[1] || start_hour;
    this.form.querySelector('#event-end-hour').value = date.split('T')[1] || end_hour;
  }

  close() {
    this.modalElement.style.display = 'none';
  }

  handleSubmit() {

    const updatedEventData = {
      ...this.eventData,
      start_hour: this.form.querySelector('#event-start-hour').value,
      end_hour: this.form.querySelector('#event-end-hour').value,
      date: this.form.querySelector('#event-date').value,
    };

    this.eventData = updatedEventData;

    switch (this.action) {
      case 'create':
        this.create();
        this.close();
        break;
      case 'update':
        this.update();
        this.close();
        break;
    
      default:
        break;
    }

  }

  getlistDateBetweenTwoDate(startDate, filterDay, endDate) {
    const dates = [];
    const dayOfWeek = this.langManager.getWeekDays();
  
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
  
    while (currentDate <= end) {
      const currentDay = dayOfWeek[currentDate.getDay()];
      if (filterDay.includes(currentDay)) {
        dates.push({date: currentDate.toISOString().split('T')[0]});
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  create() {
    const days = Array.from(this.form.querySelectorAll('#event-days .form-check-input'))
        .filter(input => input.checked)
        .map(input => input.value);

    const limit = this.form.querySelector('#event-limit')?.value || null;
    if (days.length > 0 && limit) {
      delete this.eventData.id;
      this.eventData.recurrency_code = this.generateRandomCode();
      const dates = this.getlistDateBetweenTwoDate(this.eventData.date, days, limit);
      this.trigger('adds', dates.map(item => ({ ...this.eventData, ...item })));
    } else {
      delete this.eventData.id;
      this.trigger('add', this.eventData);
    }
  }
  update() {
    let last_date = (this.eventData.last_date && new Date(this.eventData.last_date).getTime() !== new Date(this.eventData.date).getTime()) ? this.eventData.last_date : null;
    delete this.eventData.last_date
    
    if(this.form.querySelector('#recurrency_code') && this.form.querySelector('#recurrency_code').checked){
      delete this.eventData.id;
      delete this.eventData.date;
      this.trigger('updaterecurrency', this.eventData);
    } else if (last_date) {
      this.trigger('moveupdate', { date: last_date, event: this.eventData });
    } else {
      this.trigger('update', this.eventData);
    }
  }

  showEditableModal() {
    this.title.innerHTML = '';
    this.content.innerHTML = `
      <div class="text-center">
      <p class="mb-3" data-translate="EDIT_CONFIRMATION"></p> 
      <button id="confirmEdit" class="btn btn-primary" data-translate="VALIDATE"></button> 
      </div>
    `;

    this.langManager.translateElements();
    this.modalElement.style.display = 'block';
  
    // Add event listeners for confirm and cancel buttons
    document.getElementById('confirmEdit').addEventListener('click', () => this.close());
  }

  generateRandomCode() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  on(event, handler) {
    document.addEventListener(event, (e) => handler(e.detail));
  }

  trigger(event, detail) {
    const eventObj = new CustomEvent(event, { detail });
    document.dispatchEvent(eventObj);
  }
}
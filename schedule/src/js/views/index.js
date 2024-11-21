export class ViewManager {
  constructor({containerId, defaultView}, calendar) {
    this.container = document.getElementById(containerId);
    this.calendar = calendar; // Store reference to the Calendar instance
    this.langManager = calendar.langManager;
    this.currentView = defaultView;

    this.renderCalendarStructure();
    this.langManager.translateElements()
    this.init();
  }

  init() {
    this.initElements();
    this.initEventListeners();
  }
  
  renderCalendarStructure() {
    this.container.innerHTML = `
        <div class="calendar-container">
          <div class="d-flex justify-content-between p-2">
            <div class="btn-group" role="group" aria-label="Calendar views">
              <button type="button" class="btn btn-light" id="btn-week" data-translate="WEEK"></button>
              <button type="button" class="btn btn-light" id="btn-day" data-translate="DAY"></button>
            </div>
            <h5 style="margin: 0px" id="current-view-title">Year</h5>
            <div class="btn-group" role="group" aria-label="Calendar header">
              <button type="button" class="btn btn-light" id="btn-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                </svg>
              </button>
              <button type="button" class="btn btn-light" id="btn-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>

              <button type="button" class="btn btn-light" id="btn-today" data-translate="TODAY"></button>
            </div>
          </div>
          <div class="col-12">
            <div id="week-view" class="calendar-view active"></div>
            <div id="day-view" class="calendar-view"></div>
          </div>
        </div>
    `;
  }

  initElements() {
    this.weekView = document.getElementById('week-view');
    this.dayView = document.getElementById('day-view');

    this.weekBtn = document.getElementById('btn-week');
    this.dayBtn = document.getElementById('btn-day');

    this.showView(this.currentView);
  }

  initEventListeners() {
    this.weekBtn.addEventListener('click', () => this.changeView('week'));
    this.dayBtn.addEventListener('click', () => this.changeView('day'));
  }

  showView(view) {
    this.hideAllViews();
    document.getElementById(`${view}-view`).classList.add('active');
    document.getElementById(`btn-${view}`).classList.add('active');
    this.currentView = view;
  }

  hideAllViews() {
    this.weekView.classList.remove('active');
    this.dayView.classList.remove('active');

    this.weekBtn.classList.remove('active');
    this.dayBtn.classList.remove('active');
  }

  changeView(view) {
    this.currentView = view;
    this.showView(view);
    this.calendar.updateView(); // Ensure the calendar updates when view changes
  }
}
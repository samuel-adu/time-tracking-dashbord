fetch('/data.json')
  .then((request) => {
    if (!request.ok) {
      console.log('Oops! Something went wrong.');
      return null;
    }
    return request.json();
  })
  .then((data) => {
    const defaultView = 'weekly';
    let currentView = defaultView;
    renderCards(data, currentView);

    const switchButtons = document.querySelectorAll('.switch-btn');

    switchButtons.forEach((button) => {
      button.addEventListener('click', setCurrentView);
    });

    function setCurrentView(event) {
      currentView = event.target.dataset.timeframe;
      renderCards(data, currentView);
    }
  });

function renderCards(data, currentView) {
  const activityCardContainer = document.getElementById(
    'activity-card-container'
  );

  activityCardContainer.innerHTML = '';

  const timeCardList = data
    .map((activity) => {
      const title = activity.title;
      const currentTime = activity.timeframes[currentView].current;
      const previousTime = activity.timeframes[currentView].previous;
      const previousTimeframe = getPreviousTimeframe(currentView);
      const titleClass = activity.title.toLowerCase().replace(/ /, '-');
      return `
        <div class="activity-card activity-card--${titleClass}">
          <img
            src="./images/icon-${titleClass}.svg"
            alt=""
            class="activity-card__icon"
          />
          <div class="activity-card__body">
            <div class="activity-card__header">
              <h2 class="activity-card__heading">${title}</h2>
              <img src="./images/icon-ellipsis.svg" alt="ellipsis" />
            </div>
            <div class="activity-duration">
              <p class="activity-current-duration">
                ${currentTime} ${currentTime > 1 ? 'hrs' : 'hr'}
              </p>
              <p class="activity-previous-duration">
                ${previousTimeframe} - ${previousTime} 
                ${previousTime > 1 ? 'hrs' : 'hr'}
              </p>
            </div>
          </div>
        </div>`;
    })
    .join('');

  activityCardContainer.innerHTML = timeCardList;
}

function getPreviousTimeframe(currentView) {
  let previousTimeframe = '';
  if (currentView === 'daily') {
    previousTimeframe = 'Yesterday';
  } else if (currentView === 'monthly') {
    previousTimeframe = 'Last Month';
  } else {
    previousTimeframe = 'Last Week';
  }
  return previousTimeframe;
}

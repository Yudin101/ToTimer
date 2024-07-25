document.addEventListener('DOMContentLoaded', () => {
	navBarFunction();
    timerBoxFunction();
    loadTasks();
    addTask();
    checkTask();
    clearTasks();
});

function navBarFunction() {
	const homeButton = document.querySelector('#nav-ul-home');
	const aboutButton = document.querySelector('#nav-ul-about');

	const homeContainer = document.querySelector('.home-container');
	const aboutContainer = document.querySelector('.about-container');

	aboutButton.addEventListener('click', () => {
		loadPage(aboutButton, aboutContainer);
	});

	homeButton.addEventListener('click', () => {
		loadPage(homeButton, homeContainer);
	});

	function loadPage(button, container) {
		[homeContainer, aboutContainer].forEach(container => {
			container.style.display = 'none';
		});

		[homeButton, aboutButton].forEach(button => {
			button.classList.remove('nav-ul-button-selected');
		});

		container.style.display = 'flex';
		button.classList.add('nav-ul-button-selected');
	}
}


function timerBoxFunction() {
	const focusButton = document.querySelector('#focus-button');
    const shortBreakButton = document.querySelector('#short-break-button');
    const longBreakButton = document.querySelector('#long-break-button');    

    const startButton = document.querySelector('#start-button');
    const pauseButton = document.querySelector('#pause-button');
    const timer = document.querySelector('#timer');

    let intervalID;
    let currentMinutes = 25;

    // Set initial state to Focus
    function initializeFocus() {
        setButtonStates(focusButton);
        currentMinutes = 25;
        timer.textContent = `25:00`;
    }

    function setButtonStates(selectedButton) {
        [focusButton, shortBreakButton, longBreakButton].forEach(button => {
            button.classList.remove('top-button-selected');
            button.removeAttribute('disabled');
        });

        selectedButton.classList.add('top-button-selected');
        selectedButton.setAttribute('disabled', '');
    }

    focusButton.addEventListener('click', () => {
        setButtonStates(focusButton);
        currentMinutes = 25;
        timer.textContent = `25:00`;
    });

    shortBreakButton.addEventListener('click', () => {
        setButtonStates(shortBreakButton);
        currentMinutes = 5;
        timer.textContent = `05:00`;
    });

    longBreakButton.addEventListener('click', () => {
        setButtonStates(longBreakButton);
        currentMinutes = 15;
        timer.textContent = `15:00`;
    });

    function startTimer(startingMinutes) {
        let totalSeconds = (startingMinutes * 60) - 1;

        intervalID = setInterval(() => {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timer.textContent = `${minutes}:${seconds}`;
            totalSeconds--;

            if (totalSeconds < 0) {
                clearInterval(intervalID);
                timer.textContent = `${startingMinutes < 10 ? '0' + startingMinutes : startingMinutes}:00`;
                startButton.style.display = 'block';
                pauseButton.style.display = 'none';

                body.classList.remove('body-timer-bg');
                tasksBox.classList.remove('tasks-box-timer-bg');

                nav.classList.remove('invisible');
                timerBox.classList.remove('invisible');
            }
        }, 1000);
    }

    const body = document.querySelector('body');
    const nav = document.querySelector('nav');
    const timerBox = document.querySelector('.timer-box');
    const tasksBox = document.querySelector('.tasks-box');

    startButton.addEventListener('click', () => {
        clearInterval(intervalID);
        startTimer(currentMinutes);
        
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';

        body.classList.add('body-timer-bg');
        tasksBox.classList.add('tasks-box-timer-bg');

        nav.classList.add('invisible');
        timerBox.classList.add('invisible');
    });

    pauseButton.addEventListener('click', () => {
        clearInterval(intervalID);
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';

        body.classList.remove('body-timer-bg');
        tasksBox.classList.remove('tasks-box-timer-bg');

        nav.classList.remove('invisible');
        timerBox.classList.remove('invisible');
    });

    // Initialize the timer as Focus by default
    initializeFocus();
}


function checkTask() {
    const tasksContainer = document.querySelector('.tasks');

    tasksContainer.addEventListener('change', (event) => {
        if (event.target.matches('.checkboxes')) {
            const taskText = event.target.nextElementSibling;
            if (event.target.checked) {
                taskText.classList.add('task-text-checked');
            } else {
                taskText.classList.remove('task-text-checked');
            }
        }
    });
}


function addTask() {
    document.querySelector('#task-form').onsubmit = () => {
        const task = document.querySelector('#task-input').value;
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        fetch('/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                task: task
            })
        })
        .then(response => response.json())
        .then(data => {
            loadTasks();
            document.querySelector('#task-input').value = ''
        })

        return false;
    }
}


function loadTasks() {
    const tasksList = document.querySelector('#tasks-list');

    fetch(/load/)
    .then(response => response.json())
    .then(tasks => {
        tasksList.innerHTML = '';

        if (tasks.length === 0) {
            tasksList.innerHTML = 'No Tasks!';
        } else {
            for (var i = 0; i < tasks.length; i++) {
                const li = document.createElement('li');
                li.classList.add('task');

                li.innerHTML = `
                    <input id="check${i}" class="checkboxes" type="checkbox"> <label for="check${i}" class="task-text">${tasks[i].task}</label>
                `;

                tasksList.appendChild(li);
            }
        }
    })
}


function clearTasks() {
    const tasksList = document.querySelector('#tasks-list');
    const clearTaskButton = document.querySelector('#tasks-clear-button');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    clearTaskButton.addEventListener('click', (event) => {
        event.preventDefault();
        fetch('clear/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            while (tasksList.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }
            tasksList.innerHTML = 'No Tasks!';
        })
    });

    return false;
}
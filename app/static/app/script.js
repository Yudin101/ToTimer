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

                new Audio('static/app/time_up.mp3').play();

                startButton.style.display = 'block';
                pauseButton.style.display = 'none';

                body.classList.remove('body-timer-bg');
                tasksBox.classList.remove('boxes-timer-bg');

                nav.classList.remove('invisible');
                timerBox.classList.remove('invisible');
            }
        }, 1000);
    }

    const body = document.querySelector('body');
    const nav = document.querySelector('nav');
    const navButtons = document.querySelectorAll('.nav-ul-button');
    const topButtonsDiv = document.querySelector('.top-buttons-div');
    const timerBox = document.querySelector('.timer-box');
    const tasksBox = document.querySelector('.tasks-box');

    startButton.addEventListener('click', () => {
        clearInterval(intervalID);
        startTimer(currentMinutes);
        
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';

        body.classList.add('body-timer-bg');
        tasksBox.classList.add('boxes-timer-bg');

        nav.classList.add('invisible');

        navButtons.forEach(button => {
            button.classList.add('invisible');
            button.disabled = true;
        });

        timerBox.classList.add('boxes-timer-bg');

        if (currentMinutes === 25) {
            shortBreakButton.classList.add('invisible');
            longBreakButton.classList.add('invisible');
        } else if (currentMinutes === 5) {
            focusButton.classList.add('invisible');
            longBreakButton.classList.add('invisible');
        } else {
            focusButton.classList.add('invisible');
            shortBreakButton.classList.add('invisible');
        }
    });

    pauseButton.addEventListener('click', () => {
        clearInterval(intervalID);
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';

        body.classList.remove('body-timer-bg');
        tasksBox.classList.remove('boxes-timer-bg');

        nav.classList.remove('invisible');

        navButtons.forEach(button => {
            button.classList.remove('invisible');
            button.disabled = true;
        });

        timerBox.classList.remove('boxes-timer-bg');

        focusButton.classList.remove('invisible');
        shortBreakButton.classList.remove('invisible');
        longBreakButton.classList.remove('invisible');
    });

    // Initialize the timer as Focus by default
    initializeFocus();
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
                    <form>
                        <input type="hidden" value="${tasks[i].id}" name="id">
                        <input id="check${i}" class="checkboxes" type="checkbox" ${tasks[i].checked ? 'checked' : ''}> <label for="check${i}" class="task-text ${tasks[i].checked ? 'task-text-checked' : ''}">${tasks[i].task}</label>
                    </form>
                `;

                tasksList.appendChild(li);
            }
        }
    })
}



function checkTask() {
    const tasksContainer = document.querySelector('.tasks');

    tasksContainer.addEventListener('change', (event) => {
        if (event.target.matches('.checkboxes')) {
            const taskText = event.target.nextElementSibling;
            const taskID = event.target.previousElementSibling.value;

            if (event.target.checked) {
                taskText.classList.add('task-text-checked');
                fetch('/check/', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: taskID,
                        checked: true
                    })
                });
            } else {
                taskText.classList.remove('task-text-checked');
                fetch('/check/', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: taskID,
                        checked: false
                    })
                });
            }
        }
    });
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
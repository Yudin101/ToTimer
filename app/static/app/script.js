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
    let body = document.querySelector('body');
    const nav = document.querySelector('nav');
    const titleTextLink = document.querySelector('.title-text-link');
    const navButtons = document.querySelectorAll('.nav-ul-button');
    const logoutA = document.querySelector('.logout-a');

    const topButtonsDiv = document.querySelector('.top-buttons-div');
    const topButtons = document.querySelectorAll('.top-button');

    const boxes = document.querySelectorAll('.boxes');
    const timerBox = document.querySelector('.timer-box');
    const tasksBox = document.querySelector('.tasks-box');

	const focusButton = document.querySelector('#focus-button');
    const shortBreakButton = document.querySelector('#short-break-button');
    const longBreakButton = document.querySelector('#long-break-button');    

    const startButton = document.querySelector('#start-button');
    const pauseButton = document.querySelector('#pause-button');
    const timer = document.querySelector('#timer');

    let intervalID;
    let currentMinutes = 25;

    function setButtonStates(selectedButton) {
        [focusButton, shortBreakButton, longBreakButton].forEach(button => {
            button.classList.remove('top-button-selected');
            button.removeAttribute('disabled');
        });

        selectedButton.classList.add('top-button-selected');
        selectedButton.setAttribute('disabled', '');
    }

    function loadTopButtonUI(selectedButton) {
        const topButtonsArr = ['focus', 'short-break', 'long-break'];

        for (var i = 0; i < topButtonsArr.length; i++) {
            body.classList.remove(`${topButtonsArr[i]}-body`);
            boxes.forEach(box => {
                box.classList.remove(`${topButtonsArr[i]}-boxes`);
            });
            topButtons.forEach(button => {
                button.classList.remove(`${topButtonsArr[i]}-top-button`);
            });
        }

        let selectedButtonName;
        if (selectedButton === focusButton) {
            selectedButtonName = 'focus';
        } else if (selectedButton == shortBreakButton) {
            selectedButtonName = 'short-break';
        } else {
            selectedButtonName = 'long-break';
        }

        body.classList.add(`${selectedButtonName}-body`);
        boxes.forEach(box => {
            box.classList.add(`${selectedButtonName}-boxes`);
        })
        topButtons.forEach(button => {
            button.classList.add(`${selectedButtonName}-top-button`);
        });
    }

    // Set initial state to Focus
    function initializeFocus() {
        setButtonStates(focusButton);
        loadTopButtonUI(focusButton);

        currentMinutes = 25;
        timer.textContent = `25:00`;
    }

    focusButton.addEventListener('click', () => {
        setButtonStates(focusButton);
        loadTopButtonUI(focusButton);

        currentMinutes = 25;
        timer.textContent = `25:00`;
    });

    shortBreakButton.addEventListener('click', () => {
        setButtonStates(shortBreakButton);
        loadTopButtonUI(shortBreakButton);

        currentMinutes = 5;
        timer.textContent = `05:00`;
    });

    longBreakButton.addEventListener('click', () => {
        setButtonStates(longBreakButton);
        loadTopButtonUI(longBreakButton);

        currentMinutes = 15;
        timer.textContent = `15:00`;
    });

    function UIReset() {
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';

        body.classList.remove('body-timer-bg');

        tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            task.classList.remove('body-timer-bg');
        });

        tasksBox.classList.remove('boxes-timer-bg');

        nav.classList.remove('invisible');
        titleTextLink.classList.remove('invisible');
        titleTextLink.removeAttribute('onclick');

        navButtons.forEach(button => {
            button.classList.remove('invisible');
            button.disabled = false;
        });

        logoutA.classList.remove('invisible');
        logoutA.removeAttribute('onclick');

        timerBox.classList.remove('boxes-timer-bg');

        topButtons.forEach(button => {
            button.classList.remove('invisible');
            button.classList.remove('boxes-timer-bg');
            button.disabled = false;
        });
    }

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

                UIReset();
            }
        }, 1000);
    }

    startButton.addEventListener('click', () => {
        
        clearInterval(intervalID);
        startTimer(currentMinutes);
        
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';

        body.classList.add('body-timer-bg');

        boxes.forEach(box => {
            box.classList.add('boxes-timer-bg');
        });

        nav.classList.add('invisible');
        titleTextLink.classList.add('invisible');
        titleTextLink.setAttribute('onclick', 'return false;');

        navButtons.forEach(button => {
            button.classList.add('invisible');
            button.disabled = true;
        });

        logoutA.classList.add('invisible');
        logoutA.setAttribute('onclick', 'return false;');

        function updateButtonState(buttons) {
            buttons.forEach(button => {
                button.classList.add('invisible');
                button.disabled = true;
            });
        }

        if (currentMinutes === 25) {
            focusButton.classList.add('boxes-timer-bg');
            updateButtonState([shortBreakButton, longBreakButton]);
        } else if (currentMinutes === 5) {
            shortBreakButton.classList.add('boxes-timer-bg');
            updateButtonState([focusButton, longBreakButton]);
        } else {
            longBreakButton.classList.add('boxes-timer-bg');
            updateButtonState([focusButton, shortBreakButton]);
        }
    });

    pauseButton.addEventListener('click', () => {
        clearInterval(intervalID);
        UIReset();
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
    let body = document.querySelector('body');
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

                li.innerHTML = `
                    <form class="task">
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

# ToTimer

A study timer based on the [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique) with the aim of helping you study and compelete your tasks.


## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Run Locally](#run-locally)
- [Contributing](#contributing)
- [License](#license)
## Features

- Light/dark mode toggle
- Allows adding tasks
- Bring your tasks to your phone


## Usage

1. Add tasks
1. Start timer *(25 minutes)*
1. Start short break *(5 minutes)*
1. Repeat 2-3 for 4 times
1. Start long break *(15 minutes)*
1. Repeat from 1 until all tasks are completed
## Run Locally

**Clone the project**

```bash
git clone https://github.com/Yudin101/ToTimer.git
```

**Go to the project directory**

```bash
cd ToTimer
```

**Install dependencies**

```bash
pip install -r requirements.txt
```

**Setup environment variables**

```bash
echo "SECRET_KEY=your_secret_key" > .env
echo "DEBUG=True" >> .env
```
*Replace `your_secret_key` with an actual secret key. You can generate one using [Django Secret Key Generator](https://djecrety.ir/).*

**Make migrations**

```bash
python manage.py makemigrations app
```

**Apply migrations**

```bash
python manage.py migrate
```

**Create a superuser *(optional)***

```bash
python manage.py createsuperuser
```

**Start the server**

```bash
python manage.py runserver
```
Now, you should be able to see this project running on **http://127.0.0.1:8000**

## Contributing


Contributions are always welcome!

If you’d like to contribute to this project, you can:

- **Create an Issue**: Report bugs or suggest features by [creating an issue](https://github.com/Yudin101/ToTimer/issues/new).
- **Open a Pull Request**: Submit code changes or improvements by [opening a pull request](https://github.com/Yudin101/ToTimer/pulls).

Thank you for your interest in contributing!


## License

This project is licensed under the [MIT License](https://github.com/Yudin101/ToTimer/blob/main/LICENSE).


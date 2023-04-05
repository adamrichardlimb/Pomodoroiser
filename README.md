# Pomodoroiser
A React+Vite+Express.js application for creating Pomodoro timers from YouTube playlists.

To use the Pomodoriser on your local machine:
- Clone the repository to your desired location.
- Add a .env file to /pomodoriser/backend
- In the .env file, put API_KEY = "YOUR_YT_API_KEY" (Find out how to get one here)
- Open two terminals, on one terminal enter /frontend/, and on the other go to /backend/
- In both, run 'npm run dev' (will update when not in development)
- Go to localhost:5173 and enter a YT playlist!

Known bugs:
- The YT playlist page uses ?list and not &list - this makes URL extraction annoying (URLSearchParams seems to not find it - will probably write a regex)
- Running 'npm run' fails because there are no tests specified

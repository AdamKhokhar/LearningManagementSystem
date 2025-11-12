# Architecture Explanation

So the way I built this is pretty straightforward - there's three main parts that all talk to each other. The frontend is what users see and click around on, the backend does all the heavy lifting, and the database stores everything. They all communicate through what's called a REST API, which is basically just a way for the frontend to ask the backend for stuff and get data back.

The frontend is React and runs on port 3000. I've got a few pages - one where users pick if they're a student or instructor, then separate views for each. All of them use this one API file that handles talking to the backend. For editing chapter content, I added a rich text editor so instructors can format their text nicely.

The backend is Django and runs on port 8000. It's got these things called ViewSets that automatically handle creating, reading, updating, and deleting stuff. When data comes in, it gets validated and converted between Python objects and JSON. The cool part is when students ask for chapters, the backend checks the visibility field and only sends back the ones marked as public.

The database is SQLite - it's just a file that stores everything. I've got tables for courses, chapters, enrollments, and users. Each chapter has this visibility thing that can be public or private, which controls who can see it.

Here's how it all works together: when someone does something on the frontend, like joining a course, the React component calls a function that sends a request to the backend. The backend gets it, checks everything's good, saves it to the database, and sends back a response. Then the frontend updates what the user sees. It's basically just passing messages back and forth.

I went with this setup because it keeps things separated nicely. The frontend just worries about showing stuff, the backend handles all the logic, and they don't really depend on each other too much. That means I can change one without breaking the other. Plus, using a REST API is pretty standard, so it's easy to understand and work with.

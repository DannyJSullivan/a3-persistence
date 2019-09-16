## Persistent User Login System

your glitch link e.g. http://a3-dannyjsullivan.glitch.me

In this project I: 
- implemented a persistent database to store my data
- used passport local authentication to authenticate users, as it worked well with the system I created for assignment 2
- used the turret CSS framework, as it is minimalistic and strongly changes the inputs, buttons, and tables, which are a majority of my project.
- the five Express middleware packages you used and a short (one sentence) summary of what each one does.
- implemented 6 forms of middleware

Types of middleware: 
- responseTime, which records the response time of HTTP requests
- session, which creates a session with certain given attributes in the form of a session cookie
- favicon (set up, but not running on glitch since glitch does not allow files to be directly uploaded/linked to), adds the favicon for the tab
- timeout, which times out an HTTP request after a certain period of time (mine is 15 seconds)
- body-parser, which parses request bodies and makes them easily available
- passport, which is used to authenticate users and ensure they are part of the system when logging in

## Technical Achievements
- **Tech Achievement 1**: I used six forms of middleware
- **Tech Achievement 2**: I added the ability to modify a given user's admin status

### Design/Evaluation Achievements
- **Design Achievement 1**: I tested the CSS color scheme for accessibility and color blindness and found no issues
- **Design Achievement 2**: I added pop up windows and redirects for all actions to give the user instant feedback and make it a more intuitive experience
- **Design Achievement 3**: I created and added my own favicon
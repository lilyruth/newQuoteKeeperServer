# Quote Keeper Server

This is the new and better backend of my Nucamp Honors project (https://github.com/lilyruth/pocket-quotes-server) and it utilizes Node JS, Express, Mongoose and MongoDB. 

The front end repo is https://github.com/lilyruth/QuoteKeeperClient

The YouTube demo is: https://youtu.be/qjG5cuszlDo.

The deployed project is at https://quotekeeper.io. 

Users can:
- View quotes without registering
- Register (will receive a confirmation email) 
- Log In
- Log Out
- Save quotes
- View a paginated list of saved quotes
- View individual quotes
- Tweet individual quotes
- Email individual quotes
- Delete individual quotes
- Add their own quotes
- View a random quote from their saved list
- Request a password reset (They receive an email with a temporary password that is hashed in the db and then deleted when a new password is set)
- Reset their password
- Delete their account

Passwords are hashed and salted before being stored in the database. Inputs are checked with regex before being put in the database. 

CORS with options is enabled so only my front end can access the backend. 

One of the interesting challenges for me in the backend was to think about how to serve a batch of quotes instead of having users individually ping Zen Quotes repeatedly via my API. The Zen Quotes API recommends caching a set of 50 quotes and then refreshing those every hour or so. 

I set up a caching system where my API will retrieve 50 quotes from the Zen Quotes API once an hour. My API then deletes the previous batch from the database so that I don't wind up with a backlog of quote batches. My API serves the batch to the front end when requested and the logic to parse out individual quotes is on the front end. 

Another interesting item I had to learn was how to do a password reset. This is handled through a resets route with its own document. A temporary password is generated, emailed to the user and assigned to the password reset document. It expires after 60 minutes. When the user requests a password reset, the temporary password record is generated. When the user attemps to reset the password, that temporary password record is deleted. I do need to figure out how to automate temporary password cleanup. If a user requests a temporary password and then never attempts to reset it, the record is not deleted. 

Because I want people to be able to enjoy this program, I am paying for the hobby level dyno on Heroku so the server isn't sleeping when someone uses my site. Some things I need to start thinking about in the hypothetical event that I start getting a lot of traffic: How to scale? What would enable performance so multiple users can enjoy the site simultaneously. Additionally, I need to look into learning about database backups. 

I really enjoyed learning from this project. Although I've spent more time in front end than backend so far in my learning to code journey, I felt like the backend portion of this was much smoother and more logical for me. It's possible that's because it's a simple backend and my front end is more complex. 

However, one of the things that was a great experience in this project was bringing together both front end and backend. I know that it's common wisdom that devs really aren't full stack: you really specialize in front or backend. But I feel like doing a solid fullstack project really helps me understand the bigger picture, and it's really exciting to have the ability to do both and to feel like I really could specialize in one or the other while also understanding the high level data flow in both. 

I look forward to continuing to improve this project. For example, the next upgrade needs an edit quote route. Additionally, I am at some point going to develop my own quotes API. While Zen Quotes is much appreciated, I'd like to create my own API to be able to have out there. 

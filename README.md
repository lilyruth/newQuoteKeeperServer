# Quote Keeper Server

This is the new and better backend of my Nucamp Honors project (https://github.com/lilyruth/pocket-quotes-server) and it utilizes Node JS, Express, Mongoose and MongoDB 

The front end repo is https://github.com/lilyruth/QuoteKeeperClient

The deployed project is at https://quotekeeper.io. 

Users can:
-View quotes without registering
-Register (will receive a confirmation email) 
-Log In
-Log Out
-Save quotes
-View a paginated list of saved quotes
-View individual quotes
-Tweet individual quotes
-Email individual quotes
-Delete individual quotes
-Add their own quotes
-View a random quote from their saved list
-Request a password reset (They receive an email with a temporary password that is hashed in the db and then deleted when a new password is set)
-Reset their password
-Delete their account

Passwords are hashed and salted before being stored in the database. Inputs are checked before being put in the database. 


# Quote Keeper Server

This is the new and better backend of my Nucamp Honors project and it utilizes Node JS, Express, Mongoose and MongoDB (https://github.com/lilyruth/pocket-quotes-server)

The front end repo is https://github.com/lilyruth/QuoteKeeperClient

The deployed project is at https://quotekeeper.io. 

Users can:
-View quotes without registering
-Register (will receive a confirmation email) 
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


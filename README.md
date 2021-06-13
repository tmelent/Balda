# Balda

## Server-side:
##### - TypeScript
##### - Node.js
##### - Express | Apollo Server Express 
##### - TypeORM
##### - PostgreSQL, Redis
##### - GraphQL, TypeGraphQL
##### - Socket.IO (front too)

## Client-side:
##### - TypeScript
##### - Next.js
##### - React.js
##### - GraphQL Code Generator
##### - Sass
##### - URQL
##### - Formik

## Testing:
##### - Jest (ts-jest)
##### - Faker

## Project idea

"Balda" is a simple, but interesting game, which is played (usually) on 5x5 field. Each cell of the field can contain one character. 
Game begins with 5-letter word in middle of the field: 

![game created](https://github.com/tmelent/balda/blob/master/github_screenshots/genfield.png?raw=true)

Every turn player has to add a letter in an empty field and connect existing letters with this one to make a word.


Here, for example, I added 'R' in empty cell and connected letters [p, e, e, r] in special order to make word 'peer'
Peer has 4 letters, contains new letter in it, so it's four points to me.

Game lasts until every field is filled. 

Connections can be only vertical or horizontal.


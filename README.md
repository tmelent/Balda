# Balda

## Back-end
##### - Node.js
##### - TypeScript
##### - Express | Apollo Server Express 
##### - TypeORM
##### - PostgreSQL
##### - Redis
##### - GraphQL w/TypeGraphQL
##### - Socket.IO

## Front-end:
##### - TypeScript
##### - Next.js
##### - React.js
##### - GraphQL Code Generator
##### - Sass (SCSS)
##### - ~~URQL~~ Apollo Client
##### - Formik
##### - React-icons

## Testing:
##### - Jest (ts-jest)
##### - Faker


## Deploy:
##### Docker
##### Google Cloud
##### Vercel

Hosted on here: https://game.balda.tk/

## Project idea

"Balda" is a simple, but interesting game, which is played (usually) on 5x5 field. Each cell of the field can contain one character. 
Game begins with 5-letter word in middle of the field: 

![game created](https://github.com/tmelent/balda/blob/master/github_screenshots/genfield.PNG?raw=true)

Every turn player has to add a letter in an empty field and connect existing letters with this one to make a word.

![turn](https://github.com/tmelent/balda/blob/master/github_screenshots/turn.PNG?raw=true)

If the word exists, the player gets points equal to the length of the entered word.

![scoretable_footer](https://github.com/tmelent/balda/blob/master/github_screenshots/scoretable_footer.PNG?raw=true)

Game lasts until every field is filled. 

Connections can be only vertical or horizontal.

If you want to see more screenshots, go to the github_screenshots folder in root folder.

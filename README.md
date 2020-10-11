# Blackjack-Game

- Initiate a game resource object.
- Add event listeners to the game buttons and assign relevant functions.
- Define a variable named card which will be assigned to a function that chooses a random card from the card images.
- Write a show card function that is responsible for putting random card images on the card image div.
- An update score function that shows the players' scores as the game continues.
- Write some deciding-winner function that implements the blackjack logic of choosing the right winner according to the scores. This function will only be concerned with the game logic for the computer and will not be responsible for showing the results.
- Write a show-result function to use the deciding-winner function logic, to put the necessary changes on the front.
- Write an async function for the stand button so that bot choice cards are displayed simultaneously without need for interference by the user.
- Write a clean up function for the deal button which should reset every change made in the course of the game,  excluding the results table.
- Define and implement the state control variables to ensure that: 
    - the hit button doesnt work again after the stand button has been initiated.
    - the deal button doesnt work before the hit and stand buttons have been used.
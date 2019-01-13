const Teams = require('./teams');
const Pizzas = require('./pizzas');

const teams = new Teams();
const pizzas = new Pizzas();

function containsPizza(array, pizza) {
    for (let i = 0; i < array.length; ++i) {
        if (array[i].name === pizza.name) {
            return true;
        }
    }
    return false;
}

function countOfVegetarianPieces(teamname) {
    let team = teams.get(teamname);
    if (team.teamSize.type === 'persons') {
        return Math.ceil(team.vegetarian / 4) * 16;
    } else {
        return team.vegetarian;
    }
}

function countOfVegetarianPizzas(teamname) {
    let team = teams.get(teamname);
    if (team.teamSize.type === 'persons') {
        return Math.ceil(team.vegetarian / 4);
    } else {
        return Math.ceil(team.vegetarian / 16);
    }
}

function countOfNoPorkPieces(teamname) {
    let team = teams.get(teamname);
    if (team.teamSize.type === 'persons') {
        return Math.ceil(team.noPork / 4) * 16;
    } else {
        return team.noPork;
    }
}

function countOfNoPorkPizzas(teamname) {
    let team = teams.get(teamname);
    if (team.teamSize.type === 'persons') {
        return Math.ceil(team.noPork / 4);
    } else {
        return Math.ceil(team.noPork / 16);
    }
}

function getSuggestionsOfTeamOrdered(teamname) {
    let suggestions = pizzas.getPizzaSuggestionsOfTeam(teamname);
    suggestions.sort((a, b) => {
        return b.vote - a.vote;
    });
    return suggestions;
}

module.exports = class Solver {
    /**
     * Calculates an order using the votes, vegetarian and noPork properties of the suggestions regarding pieces mode
     * @param {*} teamname - The name of the team
     * @returns A array of suggestions which should be ordered
     */
    solveForPieces(teamname) {
        let numberOfVegetarianPizzaPiecesNeeded = countOfVegetarianPieces(teamname);
        let numberOfVegetarianPizzaPiecesinOrder = 0;
        let numberOfNoPorkPizzaPiecesNeeded = countOfNoPorkPieces(teamname);
        let numberOfNoPorkPizzaPiecesinOrder = 0;
        let numberOfPizzaPartsNeeded = team.get(teamname).pizzaCount * 2;
        let numberOfPizzaPiecesNeeded = numberOfPizzaPartsNeeded * 16;
        let suggestions = getSuggestionsOfTeamOrdered(teamname);
        let order = [];

        // First add enough vegetarian pizza pieces
        for (let i = 0; i < suggestions.length; ++i) {
            // Pizza is vegetarian and we need at least one more
            if (suggestions[i].vegetarian && numberOfVegetarianPizzaPiecesinOrder < numberOfVegetarianPizzaPiecesNeeded) {
                order.push(suggestions[i]);
                numberOfVegetarianPizzaPiecesinOrder += 8;
            }
        }

        // Check if enough vegetarian pizzas are in the order, else throw Error
        if (numberOfVegetarianPizzaPiecesNeeded > numberOfVegetarianPizzaPiecesinOrder) {
            throw new Error('There are not enough vegetarian pizzas');
        }

        // Add noPork pizza pieces regarding remaining vegetarian pizza pieces
        let noPorkVegetarianPizzaPieces = numberOfVegetarianPizzaPiecesinOrder - numberOfVegetarianPizzaPiecesNeeded;
        numberOfNoPorkPizzaPiecesinOrder += noPorkVegetarianPizzaPieces;

        // Second add enough noPork pizzas
        for (let i = 0; i < suggestions.length; ++i) {
            // Pizza is vegetarian or has no pork and we need at least one more
            if ((suggestions[i].vegetarian || !suggestions[i].pork) && numberOfNoPorkPizzaPiecesinOrder < numberOfNoPorkPizzaPiecesNeeded) {
                // Only add if pizza is not already in order
                if (!containsPizza(order, suggestions[i])) {
                    order.push(suggestions[i]);
                    numberOfNoPorkPizzaPiecesinOrder += 8;
                }
            }
        }

        // Check if enough no pork pizzas are in the order, else throw Error
        if (numberOfNoPorkPizzaPartsNeeded > numberOfNoPorkPizzaPartsInOrder) {
            throw new Error('There are not enough no pork pizzas');
        }

        // At last fill with remaining pizzas
        for (let i = 0; i < suggestions.length; ++i) {
            if (order.length * 16 < numberOfPizzaPiecesNeeded && !containsPizza(order, suggestions[i])) {
                order.push(suggestions[i]);
            }
        }

        // Check if enough vegetarian pizzas are in the order, else throw Error
        if (numberOfPizzaPiecesNeeded > order.length * 16) {
            throw new Error('There are not enough pizzas');
        }
        return order;

    }

    /**
     * Calculates an order using the votes, vegetarian and noPork properties of the suggestions regarding persons mode
     * @param {*} teamname - The name of the team
     * @returns A array of suggestions which should be ordered
     */
    solveForPersons(teamname) {
        let numberOfVegetarianPizzaPartsNeeded = countOfVegetarianPizzas(teamname) * 2;
        let numberOfVegetarianPizzaPartsInOrder = 0;
        let numberOfNoPorkPizzaPartsNeeded = countOfNoPorkPizzas(teamname) * 2;
        let numberOfNoPorkPizzaPartsInOrder = 0;
        let numberOfPizzaPartsNeeded = teams.get(teamname).pizzaCount * 2;
        let suggestions = getSuggestionsOfTeamOrdered(teamname);
        let order = [];

        // First add enough vegetarian pizzas
        for (let i = 0; i < suggestions.length; ++i) {
            // Pizza is vegetarian and we need at least one more
            if (suggestions[i].vegetarian && numberOfVegetarianPizzaPartsInOrder < numberOfVegetarianPizzaPartsNeeded) {
                order.push(suggestions[i]);
                numberOfVegetarianPizzaPartsInOrder++;
            }
        }

        // Check if enough vegetarian pizzas are in the order, else throw Error
        if (numberOfVegetarianPizzaPartsNeeded > numberOfVegetarianPizzaPartsInOrder) {
            throw new Error('There are not enough vegetarian pizzas');
        }

        // Second add enough noPork pizzas
        for (let i = 0; i < suggestions.length; ++i) {
            // Pizza is vegetarian or has no pork and we need at least one more
            if ((suggestions[i].vegetarian || !suggestions[i].pork) && numberOfNoPorkPizzaPartsNeeded > numberOfNoPorkPizzaPartsInOrder) {
                // Only add if pizza is not already in order
                if (!containsPizza(order, suggestions[i])) {
                    order.push(suggestions[i]);
                    numberOfNoPorkPizzaPartsInOrder++;
                }
            }
        }

        // Check if enough no pork pizzas are in the order, else throw Error
        if (numberOfNoPorkPizzaPartsNeeded > numberOfNoPorkPizzaPartsInOrder) {
            throw new Error('There are not enough no pork pizzas');
        }

        // At last fill with remaining pizzas
        for (let i = 0; i < suggestions.length; ++i) {
            if (order.length < numberOfPizzaPartsNeeded && !containsPizza(order, suggestions[i])) {
                order.push(suggestions[i]);
            }
        }

        // Check if enough vegetarian pizzas are in the order, else throw Error
        if (numberOfPizzaPartsNeeded > order.length) {
            throw new Error('There are not enough pizzas');
        }
        return order;
    }
}
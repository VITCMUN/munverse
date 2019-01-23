//throws error finding a pre-inserted entry.

const assert = require('assert');
const Pokemon = require('../models/council.model');
let poke;
// beforeEach(() => {
//     poke = new Pokemon({  council_name: 'c1',council_banner_path:'p1' });
//     poke.save()
//         .then(() => done());
// });
describe('Reading pokemon details', () => {
    it('finds pokemon with the name of poke', (done) => {
        Pokemon.findOne({ name: 'Pickachu' })
            .then((pokemon) => {
                assert(poke.name === 'Pickachu' );
                done();
            });
    })
})

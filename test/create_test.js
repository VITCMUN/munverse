const assert = require('assert');
const councildb = require('../models/council.model'); //imports the council model.
describe('Creating documents', () => {
    it('Creates a council', (done) => {
        const db_check = new councildb({ council_name: 'DISEC',council_banner_path:'PATH1' });
        db_check.save() //takes some time and returns a promise
            .then(() => {
                assert(!db_check.isNew); //if db_check is saved to db it is not new
                done();
            });
    });
});

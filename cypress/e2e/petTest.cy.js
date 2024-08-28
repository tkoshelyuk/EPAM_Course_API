import pet from '../fixtures/pet.json'
import { faker } from '@faker-js/faker';
import user from '../fixtures/user.json'
import users from '../fixtures/users.json'

pet.id = faker.number.int({ min: 10000000000000, max: 1000000000000000})
pet.name = faker.animal.dog();
user.id = faker.number.int({ min: 1000, max: 10000000});
user.username = faker.animal.dog();
user.email = faker.internet.email({ firstName: 'Jeanne', lastName: 'Doe', provider: 'some.fakeMail.qa', allowSpecialCharacters: false });


describe('PetStore test suit', () => {
    let petId;
    let date;

    it('Create user', () => {
        cy.request('POST', '/user', user).then(response => {
            expect(response.status).to.be.equal(200);

            cy.request(`/user/${user.username}`).then(response => {
                expect(response.status).to.be.equal(200);
                expect(response.body.email).to.be.equal(user.email);
            })

        })
    })

    it('Create users with array', () => {
        cy.request('POST', 'user/createWithArray', users).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body.message).to.be.equal("ok");

        })
    })

    it('User login and logout', () => {
        cy.request(`/user/login/?username=${user.email}&password=${user.password}`).then(response => {
            expect(response.status).to.be.equal(200);

            cy.request(`/user/logout`).then(response => {
                expect(response.status).to.be.equal(200);
            })

        })
    })

    it('Create pet', () => {
        cy.request('POST', '/pet', pet).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body.name).to.be.equal(pet.name);

            // example for extracting values from body and headers
            petId = response.body.id;
            date = response.headers.date;

            cy.log(pet.id);
            cy.log(petId);

            cy.request(`/pet/${petId}`).then(response => {
                expect(response.status).to.be.equal(200);
                expect(response.body.name).to.be.equal(pet.name);
            })
        })
    })

    it('Get pet by id', () => {
        cy.request(`/pet/${petId}`).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body.name).to.be.equal(pet.name);
        })
    })

    it('Update pet', () => {
        pet.status = 'pending';
        pet.name = faker.animal.dog();
        pet.status = "available";
        pet.photoUrls[0] = "custom";

        cy.request({
            method: 'PUT',
            url: '/pet',
            body: pet,
        }).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body.name).to.be.equal(pet.name);
            expect(response.body.status).to.be.equal(pet.status);
            expect(response.body.photoUrls[0]).to.be.equal(pet.photoUrls[0]);



            cy.request(`/pet/${petId}`).then(response => {
                expect(response.status).to.be.equal(200);
                expect(response.body.name).to.be.equal(pet.name);
                expect(response.body.status).to.be.equal(pet.status);
                expect(response.body.photoUrls[0]).to.be.equal(pet.photoUrls[0]);

            })
        })
    })


   it ('Delete pet', () => {


        cy.request({
            method: 'DELETE',
            url: `/pet/${petId}`,
            body: pet
        }).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body.code).to.be.equal(200);
            expect(response.body.message).to.be.equal(`${petId}`);
            expect(response.body.type).to.be.equal('unknown');


        })
    })
})

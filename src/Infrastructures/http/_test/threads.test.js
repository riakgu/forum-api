const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");


describe('/threads endpoint', () => {
    let accessToken;

    beforeAll(async () => {
        const server = await createServer(container);

        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'riakgu',
                password: 'rahasia',
                fullname: 'riakgu',
            },
        });

        const loginResponse = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'riakgu',
                password: 'rahasia',
            },
        });

        const { data } = JSON.parse(loginResponse.payload);
        accessToken = data.accessToken;
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'Thread title',
                body: 'Thread body',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'Thread title',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 'Thread title',
                body: ['Thread body'],
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });
    });
});
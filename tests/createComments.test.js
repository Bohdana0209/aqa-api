import {test, describe, expect} from '@jest/globals';
import axios from 'axios';
import { API_URL } from '../src/constants/api';

describe.skip("Comments", () =>{
    const apiClient = axios.create({
        baseURL: API_URL
    })
    test.skip("Should be able to create a Comment", async () =>{
        const requestBody ={
            "postId": 2,
            "id": 7,
            "name": "repellat consequatur praesentium vel minus molestias voluptatum",
            "email": "Dallas@ole.me",
            "body": "maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor"
        }
    const response = await apiClient.post('/comments', requestBody);
    const comment = response.data;

     expect(response.status).toBe(201);

     expect(comment).toEqual({
         ...requestBody,
        id: expect.any(Number)
    })
    })

    test.skip("Should be able to create a Comment only with name", async () =>{
        const requestBody ={
            "name": "alias odio sit",
        }
    const response = await apiClient.post('/comments', requestBody);
    const comment = response.data;

     expect(response.status).toBe(201);

     expect(comment).toMatchObject({
         id: expect.any(Number),
         ...requestBody
        
    })
    })
})
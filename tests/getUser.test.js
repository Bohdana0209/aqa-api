import {expect, describe, test} from '@jest/globals';
import axios from 'axios';
import { API_URL } from '../src/constants/api';

describe("Users", () =>{
    const apiClient = axios.create({
        baseURL: API_URL
    })

test('Return user by id', async () => {
    const userId = 1;

    const response = await apiClient(`/users/${userId}`);

    expect(response.status).toBe(200);

    expect(response.data).toMatchObject({
        id: userId,
        name: expect.any(String),
        username: expect.any(String),
      })
})

test('Return 10 users', async () => {
    const response = await apiClient(`/users`);

    expect(response.status).toBe(200);

    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(10);
})
})
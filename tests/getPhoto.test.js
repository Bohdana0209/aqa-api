import {expect, test} from '@jest/globals';
import axios from 'axios';
import { API_URL } from '../src/constants/api';

const apiClient = axios.create({
        baseURL: API_URL
    })

test.skip('Return photo by id', async () => {
    const photoId = 7;

    const response = await apiClient(`/photos/${photoId}`);

    expect(response.status).toBe(200);

    expect(response.data).toMatchObject({
        id: photoId,
        albumId: expect.any(Number),
        title: expect.any(String),
      })
})
import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import HttpStatusCode from '@/utils/HTTPStatusCodes';

describe('Test the API Status', () => {
  test('It should response the root GET method', async () => {
    const response = await request(app).get(parseAPIVersion(1));
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.name).toEqual(appConfig.apiName);
    expect(response.body.version).toEqual(appConfig.apiVersion);
    expect(response.body.status).toEqual('RUNNING');
  });
});

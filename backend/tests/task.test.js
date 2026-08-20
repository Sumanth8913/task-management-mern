const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;

const registerAndLogin = async (app, email) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'User', email, password: 'password123' });
  return res.body.data.token;
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = 'test_secret';
  process.env.JWT_EXPIRES_IN = '1h';
  await mongoose.connect(process.env.MONGO_URI);
  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
});

describe('Tasks', () => {
  it('creates and reads back a task for the authenticated user', async () => {
    const token = await registerAndLogin(app, 'a@example.com');
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Buy milk', priority: 'LOW' });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.tasks).toHaveLength(1);
    expect(listRes.body.meta.total).toBe(1);
  });

  it('updates a task and stamps completedAt only once', async () => {
    const token = await registerAndLogin(app, 'b@example.com');
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ship feature' });
    const id = createRes.body.data.task._id;

    const doneRes = await request(app)
      .patch(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'DONE' });
    expect(doneRes.body.data.task.completedAt).not.toBeNull();

    const stillDoneRes = await request(app)
      .patch(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ priority: 'HIGH' });
    expect(stillDoneRes.body.data.task.completedAt).toBe(doneRes.body.data.task.completedAt);
  });

  it('deletes a task', async () => {
    const token = await registerAndLogin(app, 'c@example.com');
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Temp task' });
    const id = createRes.body.data.task._id;

    const delRes = await request(app).delete(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    const getRes = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });

  it('prevents a user from accessing another user\'s task (ownership check)', async () => {
    const tokenA = await registerAndLogin(app, 'ownerA@example.com');
    const tokenB = await registerAndLogin(app, 'ownerB@example.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Private task' });
    const id = createRes.body.data.task._id;

    const readAsB = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${tokenB}`);
    expect(readAsB.status).toBe(404);

    const updateAsB = await request(app)
      .patch(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hijacked' });
    expect(updateAsB.status).toBe(404);

    const deleteAsB = await request(app).delete(`/api/tasks/${id}`).set('Authorization', `Bearer ${tokenB}`);
    expect(deleteAsB.status).toBe(404);
  });

  it('filters tasks by status and priority', async () => {
    const token = await registerAndLogin(app, 'd@example.com');
    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'A', status: 'PENDING', priority: 'HIGH' });
    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'B', status: 'DONE', priority: 'LOW' });

    const res = await request(app)
      .get('/api/tasks?status=DONE&priority=LOW')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].title).toBe('B');
  });

  it('paginates results and caps the page size', async () => {
    const token = await registerAndLogin(app, 'e@example.com');
    for (let i = 0; i < 5; i += 1) {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: `Task ${i}` });
    }

    const res = await request(app)
      .get('/api/tasks?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.tasks).toHaveLength(2);
    expect(res.body.meta.total).toBe(5);
    expect(res.body.meta.totalPages).toBe(3);
    expect(res.body.meta.hasNextPage).toBe(true);
  });

  it('rejects invalid query params gracefully instead of crashing', async () => {
    const token = await registerAndLogin(app, 'f@example.com');
    const res = await request(app)
      .get('/api/tasks?page=-5&limit=99999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBeLessThanOrEqual(50);
  });

  it('rejects protected routes with an invalid JWT', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});

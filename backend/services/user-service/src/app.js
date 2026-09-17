const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const UserModel = require('./models/userModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

async function seedDefaultUsers() {
  try {
    const existing = await UserModel.findAll();
    if (existing.length === 0) {
      await UserModel.create({ name: 'Alex Johnson', email: 'alex@quantiphi.com' });
      await UserModel.create({ name: 'Sarah Miller', email: 'sarah@quantiphi.com' });
      await UserModel.create({ name: 'David Chen', email: 'david@quantiphi.com' });
      await UserModel.create({ name: 'Emma Watson', email: 'emma@quantiphi.com' });
      console.log('[User Service] Seeded default team users.');
    }
  } catch (err) {
    console.error('[User Service Seed Error]', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`[User Service] Running on port ${PORT}`);
  await seedDefaultUsers();
});

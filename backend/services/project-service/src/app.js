const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const ProjectModel = require('./models/projectModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

async function seedDefaultProject() {
  try {
    const existing = await ProjectModel.findAll();
    if (existing.length === 0) {
      const defaultProj = await ProjectModel.create({
        name: 'Vibe Task Manager',
        description: 'Quantiphi core productivity and task management platform'
      });
      console.log('[Project Service] Seeded default project:', defaultProj.name);
    }
  } catch (err) {
    console.error('[Project Service Seed Error]', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`[Project Service] Running on port ${PORT}`);
  await seedDefaultProject();
});

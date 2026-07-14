const fs = require('fs');
const data = JSON.parse(fs.readFileSync('api-docs.json', 'utf8'));
for (const [name, schema] of Object.entries(data.components && data.components.schemas || {})) {
  console.log('SCHEMA', name);
  console.log(Object.keys(schema.properties || {}).slice(0, 40).join(', '));
  console.log('---');
}

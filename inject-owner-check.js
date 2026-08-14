const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src', 'actions');
const files = [
  'products.ts', 'classes.ts', 'categories.ts', 
  'services.ts', 'settings.ts', 'gallery.ts', 'coupons.ts', 'admin.ts'
];

for (const file of files) {
  const filePath = path.join(actionsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add import if not exists
  if (!content.includes('import { checkOwner } from "@/lib/check-owner"')) {
    content = content.replace('"use server";\n', '"use server";\n\nimport { checkOwner } from "@/lib/check-owner";\n');
  }

  // Inject checkOwner into mutation functions
  const mutationRegex = /export async function (create|update|delete|upsert)[A-Z][a-zA-Z0-9_]*\([^)]*\)\s*\{/g;
  
  content = content.replace(mutationRegex, (match) => {
    return match + '\n  await checkOwner();\n';
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}

import { mkdir, rename } from 'fs/promises';
import { dirname, basename, join } from 'path';
import { glob } from 'glob';

async function reorganizeComponents() {
  // Get all .tsx files except main.tsx and App.tsx at root level
  const files = await glob('src/**/*.tsx');
  
  // Filter out root level App.tsx and main.tsx, and exclude test files
  const componentFiles = files.filter(f => 
    !f.endsWith('.test.tsx') && 
    !f.endsWith('.spec.tsx') &&
    !f.endsWith('src/App.tsx') &&
    !f.endsWith('src/main.tsx')
  );
  
  for (const file of componentFiles) {
    const dir = dirname(file);
    const filename = basename(file, '.tsx');
    
    // Skip if already in a directory with the same name
    if (basename(dir) === filename) {
      console.log(`Skipping ${file} - already in correct structure`);
      continue;
    }
    
    // Create new directory
    const newDir = join(dir, filename);
    await mkdir(newDir, { recursive: true });
    
    // Move component file
    const newPath = join(newDir, `${filename}.tsx`);
    await rename(file, newPath);
    console.log(`Moved ${file} -> ${newPath}`);
    
    // Check for test file
    const testFile = file.replace('.tsx', '.test.tsx');
    if (files.includes(testFile)) {
      const newTestPath = join(newDir, `${filename}.test.tsx`);
      await rename(testFile, newTestPath);
      console.log(`Moved ${testFile} -> ${newTestPath}`);
    }
  }
  
  console.log('Reorganization complete!');
}

reorganizeComponents().catch(console.error);

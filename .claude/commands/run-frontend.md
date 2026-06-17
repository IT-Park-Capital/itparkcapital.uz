# Run Baytech Frontend

Build the baytech frontend project, check for errors, fix them if any, then run the dev server.

## Steps

1. **Install dependencies** (if needed):
   ```bash
   cd baytech && npm install
   ```

2. **Build the project** to check for errors:
   ```bash
   cd baytech && npm run build 2>&1
   ```

3. **If build errors exist**:
   - Read the error output carefully
   - Identify the source files causing errors
   - Fix each error following the project's coding standards (see `.claude/rules/client-side/`)
   - Re-run `npm run build` to verify fixes
   - Repeat until build succeeds with zero errors

4. **If build succeeds with no errors**:
   - Run the dev server:
     ```bash
     cd baytech && npm run dev
     ```
 
## Important
- Do NOT skip errors or suppress warnings that indicate real issues
- Follow the frontend rules in `.claude/rules/client-side/best-practices.md`
- Use named exports, no `any` types, no `default export`
- After fixing errors, always rebuild to confirm the fix before running dev
 
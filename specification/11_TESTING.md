# Orbit Studio — Testing & QA Specification

## Version 1.0

---

## 1. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Functions, hooks, utilities |
| Component | Vitest + Testing Library | React components |
| Integration | Vitest + MSW | API routes, tRPC |
| E2E | Playwright | User flows |
| AI | Vitest + fixtures | Agent pipeline outputs |
| Visual | Storybook | UI components |

## 2. Unit Testing

### 2.1 Utility Tests
```typescript
// packages/canvas/src/__tests__/canvas-utils.test.ts
describe('Canvas Utils', () => {
  it('should generate unique node ids', () => {
    expect(generateNodeId()).toMatch(/^node_[a-z0-9]+$/);
  });

  it('should calculate node positions for auto-layout', () => {
    const nodes = createSampleNodes();
    const layout = autoLayout(nodes);
    expect(layout[0].position.x).toBeGreaterThanOrEqual(0);
  });
});
```

### 2.2 AI Agent Tests
```typescript
// packages/agents/src/__tests__/planner.test.ts
describe('Planner Agent', () => {
  it('should extract project scope from prompt', async () => {
    const result = await planner.run({
      prompt: 'Build a real-time chat app with WebSockets',
    });
    expect(result.scope.complexity).toBe('moderate');
    expect(result.architecture.pattern).toBe('event-driven');
  });

  it('should handle empty prompts gracefully', async () => {
    await expect(planner.run({ prompt: '' }))
      .rejects.toThrow('Prompt is required');
  });
});
```

## 3. Component Testing

```typescript
// apps/web/src/components/canvas/__tests__/Canvas.test.tsx
describe('Canvas Component', () => {
  it('should render with initial nodes', () => {
    render(<Canvas projectId="test-id" />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('should add node on drag from library', async () => {
    render(<Canvas projectId="test-id" />);
    const nodeItem = screen.getByText('API Gateway');
    fireEvent.dragStart(nodeItem);
    // Simulate drop on canvas
    expect(await screen.findByText('API Gateway')).toBeInTheDocument();
  });
});
```

## 4. E2E Testing

```typescript
// tests/e2e/architecture-flow.spec.ts
test('User creates architecture from prompt', async ({ page }) => {
  // Sign in
  await page.goto('/sign-in');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');

  // Create project
  await page.click('text=New Project');
  await page.fill('[name="name"]', 'Healthcare API');
  await page.click('button:has-text("Create")');

  // AI generate architecture
  await page.click('text=AI Architect');
  await page.fill('[data-testid="ai-prompt"]', 'Build a healthcare platform with microservices');
  await page.click('button:has-text("Generate")');

  // Wait for AI generation
  await expect(page.locator('[data-testid="agent-pipeline"]')).toBeVisible();
  await expect(page.locator('[data-testid="canvas-node"]').first()).toBeVisible({ timeout: 30000 });
});
```

## 5. AI Agent Testing Strategy

### 5.1 Fixture-Based Testing
- Store known input/output pairs
- Test against fixed LLM responses
- Validate output schema compliance

### 5.2 Schema Validation Tests
```typescript
describe('Agent Output Schemas', () => {
  it('Planner output should match schema', () => {
    const result = mockPlannerOutput();
    const parsed = PlannerOutputSchema.parse(result);
    expect(parsed).toBeDefined();
  });
});
```

### 5.3 Cost & Performance Tests
```typescript
describe('AI Pipeline Performance', () => {
  it('should complete pipeline under 15 seconds', async () => {
    const start = Date.now();
    await pipeline.run({ prompt: 'Test architecture' });
    expect(Date.now() - start).toBeLessThan(15000);
  });

  it('should not exceed token budget', async () => {
    const result = await pipeline.run({ prompt: 'Test' });
    expect(result.totalTokens).toBeLessThan(10000);
  });
});
```

## 6. Coverage Targets

| Category | Target |
|----------|--------|
| Unit tests | 80%+ |
| Component tests | 70%+ |
| Integration tests | 60%+ |
| Critical paths (E2E) | 100% |

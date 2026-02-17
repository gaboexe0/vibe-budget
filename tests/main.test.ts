import { describe, it, expect } from 'vitest';
import { detectTasks } from '../src/contracts.js';
import { charsToTokens, countStringTokens } from '../src/core/tokenizer.js';

describe('Task Detection', () => {
  it('should detect React Native only', () => {
    const tasks = detectTasks('react native app');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('react_native');
    expect(taskIds).not.toContain('flutter_app');
  });

  it('should detect Flutter only', () => {
    const tasks = detectTasks('flutter app');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('flutter_app');
    expect(taskIds).not.toContain('react_native');
  });

  it('should detect both when both mentioned', () => {
    const tasks = detectTasks('react native and flutter app');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('react_native');
    expect(taskIds).toContain('flutter_app');
  });

  it('should detect OAuth only', () => {
    const tasks = detectTasks('oauth login');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('oauth_openid');
    expect(taskIds).not.toContain('auth');
  });

  it('should detect Authentication only', () => {
    const tasks = detectTasks('user authentication system');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('auth');
    expect(taskIds).not.toContain('oauth_openid');
  });

  it('should detect OAuth when both mentioned', () => {
    const tasks = detectTasks('oauth openid authentication');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('oauth_openid');
    expect(taskIds).toContain('auth');
  });

  it('should detect REST API', () => {
    const tasks = detectTasks('build a REST API');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('rest_api');
  });

  it('should detect Docker container', () => {
    const tasks = detectTasks('docker container');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('docker_container');
  });

  it('should detect LangChain agent', () => {
    const tasks = detectTasks('langchain agent');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('langchain_agent');
  });

  it('should detect multiple tasks', () => {
    const tasks = detectTasks('nextjs app with docker and postgresql');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('nextjs_app');
    expect(taskIds).toContain('docker_container');
    expect(taskIds).toContain('postgresql_prisma');
  });

  it('should return tasks for unknown input', () => {
    const tasks = detectTasks('xyz unknown project');
    expect(tasks.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle case insensitivity', () => {
    const tasksLower = detectTasks('react native app');
    const tasksUpper = detectTasks('REACT NATIVE APP');
    const tasksMixed = detectTasks('React Native App');

    expect(tasksLower.map(t => t.task)).toContain('react_native');
    expect(tasksUpper.map(t => t.task)).toContain('react_native');
    expect(tasksMixed.map(t => t.task)).toContain('react_native');
  });

  it('should prefer React Native over Flutter when only React mentioned', () => {
    const tasks = detectTasks('react native mobile app');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('react_native');
    expect(taskIds).not.toContain('flutter_app');
  });

  it('should prefer OAuth over generic auth when oauth mentioned', () => {
    const tasks = detectTasks('oauth2 implementation');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('oauth_openid');
    expect(taskIds).not.toContain('auth');
  });

  it('should keep both when both mobile frameworks explicitly mentioned', () => {
    const tasks = detectTasks('react native and flutter apps');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('react_native');
    expect(taskIds).toContain('flutter_app');
  });
});

describe('Tokenizer', () => {
  it('should convert chars to tokens correctly', () => {
    expect(charsToTokens(100)).toBe(25);
    expect(charsToTokens(400)).toBe(100);
    expect(charsToTokens(0)).toBe(0);
  });

  it('should handle string token counting', () => {
    const tokens = countStringTokens('hello world');
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle empty string', () => {
    expect(countStringTokens('')).toBe(0);
  });

  it('should handle long strings', () => {
    const longString = 'a'.repeat(10000);
    const tokens = countStringTokens(longString);
    expect(tokens).toBeGreaterThan(2000);
  });

  it('should handle unicode characters', () => {
    const tokens = countStringTokens('hola mundo 你好 🔥');
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle code-like strings', () => {
    const code = 'function test() { return "hello"; }';
    const tokens = countStringTokens(code);
    expect(tokens).toBeGreaterThan(0);
  });

  it('should handle strings with only whitespace', () => {
    const tokens = countStringTokens('   ');
    expect(tokens).toBe(1);
  });

  it('should handle very short strings', () => {
    const tokens = countStringTokens('a');
    expect(tokens).toBeGreaterThanOrEqual(1);
  });
});

describe('Advanced Task Detection', () => {
  it('should detect database tasks', () => {
    const tasks = detectTasks('postgresql database setup');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('postgresql_prisma');
  });

  it('should detect Kubernetes', () => {
    const tasks = detectTasks('kubernetes deployment');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('kubernetes_deploy');
  });

  it('should detect GraphQL API', () => {
    const tasks = detectTasks('graphql api');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('graphql_api');
  });

  it('should detect NextAuth', () => {
    const tasks = detectTasks('nextauth setup');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('nextauth');
  });

  it('should detect Stripe payment', () => {
    const tasks = detectTasks('stripe payment integration');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('stripe_payment');
  });

  it('should detect RAG system', () => {
    const tasks = detectTasks('rag system with vector database');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('rag_system');
  });

  it('should detect Terraform IaC', () => {
    const tasks = detectTasks('terraform infrastructure');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('terraform_iac');
  });

  it('should detect GitHub Actions', () => {
    const tasks = detectTasks('github actions workflow');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('github_actions');
  });

  it('should detect Playwright E2E tests', () => {
    const tasks = detectTasks('playwright e2e tests');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('playwright_e2e');
  });

  it('should detect SEO optimization', () => {
    const tasks = detectTasks('seo optimization');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('seo_optimization');
  });

  it('should detect Serverless Lambda', () => {
    const tasks = detectTasks('aws lambda serverless');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('serverless_lambda');
  });

  it('should detect Redis cache', () => {
    const tasks = detectTasks('redis cache setup');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('redis_cache');
  });
});

describe('Token Estimation', () => {
  it('should estimate tokens for landing page', () => {
    const tasks = detectTasks('landing page');
    expect(tasks.length).toBeGreaterThan(0);
    const landingTask = tasks.find(t => t.task === 'landing');
    expect(landingTask).toBeDefined();
  });

  it('should estimate tokens for SaaS', () => {
    const tasks = detectTasks('saas application');
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('should handle complex projects with multiple tasks', () => {
    const tasks = detectTasks('e-commerce platform with stripe payment and admin panel');
    expect(tasks.length).toBeGreaterThanOrEqual(3);
  });

  it('should detect fullstack project', () => {
    const tasks = detectTasks('nextjs app with postgresql and auth');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('nextjs_app');
    expect(taskIds).toContain('postgresql_prisma');
  });

  it('should detect AI project with multiple components', () => {
    const tasks = detectTasks('langchain agent with rag and vector database');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('langchain_agent');
    expect(taskIds).toContain('rag_system');
    expect(taskIds).toContain('vector_database');
  });

  it('should detect e-commerce with payments', () => {
    const tasks = detectTasks('shopping cart with stripe checkout');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('shopping_cart');
    expect(taskIds).toContain('stripe_payment');
  });

  it('should handle project with infrastructure', () => {
    const tasks = detectTasks('docker container on kubernetes with terraform');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('docker_container');
    expect(taskIds).toContain('kubernetes_deploy');
    expect(taskIds).toContain('terraform_iac');
  });
});

describe('Edge Cases', () => {
  it('should handle empty description', () => {
    const tasks = detectTasks('');
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should handle very long description', () => {
    const longDesc = 'react native app ' + 'with backend '.repeat(100);
    const tasks = detectTasks(longDesc);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('should handle special characters', () => {
    const tasks = detectTasks('react-native @app #project');
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should handle numbers in description', () => {
    const tasks = detectTasks('build 5 rest apis');
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should detect reactnative as react native', () => {
    const tasks = detectTasks('reactnative app');
    const taskIds = tasks.map(t => t.task);
    expect(taskIds).toContain('react_native');
  });

  it('should return tasks with scores', () => {
    const tasks = detectTasks('react native app');
    expect(tasks.length).toBeGreaterThan(0);
    tasks.forEach(task => {
      expect(task.score).toBeGreaterThan(0);
    });
  });

  it('should sort tasks by score', () => {
    const tasks = detectTasks('nextjs app with docker and postgresql');
    expect(tasks.length).toBeGreaterThan(1);
    for (let i = 1; i < tasks.length; i++) {
      expect(tasks[i - 1].score).toBeGreaterThanOrEqual(tasks[i].score);
    }
  });
});

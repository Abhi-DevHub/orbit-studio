import type { ArchitectureNode, ArchitectureEdge, ArchitectureIssue, CostEstimate } from '@orbit/config';

interface AnalysisResult {
  issues: ArchitectureIssue[];
  improvements: string[];
  costEstimate: CostEstimate;
  securityScore: number;
  performanceScore: number;
  recommendations: string[];
}

export class ArchitectureAnalyzer {
  async analyze(nodes: ArchitectureNode[], edges: ArchitectureEdge[]): Promise<AnalysisResult> {
    const issues: ArchitectureIssue[] = [];
    const improvements: string[] = [];

    // Check for missing cache when database is directly connected
    if (this.hasDirectDbConnection(nodes, edges)) {
      issues.push({
        severity: 'warning',
        type: 'performance',
        title: 'Missing Cache Layer',
        description: 'Database is directly connected without a cache layer. This can cause high latency and database load.',
        suggestion: 'Add Redis or Memcached between API Gateway and Database.',
        relatedNodeIds: this.findDbNodes(nodes),
      });
    }

    // Check for single point of failure
    if (nodes.filter((n) => n.type === 'gateway').length === 1 && nodes.length > 3) {
      issues.push({
        severity: 'warning',
        type: 'reliability',
        title: 'Single Point of Failure',
        description: 'You have only one API Gateway. Consider adding a second for high availability.',
        suggestion: 'Deploy at least 2 gateway instances behind a load balancer.',
      });
    }

    // Check for missing CDN
    if (nodes.some((n) => n.type === 'frontend') && !nodes.some((n) => n.type === 'cdn')) {
      improvements.push('Add a CDN (CloudFront, Cloudflare) to serve static assets and reduce latency.');
    }

    // Check for security issues
    if (!nodes.some((n) => n.type === 'auth')) {
      issues.push({
        severity: 'critical',
        type: 'security',
        title: 'Missing Authentication',
        description: 'No authentication service detected. APIs and services will be publicly accessible.',
        suggestion: 'Add an authentication service (Better Auth, Clerk, Auth0) to secure your APIs.',
      });
    }

    return {
      issues,
      improvements,
      costEstimate: this.estimateCosts(nodes),
      securityScore: this.calculateSecurityScore(nodes),
      performanceScore: this.calculatePerformanceScore(nodes, issues),
      recommendations: [
        'Add monitoring and observability (Datadog, Grafana, Sentry)',
        'Implement CI/CD pipeline with GitHub Actions',
        'Set up automated backups for databases',
        'Use infrastructure as code (Terraform, Pulumi)',
      ],
    };
  }

  private hasDirectDbConnection(nodes: ArchitectureNode[], edges: ArchitectureEdge[]): boolean {
    const dbNodes = new Set(nodes.filter((n) => n.type === 'database').map((n) => n.id));
    return edges.some((e) => dbNodes.has(e.target) && !nodes.some((n) => n.type === 'cache' && (e.source === n.id || e.target === n.id)));
  }

  private findDbNodes(nodes: ArchitectureNode[]): string[] {
    return nodes.filter((n) => n.type === 'database').map((n) => n.id);
  }

  private estimateCosts(nodes: ArchitectureNode[]): CostEstimate {
    const costs: Record<string, number> = {
      database: 40, cache: 15, gateway: 35, backend: 50,
      queue: 20, storage: 10, cdn: 15, kubernetes: 70,
      lambda: 5, monitoring: 30, ai: 100,
    };
    const breakdown = nodes.map((n) => ({
      service: n.data.label || n.type,
      cost: costs[n.type] || 25,
      unit: 'month' as const,
    }));
    const total = breakdown.reduce((sum, b) => sum + b.cost, 0);
    return { total, breakdown, currency: 'USD', period: 'monthly' as const };
  }

  private calculateSecurityScore(nodes: ArchitectureNode[]): number {
    let score = 50;
    if (nodes.some((n) => n.type === 'auth')) score += 20;
    if (nodes.some((n) => n.type === 'secrets')) score += 10;
    if (nodes.some((n) => n.type === 'gateway')) score += 10;
    if (nodes.some((n) => n.type === 'monitoring')) score += 10;
    return Math.min(score, 100);
  }

  private calculatePerformanceScore(nodes: ArchitectureNode[], issues: ArchitectureIssue[]): number {
    let score = 70;
    const performanceIssues = issues.filter((i) => i.type === 'performance');
    score -= performanceIssues.length * 15;
    if (nodes.some((n) => n.type === 'cache')) score += 15;
    if (nodes.some((n) => n.type === 'cdn')) score += 10;
    if (nodes.some((n) => n.type === 'queue')) score += 10;
    return Math.max(Math.min(score, 100), 0);
  }
}

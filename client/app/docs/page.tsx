import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsPage() {
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 md:py-24">
      <Card className="w-full max-w-2xl text-left glass-effect p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Tavarn.AI Project Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Project Overview</h2>
            <p className="text-muted-foreground">
              Tavarn.AI is an autonomous, AI-powered marketplace for in-game assets built on the Somnia blockchain. Our platform features a dynamic economy where item prices evolve based on real-time market demand, managed by an on-chain AI agent. This creates a fair, stable, and engaging trading environment for players.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Somnia AI Hackathon Submission</h2>
            <p className="text-muted-foreground">
              This project is our submission for the Somnia AI Hackathon, primarily targeting the <span className="font-bold text-primary">Gaming Agents</span> track. We believe it also represents a novel use case that aligns with the <span className="font-bold text-primary">Open Track</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

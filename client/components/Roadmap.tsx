import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Roadmap() {
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 md:py-24">
      <Card className="w-full max-w-2xl text-left glass-effect p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Phase 1: Foundation & Core Functionality (Completed)</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Smart Contract Development (AITrader.sol)</li>
              <li>Frontend Scaffolding with Next.js and Tailwind CSS</li>
              <li>Core Marketplace UI (Buy/Sell functionality)</li>
              <li>Initial AI Price Model (V1)</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Phase 2: Feature Expansion & UX Improvements (In Progress)</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>User Profile Pages with Inventory Display</li>
              <li>Real-time Price Updates with Websockets</li>
              <li>Expanded Asset Support (More game items)</li>
              <li>UI/UX Polish and Mobile Responsiveness</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Phase 3: AI & Economy V2 (Future)</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Advanced AI Models for Predictive Pricing</li>
              <li>Community Governance and Staking Mechanisms</li>
              <li>Cross-Chain Asset Trading and Interoperability</li>
              <li>Integration with more games and platforms</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

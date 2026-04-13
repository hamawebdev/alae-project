import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">devsForFun</h1>
      <p className="text-muted-foreground">opensource frontend template</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="https://devsforfun.com" rel="noopener noreferrer" target="_blank">
            devsForFun
          </a>
        </Button>
      </div>
    </div>
  );
}

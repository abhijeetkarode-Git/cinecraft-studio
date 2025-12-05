import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Film, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center px-4">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-muted/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-20 w-20 text-primary animate-float" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Scene Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Looks like this shot didn't make the final cut. The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="amber" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Film, Github, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                Cine<span className="text-gradient">craft</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Command-based cinematography planning. Turn your vision into structured shot plans.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/create" className="text-muted-foreground hover:text-foreground transition-colors">Create Shot Plan</Link></li>
              <li><Link to="/library" className="text-muted-foreground hover:text-foreground transition-colors">Shot Library</Link></li>
              <li><Link to="/recommendations" className="text-muted-foreground hover:text-foreground transition-colors">AI Suggestions</Link></li>
              <li><Link to="/export" className="text-muted-foreground hover:text-foreground transition-colors">Export Options</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Documentation</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">API Reference</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Community</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Tutorials</span></li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-3">
              <span className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </span>
              <span className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                <Github className="h-5 w-5 text-muted-foreground" />
              </span>
              <span className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                <Youtube className="h-5 w-5 text-muted-foreground" />
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Cinecraft. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

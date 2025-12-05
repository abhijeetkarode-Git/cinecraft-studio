import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  FileText, Table, Code, Box, Gamepad2,
  Download, Check, ExternalLink, Info
} from 'lucide-react';
import { useState } from 'react';
import { ExportFormat } from '@/types/cinematography';

interface ExportOption {
  format: ExportFormat;
  icon: React.ElementType;
  title: string;
  description: string;
  extension: string;
  available: boolean;
  color: string;
}

const exportOptions: ExportOption[] = [
  {
    format: 'pdf',
    icon: FileText,
    title: 'PDF Document',
    description: 'Professional shot list document with all details, storyboard frames, and technical specifications.',
    extension: '.pdf',
    available: true,
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  {
    format: 'csv',
    icon: Table,
    title: 'CSV Spreadsheet',
    description: 'Tabular data format compatible with Excel, Google Sheets, and other spreadsheet applications.',
    extension: '.csv',
    available: true,
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    format: 'json',
    icon: Code,
    title: 'JSON Data',
    description: 'Machine-readable format for integration with other tools, APIs, and custom workflows.',
    extension: '.json',
    available: true,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    format: 'blender',
    icon: Box,
    title: 'Blender Project',
    description: 'Export camera setups and blocking to Blender for 3D previsualization and virtual production.',
    extension: '.blend',
    available: false,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  {
    format: 'unreal',
    icon: Gamepad2,
    title: 'Unreal Engine',
    description: 'Export to Unreal Engine for real-time virtual production and LED wall workflows.',
    extension: '.uproject',
    available: false,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
];

export default function Export() {
  const { shotPlans, addNotification } = useStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async (format: ExportFormat) => {
    setSelectedFormat(format);
    setExporting(true);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setExporting(false);
    addNotification(`Shot plans exported as ${format.toUpperCase()}`, 'success');
    setSelectedFormat(null);
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Export Center</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Export your shot plans in various formats for production, collaboration, and integration with other tools.
            </p>
          </div>
          
          {/* Stats */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Ready to Export</h3>
                <p className="text-sm text-muted-foreground">
                  {shotPlans.length} shot plan{shotPlans.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>All shot plans will be included in the export</span>
              </div>
            </div>
          </div>
          
          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormat === option.format;
              
              return (
                <div
                  key={option.format}
                  className={cn(
                    "glass-card overflow-hidden transition-all duration-300",
                    option.available 
                      ? "hover:border-primary/30 cursor-pointer" 
                      : "opacity-60 cursor-not-allowed"
                  )}
                >
                  {/* Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-xl border",
                        option.color
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {!option.available && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <code className="px-2 py-1 rounded bg-secondary font-mono">
                        {option.extension}
                      </code>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div className="px-6 py-4 border-t border-border/30 bg-secondary/20">
                    <Button
                      variant={option.available ? "default" : "outline"}
                      className="w-full"
                      disabled={!option.available || exporting || shotPlans.length === 0}
                      onClick={() => option.available && handleExport(option.format)}
                    >
                      {isSelected && exporting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Exporting...
                        </>
                      ) : option.available ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Learn More
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Integration Partners */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Integration Partners</h2>
            <div className="glass-card p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-2 mx-auto">
                    <Box className="h-8 w-8" />
                  </div>
                  <span className="text-sm text-muted-foreground">Blender</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-2 mx-auto">
                    <Gamepad2 className="h-8 w-8" />
                  </div>
                  <span className="text-sm text-muted-foreground">Unreal Engine</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-2 mx-auto">
                    <FileText className="h-8 w-8" />
                  </div>
                  <span className="text-sm text-muted-foreground">Final Draft</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-2 mx-auto">
                    <Code className="h-8 w-8" />
                  </div>
                  <span className="text-sm text-muted-foreground">Frame.io</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Direct integrations coming soon. Use JSON export for custom integrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

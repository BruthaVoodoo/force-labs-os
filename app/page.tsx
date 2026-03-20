'use client';

import { useApp, MODULE_COLOR } from '@/contexts/app-context';
import { Dock } from '@/components/dock/dock';
import { TabBar } from '@/components/tabs/tab-bar';
import { OperationsModule } from '@/components/modules/operations-module';
import { LabsModule } from '@/components/modules/labs/labs-module';
import { DailyBriefs } from '@/components/modules/brain/daily-briefs';

const MODULE_GRADIENTS = {
  ops:   'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(234, 179, 8, 0.15) 0%, transparent 100%)',
  brain: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 100%)',
  labs:  'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 100%)',
};

export default function Home() {
  const { activeModule, activeTabs, activeTab, setActiveModule, setActiveTab, setActiveTabs } = useApp();

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'ops':   return <OperationsModule.MissionControl />;
      case 'brain': return <DailyBriefs />;
      case 'labs':  return <LabsModule />;
      default:      return <OperationsModule.MissionControl />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{ background: MODULE_GRADIENTS[activeModule] }}
      />
      <div className="relative flex flex-col h-screen">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            <TabBar
              tabs={activeTabs[activeModule]}
              activeTab={activeTab[activeModule]}
              onTabSelect={setActiveTab}
              onReorder={setActiveTabs}
              moduleColor={MODULE_COLOR(activeModule)}
            />
            <div className="mt-6">
              {renderModuleContent()}
            </div>
          </div>
        </div>
        <Dock activeModule={activeModule} onModuleSelect={setActiveModule} />
      </div>
    </div>
  );
}

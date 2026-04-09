import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useNavigationStore } from './store/navigationStore';
import { LoginScreen } from './screens/Login/LoginScreen';
import { WorldGenScreen } from './screens/WorldGen/WorldGenScreen';
import { AppShell } from './shell/AppShell/AppShell';
import { EmpireScreen } from './screens/Empire/EmpireScreen';

// Placeholder screens for future implementation
import { IntelScreen } from './screens/Intel/index';
import { PersonnelScreen } from './screens/Personnel/index';
import { EconomyScreen } from './screens/Economy/index';
import { ScienceScreen } from './screens/Science/index';
import { PlotsScreen } from './screens/Plots/index';
import { ActivitiesScreen } from './screens/Activities/index';
import { EventsScreen } from './screens/Events/index';
import { InterruptQueueModal } from './components/InterruptQueueModal/InterruptQueueModal';

function ActiveScreen() {
  const activeScreen = useNavigationStore(s => s.activeScreen);
  switch (activeScreen) {
    case 'empire':     return <EmpireScreen />;
    case 'intel':      return <IntelScreen />;
    case 'personnel':  return <PersonnelScreen />;
    case 'economy':    return <EconomyScreen />;
    case 'science':    return <ScienceScreen />;
    case 'plots':      return <PlotsScreen />;
    case 'activities': return <ActivitiesScreen />;
    case 'events':     return <EventsScreen />;
    default:           return <EmpireScreen />;
  }
}

export const App = () => {
  const status = useGameStore(s => s.status);
  const [showWorldGen, setShowWorldGen] = useState(false);

  if (status === 'idle') {
    if (showWorldGen) {
      return <WorldGenScreen />;
    }
    return <LoginScreen onNewGame={() => setShowWorldGen(true)} />;
  }

  return (
    <AppShell>
      <ActiveScreen />
      <InterruptQueueModal />
    </AppShell>
  );
};

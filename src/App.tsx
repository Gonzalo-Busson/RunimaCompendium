import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CharacterList } from './pages/characters/CharacterList';
import { MonsterList } from './pages/monsters/MonsterList';
import { WeaponList } from './pages/weapons/WeaponList';
import { ArmorList } from './pages/armors/ArmorList';
import { AccessoryList } from './pages/accessories/AccessoryList';
import { SpellList } from './pages/spells/SpellList';
import { TriggerList } from './pages/triggers/TriggerList';
import { ReactionList } from './pages/reactions/ReactionList';
import { EffectList } from './pages/effects/EffectList';
import {
  useCharacterStore, useMonsterStore, useWeaponStore,
  useArmorStore, useAccessoryStore, useSpellStore,
  useTriggerStore, useReactionStore, useEffectStore,
} from './store';
import { supabase } from './lib/supabase';

// Runs a quick ping against the reactions table and shows a visible banner
// if anything is wrong (wrong key, migration not run, network issue, etc.)
function SupabaseDiagnostic() {
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase
      .from('reactions')
      .select('id', { count: 'exact', head: true })
      .then(({ error: err }) => {
        if (err) setError(err.message);
      });
  }, []);

  if (!error || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-700 text-white px-4 py-3 flex items-start justify-between gap-4 text-sm shadow-lg">
      <div>
        <span className="font-bold">Supabase error: </span>
        <span>{error}</span>
        <p className="text-red-200 text-xs mt-1">
          Possible causes: migration not run, wrong API key, or RLS blocking reads.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-red-200 hover:text-white text-lg leading-none shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

function DataLoader() {
  const fetchCharacters  = useCharacterStore((s) => s.fetchAll);
  const fetchMonsters    = useMonsterStore((s) => s.fetchAll);
  const fetchWeapons     = useWeaponStore((s) => s.fetchAll);
  const fetchArmors      = useArmorStore((s) => s.fetchAll);
  const fetchAccessories = useAccessoryStore((s) => s.fetchAll);
  const fetchSpells      = useSpellStore((s) => s.fetchAll);
  const fetchTriggers    = useTriggerStore((s) => s.fetchAll);
  const fetchReactions   = useReactionStore((s) => s.fetchAll);
  const fetchEffects     = useEffectStore((s) => s.fetchAll);

  useEffect(() => {
    fetchCharacters();
    fetchMonsters();
    fetchWeapons();
    fetchArmors();
    fetchAccessories();
    fetchSpells();
    fetchTriggers();
    fetchReactions();
    fetchEffects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SupabaseDiagnostic />
      <DataLoader />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/personajes" element={<CharacterList />} />
          <Route path="/monstruos" element={<MonsterList />} />
          <Route path="/armas" element={<WeaponList />} />
          <Route path="/armaduras" element={<ArmorList />} />
          <Route path="/accesorios" element={<AccessoryList />} />
          <Route path="/hechizos" element={<SpellList />} />
          <Route path="/disparadores" element={<TriggerList />} />
          <Route path="/reacciones" element={<ReactionList />} />
          <Route path="/efectos" element={<EffectList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

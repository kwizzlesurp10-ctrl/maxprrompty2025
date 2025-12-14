import { createContext, ReactNode, useContext, useMemo } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import type { StateCreator } from "zustand";

type SpatialObject = {
  id: string;
  position: [number, number, number];
  scale: number;
  color: string;
};

type SpatialState = {
  objects: SpatialObject[];
  upsert: (object: SpatialObject) => void;
};

const createSpatialStore: StateCreator<SpatialState> = (set) => ({
  objects: [],
  upsert: (object) =>
    set((state) => {
      const existing = state.objects.find((o) => o.id === object.id);
      if (existing) {
        return {
          objects: state.objects.map((o) => (o.id === object.id ? object : o))
        };
      }
      return { objects: [object, ...state.objects] };
    })
});

const SpatialStoreContext = createContext<StoreApi<SpatialState> | null>(null);

export function SpatialStoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createStore(createSpatialStore), []);
  return <SpatialStoreContext.Provider value={store}>{children}</SpatialStoreContext.Provider>;
}

function useSpatialStoreApi() {
  const store = useContext(SpatialStoreContext);
  if (!store) throw new Error("Spatial store missing provider");
  return store;
}

export function useSpatialStore(): SpatialState;
export function useSpatialStore<T>(selector: (state: SpatialState) => T): T;
export function useSpatialStore<T>(selector?: (state: SpatialState) => T) {
  const store = useSpatialStoreApi();
  return useStore(store, selector ?? ((state) => state));
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAbout } from '../api/about';
import { getProjects } from '../api/projects';
import { getSkills } from '../api/skills';

const CACHE_KEY = 'terminal-portfolio-public-data-v1';
const EMPTY_DATA = {
  about: null,
  projects: [],
  skills: []
};

const PublicDataContext = createContext(null);

let memorySnapshot = null;
let sharedRequest = null;

function normalizeData(data = {}) {
  return {
    about: data.about ?? null,
    projects: Array.isArray(data.projects) ? data.projects : [],
    skills: Array.isArray(data.skills) ? data.skills : []
  };
}

function normalizeSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return null;
  }

  const hydratedAt = Number(snapshot.hydratedAt);

  if (!Number.isFinite(hydratedAt)) {
    return null;
  }

  return {
    data: normalizeData(snapshot.data),
    hydratedAt
  };
}

function readStoredSnapshot() {
  if (memorySnapshot) {
    return memorySnapshot;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawSnapshot = window.localStorage.getItem(CACHE_KEY);

    if (!rawSnapshot) {
      return null;
    }

    memorySnapshot = normalizeSnapshot(JSON.parse(rawSnapshot));
    return memorySnapshot;
  } catch {
    return null;
  }
}

function writeStoredSnapshot(data) {
  const snapshot = {
    data: normalizeData(data),
    hydratedAt: Date.now()
  };

  memorySnapshot = snapshot;

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // Browser storage is an optimization only; in-memory cache still prevents route reloads.
    }
  }

  return snapshot;
}

async function fetchPublicData() {
  const results = await Promise.allSettled([getAbout(), getProjects(), getSkills()]);
  const hasResponse = results.some((result) => result.status === 'fulfilled');

  if (!hasResponse) {
    throw new Error('Public data load failed');
  }

  return normalizeData({
    about: results[0].status === 'fulfilled' ? results[0].value : null,
    projects: results[1].status === 'fulfilled' ? results[1].value : [],
    skills: results[2].status === 'fulfilled' ? results[2].value : []
  });
}

function createInitialState() {
  const snapshot = readStoredSnapshot();

  if (!snapshot) {
    return {
      ...EMPTY_DATA,
      hydratedAt: null,
      hasCachedData: false,
      status: 'idle',
      error: null
    };
  }

  return {
    ...snapshot.data,
    hydratedAt: snapshot.hydratedAt,
    hasCachedData: true,
    status: 'refreshing',
    error: null
  };
}

export function PublicDataProvider({ children }) {
  const [state, setState] = useState(createInitialState);

  const preload = useCallback(() => {
    const snapshot = readStoredSnapshot();

    if (sharedRequest) {
      return sharedRequest;
    }

    setState((current) => ({
      ...current,
      status: current.hasCachedData || snapshot ? 'refreshing' : 'loading',
      error: null
    }));

    sharedRequest = fetchPublicData()
      .then((data) => {
        const nextSnapshot = writeStoredSnapshot(data);
        const nextState = {
          ...nextSnapshot.data,
          hydratedAt: nextSnapshot.hydratedAt,
          hasCachedData: true,
          status: 'ready',
          error: null
        };

        setState(nextState);
        return nextState;
      })
      .catch((error) => {
        const fallbackSnapshot = readStoredSnapshot();
        const fallbackData = fallbackSnapshot?.data ?? EMPTY_DATA;
        const nextState = {
          ...fallbackData,
          hydratedAt: fallbackSnapshot?.hydratedAt ?? null,
          hasCachedData: Boolean(fallbackSnapshot),
          status: 'ready',
          error
        };

        setState(nextState);
        return nextState;
      })
      .finally(() => {
        sharedRequest = null;
      });

    return sharedRequest;
  }, []);

  useEffect(() => {
    void preload();
  }, [preload]);

  const value = useMemo(
    () => ({
      ...state,
      isInitialLoading: !state.hasCachedData && state.status !== 'ready',
      isRefreshing: state.hasCachedData && state.status === 'refreshing',
      refresh: preload
    }),
    [preload, state]
  );

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>;
}

export function usePublicData() {
  const context = useContext(PublicDataContext);

  if (!context) {
    throw new Error('usePublicData must be used inside PublicDataProvider');
  }

  return context;
}

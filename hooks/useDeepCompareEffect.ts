import isEqual from 'lodash/isEqual';
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useDeepCompareEffect = (effect: EffectCallback, dependencies?: DependencyList) => {
  const currentDependenciesRef = useRef<DependencyList>();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(effect, [currentDependenciesRef.current]);
}

export default useDeepCompareEffect
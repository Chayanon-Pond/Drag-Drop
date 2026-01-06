"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type {
  Position,
  FullPositionInput,
  PendingDrop,
  PositionsState,
} from "../type/type";

const initialPositions: Position[] = [
  { id: "pos_1", title: "IT Support" },
  { id: "pos_2", title: "Finance" },
  { id: "pos_3", title: "HR" },
  { id: "pos_4", title: "Manager" },
];

const PositionsContext = createContext<PositionsState | undefined>(undefined);

export const usePositions = () => {
  const ctx = useContext(PositionsContext);
  if (!ctx)
    throw new Error("usePositions must be used within PositionsProvider");
  return ctx;
};

export const PositionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarPositions, setSidebarPositions] =
    useState<Position[]>(initialPositions);
  const [placed, setPlaced] = useState<Record<number, Position[]>>({});
  const [maxLevel, setMaxLevel] = useState<number>(5);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop>(null);
  const [nextIdCounter] = useState(() => initialPositions.length + 1);

  const moveFromSidebarToLevel = useCallback(
    (posId: string, level: number) => {
      // First update placed, then sidebar
      setPlaced((prev) => {
        const pos = sidebarPositions.find((p) => p.id === posId);
        if (!pos) return prev;
        const copy = { ...prev };
        // avoid duplicate in placed
        const already = copy[level]?.some((p) => p.id === pos.id);
        copy[level] = already
          ? copy[level]
          : copy[level]
          ? [...copy[level], pos]
          : [pos];
        return copy;
      });

      setSidebarPositions((s) => s.filter((p) => p.id !== posId));
    },
    [sidebarPositions]
  );

  const moveLevelToLevel = useCallback(
    (posId: string, fromLevel: number, toLevel: number) => {
      setPlaced((prev) => {
        const copy: Record<number, Position[]> = {};
        Object.entries(prev).forEach(
          ([k, arr]) => (copy[Number(k)] = [...arr])
        );
        const pos = copy[fromLevel]?.find((p) => p.id === posId);
        if (!pos) return prev;
        copy[fromLevel] = copy[fromLevel].filter((p) => p.id !== posId);
        copy[toLevel] = copy[toLevel] ? [...copy[toLevel], pos] : [pos];
        return copy;
      });
    },
    []
  );

  const moveLevelToSidebar = useCallback((posId: string, fromLevel: number) => {
    setPlaced((prev) => {
      const copy: Record<number, Position[]> = {};
      Object.entries(prev).forEach(([k, arr]) => (copy[Number(k)] = [...arr]));
      const pos = copy[fromLevel]?.find((p) => p.id === posId);
      if (!pos) return prev;
      copy[fromLevel] = copy[fromLevel].filter((p) => p.id !== posId);
      // add to sidebar but avoid duplicates
      setSidebarPositions((s) =>
        s.some((x) => x.id === pos.id) ? s : [...s, pos]
      );
      return copy;
    });
  }, []);

  const addPosition = useCallback((data: FullPositionInput | string) => {
    const input: FullPositionInput =
      typeof data === "string" ? { nameTh: data } : data;
    const displayName = input.nameTh || "Position";
    const id = `${displayName.replace(/\s+/g, "_")}_${Date.now().toString(36)}`;
    const pos: Position = {
      id,
      title: displayName,
      nameTh: input.nameTh,
      nameCn: input.nameCn,
      nameVn: input.nameVn,
      section: input.section,
      salaryType: input.salaryType,
    } as any;
    setSidebarPositions((s) => [...s, pos]);
  }, []);

  const addLevel = useCallback(() => {
    setMaxLevel((n) => n + 1);
  }, []);

  const removeLevel = useCallback(
    (level: number) => {
      // Move positions from this level back to sidebar
      const nodesToRestore = placed[level] ?? [];
      if (nodesToRestore.length > 0) {
        setSidebarPositions((s) => [...s, ...nodesToRestore]);
      }
      // Remove the level from placed
      setPlaced((prev) => {
        const copy = { ...prev };
        delete copy[level];
        return copy;
      });
      // Decrease maxLevel if this was the last level
      setMaxLevel((n) => (level >= n ? n - 1 : n));
    },
    [placed]
  );

  const removePosition = useCallback(
    (posId: string, level: number) => {
      const pos = placed[level]?.find((p) => p.id === posId);
      if (!pos) return;
      // Move back to sidebar
      setSidebarPositions((s) => [...s, pos]);
      // Remove from level
      setPlaced((prev) => {
        const copy = { ...prev };
        copy[level] = copy[level].filter((p) => p.id !== posId);
        return copy;
      });
    },
    [placed]
  );

  const deletePositionWithChildren = useCallback(
    (posId: string, level: number, deleteChildren: boolean) => {
      const pos = placed[level]?.find((p) => p.id === posId);
      if (!pos) return;

      setPlaced((prev) => {
        const copy: Record<number, Position[]> = {};
        Object.entries(prev).forEach(
          ([k, arr]) => (copy[Number(k)] = [...arr])
        );

        if (deleteChildren) {
          // Find and delete all descendants
          const toDelete = new Set<string>([posId]);
          let foundMore = true;
          while (foundMore) {
            foundMore = false;
            for (let l = level + 1; l <= 10; l++) {
              if (!copy[l]) continue;
              for (let i = copy[l].length - 1; i >= 0; i--) {
                if (toDelete.has(copy[l][i].parentId || "")) {
                  toDelete.add(copy[l][i].id);
                  foundMore = true;
                }
              }
            }
          }
          // Remove all marked positions
          for (let l = level; l <= 10; l++) {
            if (copy[l]) {
              copy[l] = copy[l].filter((p) => !toDelete.has(p.id));
            }
          }
        } else {
          // Move children up to parent
          const children =
            placed[level + 1]?.filter((p) => p.parentId === posId) || [];
          if (children.length > 0 && pos.parentId) {
            // Update children's parentId to current node's parent
            children.forEach((child) => {
              const idx = copy[level + 1]?.findIndex((p) => p.id === child.id);
              if (idx !== undefined && idx >= 0) {
                copy[level + 1][idx] = { ...child, parentId: pos.parentId };
              }
            });
          }
          // Remove the position
          copy[level] = copy[level].filter((p) => p.id !== posId);
        }
        return copy;
      });
    },
    [placed]
  );

  function initiateDrop(
    payload: { source: "sidebar" | "level"; id: string; fromLevel?: number },
    level: number
  ) {
    // if level 1 -> immediate
    if (level === 1) {
      if (payload.source === "sidebar")
        moveFromSidebarToLevel(payload.id, level);
      else if (
        payload.source === "level" &&
        typeof payload.fromLevel === "number"
      )
        moveLevelToLevel(payload.id, payload.fromLevel, level);
      return { ok: true };
    }

    // check previous level
    const prev = placed[level - 1] ?? [];
    if (!prev || prev.length === 0) {
      return { ok: false, message: "ไม่สามารถวาง: ไม่มีโหนดบนระดับก่อนหน้า" };
    }

    // require selecting parent
    setPendingDrop({
      source: payload.source,
      id: payload.id,
      fromLevel: payload.fromLevel,
      level,
    });
    return { ok: true, needsParent: true };
  }

  const confirmPendingDrop = (
    parentId: string,
    permissions?: Record<string, boolean>
  ) => {
    if (!pendingDrop) return;

    setPlaced((prev) => {
      const next = { ...prev };
      const level = pendingDrop.level;

      let position: Position | undefined;

      if (pendingDrop.source === "sidebar") {
        position = sidebarPositions.find((p) => p.id === pendingDrop.id);

        setSidebarPositions((s) => s.filter((p) => p.id !== pendingDrop.id));
      }

      if (pendingDrop.source === "level") {
        const fromLevel = pendingDrop.fromLevel!;
        position = prev[fromLevel]?.find((p) => p.id === pendingDrop.id);

        next[fromLevel] = prev[fromLevel].filter(
          (p) => p.id !== pendingDrop.id
        );
      }

      if (!position) return prev;

      const newPosition: Position = {
        ...position,
        parentId,
        permissions,
      };

      next[level] = [...(next[level] ?? []), newPosition];

      return next;
    });

    setPendingDrop(null);
  };

  function cancelPendingDrop() {
    setPendingDrop(null);
  }

  const saveAll = useCallback(() => {
    try {
      const data = { placed, sidebarPositions };
      localStorage.setItem("org_layout", JSON.stringify(data));
      console.log("Saved layout to localStorage", data);
    } catch (err) {
      console.error("Failed to save layout", err);
    }
  }, [placed, sidebarPositions]);

  const value: PositionsState = {
    sidebarPositions,
    placed,
    maxLevel,
    moveFromSidebarToLevel,
    moveLevelToLevel,
    moveLevelToSidebar,
    addPosition,
    addLevel,
    removeLevel,
    removePosition,
    deletePositionWithChildren,
    initiateDrop,
    pendingDrop,
    confirmPendingDrop,
    cancelPendingDrop,
    saveAll,
  };

  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
};

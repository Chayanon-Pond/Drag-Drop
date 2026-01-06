type OrgNode = {
    id: string
    name: string
    parantId: string | null
    level: number
}

type Position = {
  id: string;
  title: string;
  badge?: string;
  parentId?: string | null;
  nameTh?: string;
  nameCn?: string;
  nameVn?: string;
  section?: string;
  salaryType?: "normal" | "commission";
  permissions?: Record<string, boolean>;
};

type FullPositionInput = {
  nameTh?: string;
  nameCn?: string;
  nameVn?: string;
  section?: string;
  salaryType?: "normal" | "commission";
};

type PendingDrop = {
  source: "sidebar" | "level";
  id: string;
  fromLevel?: number;
  level: number;
} | null;

type Props = {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  okLabel?: string;
  onClose: () => void;
};
type PositionsState = {
  sidebarPositions: Position[];
  placed: Record<number, Position[]>;
  maxLevel: number;
  moveFromSidebarToLevel: (posId: string, level: number) => void;
  moveLevelToLevel: (posId: string, fromLevel: number, toLevel: number) => void;
  moveLevelToSidebar: (posId: string, fromLevel: number) => void;
  addPosition: (data: FullPositionInput | string) => void;
  addLevel: () => void;
  removeLevel: (level: number) => void;
  removePosition: (posId: string, level: number) => void;
  deletePositionWithChildren: (posId: string, level: number, deleteChildren: boolean) => void;  initiateDrop: (
    payload: { source: "sidebar" | "level"; id: string; fromLevel?: number },
    level: number
  ) => { ok: boolean; needsParent?: boolean; message?: string };
  pendingDrop: PendingDrop;
  confirmPendingDrop: (
    parentId: string,
    permissions?: Record<string, boolean>
  ) => void;
  cancelPendingDrop: () => void;
  saveAll: () => void;
};

export type { OrgNode, Position, FullPositionInput, PendingDrop, PositionsState, Props };
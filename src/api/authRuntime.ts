// authRuntime.ts
let currentBranchId: number | null = null;

export const setRuntimeBranch = (branchId: number) => {
  currentBranchId = branchId;
};

export const getRuntimeBranch = () => currentBranchId;

export enum TaskTypeEnum {
  ROUTINE = 'ROUTINE',
  PLAN = 'PLAN',
  ACTIVITY = 'ACTIVITY',
  DEVELOP = 'DEVELOP',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}

export type TaskType = Record<TaskTypeEnum, string>;

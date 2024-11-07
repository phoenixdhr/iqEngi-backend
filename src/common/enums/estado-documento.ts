// src/common/enums/user-status.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum DocumentStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

registerEnumType(DocumentStatus, {
  name: 'DocumentStatus',
  description: 'Estado del documento',
});

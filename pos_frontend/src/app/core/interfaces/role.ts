export interface Permission {
  id?: number;
  resource: string;
  action: string;
  possession: string;
  attributes?: string[];
}

export interface Role {
  id: number;         // Optional for creation
  name: string;        // Role name
  permissions?: Permission[]; // Optional list of permissions
  createdAt?: string;  // Optional timestamps
  updatedAt?: string;
}

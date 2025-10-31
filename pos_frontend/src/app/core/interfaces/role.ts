export interface Permission {
  id?: number;
  resource: string;
  action: string;
  possession: string;
  attributes?: string[];
}

export interface Role {
  id: number;         
  name: string;        
  permissions?: Permission[]; 
  createdAt?: string; 
  updatedAt?: string;
}


export interface Doctor {
  id: string;
  name: string;
  department: string;
  noteCount: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface ChartData {
  name: string;
  count: number;
  department: string;
}

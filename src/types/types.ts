export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface EntryData {
  id: string;
  user_id: string;
  name: string;
  serialNumbers: string;
  idNumber: string;
  phoneNumber: string;
  vanShop: string;
  allocationDate: string;
  location: string;
  createdAt: string;
}

export interface DatabaseEntry {
  id: string;
  user_id: string;
  name: string;
  serial_numbers: string;
  id_number: string;
  phone_number: string;
  van_shop: string;
  allocation_date: string;
  location: string;
  created_at: string;
}
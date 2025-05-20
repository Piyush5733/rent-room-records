
export interface RentRecord {
  id: string;
  roomId: number;
  date: Date;
  amount: number;
  previousMeterReading: number;
  currentMeterReading: number;
  electricityUnits: number;
  electricityBill: number;
  totalAmount: number;
}

export interface Room {
  id: number;
  name: string;
  tenant: string;
  monthlyRent: number;
  records: RentRecord[];
}

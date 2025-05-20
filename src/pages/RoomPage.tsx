
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRent } from "@/context/RentContext";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const RoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const { getRoomById, getRecordsByRoomId } = useRent();
  const navigate = useNavigate();

  const room = getRoomById(roomId);
  const records = getRecordsByRoomId(roomId);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="pb-6 bg-gray-50 min-h-screen">
      <Navigation title={room.name} showBackButton />
      
      <main className="pt-16 px-4">
        <div className="mb-6 animate-fade-in">
          <Card className="p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">{room.name}</h2>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/room/${room.id}/edit`)}
              >
                Edit Details
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Tenant</p>
                <p className="font-medium">{room.tenant}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Monthly Rent</p>
                <p className="font-medium">{formatCurrency(room.monthlyRent)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Total Records</p>
                <p className="font-medium">{records.length}</p>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Payment History</h2>
            <Button 
              onClick={() => navigate(`/room/${room.id}/add-rent`)}
              className="bg-primary hover:bg-primary/90"
            >
              Add New Record
            </Button>
          </div>
          
          {records.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Electricity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{formatCurrency(record.amount)}</TableCell>
                        <TableCell>
                          <div>
                            <p>{formatCurrency(record.electricityBill)}</p>
                            <p className="text-xs text-gray-500">
                              {record.previousMeterReading} → {record.currentMeterReading} ({record.electricityUnits} units)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(record.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <Card className="p-6 text-center text-gray-500">
              <p>No payment records found.</p>
              <p className="text-sm mt-2">Add a new rent record to get started.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoomPage;


import React from "react";
import { useNavigate } from "react-router-dom";
import { useRent } from "@/context/RentContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Index: React.FC = () => {
  const { rooms } = useRent();
  const navigate = useNavigate();

  const getTotalCollectedRent = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return 0;
    return room.records.reduce((sum, record) => sum + record.totalAmount, 0);
  };

  const getLatestRecord = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room || room.records.length === 0) return null;

    return room.records.reduce((latest, record) => 
      new Date(record.date) > new Date(latest.date) ? record : latest
    );
  };

  return (
    <div className="pb-6 bg-gray-50 min-h-screen">
      <Navigation />
      
      <main className="pt-16 px-4">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">My Rooms</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage rent collection for your rooms
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 animate-fade-in">
          {rooms.map((room) => {
            const latestRecord = getLatestRecord(room.id);
            
            return (
              <Card 
                key={room.id}
                className="overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader className="bg-primary/10 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-primary">{room.name}</CardTitle>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/room/${room.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">Tenant: {room.tenant}</p>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="font-semibold">{formatCurrency(room.monthlyRent)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Collected</p>
                      <p className="font-semibold">{formatCurrency(getTotalCollectedRent(room.id))}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Last Payment</p>
                    {latestRecord ? (
                      <div className="rounded-md bg-gray-50 p-2">
                        <p className="font-medium">
                          {formatCurrency(latestRecord.totalAmount)}
                          <span className="text-gray-500 font-normal ml-1">
                            on {new Date(latestRecord.date).toLocaleDateString()}
                          </span>
                        </p>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <p>Rent: {formatCurrency(latestRecord.amount)}</p>
                          <p>Electricity: {formatCurrency(latestRecord.electricityBill)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No payments recorded yet</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4 bg-gray-50">
                  <Button 
                    onClick={() => navigate(`/room/${room.id}`)} 
                    variant="outline"
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={() => navigate(`/room/${room.id}/add-rent`)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Add Rent
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;

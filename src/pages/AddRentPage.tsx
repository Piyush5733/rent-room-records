
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRent } from "@/context/RentContext";
import { useForm } from "react-hook-form";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface RentFormData {
  date: string;
  amount: number;
  previousMeterReading: number;
  currentMeterReading: number;
}

const AddRentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const { getRoomById, addRentRecord, getRecordsByRoomId } = useRent();
  const navigate = useNavigate();
  const [calculatedValues, setCalculatedValues] = useState({
    units: 0,
    electricityBill: 0,
    totalAmount: 0,
  });

  const room = getRoomById(roomId);
  const records = getRecordsByRoomId(roomId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RentFormData>({
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      amount: room?.monthlyRent || 0,
      previousMeterReading: getLatestMeterReading(),
      currentMeterReading: 0,
    },
  });

  function getLatestMeterReading(): number {
    if (records.length === 0) return 0;
    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedRecords[0].currentMeterReading;
  }

  const watchedValues = watch();

  useEffect(() => {
    const { amount = 0, previousMeterReading = 0, currentMeterReading = 0 } = watchedValues;
    const units = Math.max(0, currentMeterReading - previousMeterReading);
    const electricityBill = units * 9; // Rs. 9 per unit
    const totalAmount = Number(amount) + electricityBill;

    setCalculatedValues({
      units,
      electricityBill,
      totalAmount,
    });
  }, [watchedValues]);

  const onSubmit = (data: RentFormData) => {
    addRentRecord(roomId, {
      roomId: roomId, // Add the missing roomId property here
      date: new Date(data.date),
      amount: Number(data.amount),
      previousMeterReading: Number(data.previousMeterReading),
      currentMeterReading: Number(data.currentMeterReading),
    });
    navigate(`/room/${roomId}`);
  };

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

  return (
    <div className="pb-6 bg-gray-50 min-h-screen">
      <Navigation title={`Add Rent for ${room.name}`} showBackButton />
      
      <main className="pt-16 px-4">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="font-semibold mb-1">Tenant: {room.tenant}</h2>
            <p className="text-sm text-gray-600">Monthly Rent: {formatCurrency(room.monthlyRent)}</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="amount">Rent Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register("amount", { 
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Amount must be positive" }
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="previousMeterReading">Previous Meter Reading</Label>
                <Input
                  id="previousMeterReading"
                  type="number"
                  {...register("previousMeterReading", { 
                    required: "Previous reading is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Reading must be positive" }
                  })}
                />
                {errors.previousMeterReading && (
                  <p className="text-red-500 text-xs mt-1">{errors.previousMeterReading.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="currentMeterReading">Current Meter Reading</Label>
                <Input
                  id="currentMeterReading"
                  type="number"
                  {...register("currentMeterReading", { 
                    required: "Current reading is required",
                    valueAsNumber: true,
                    min: { 
                      value: Number(watchedValues.previousMeterReading) || 0, 
                      message: "Current reading should be greater than or equal to previous reading" 
                    }
                  })}
                />
                {errors.currentMeterReading && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentMeterReading.message}</p>
                )}
              </div>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Electricity Units:</span>
                  <span className="font-medium">{calculatedValues.units} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Electricity Bill:</span>
                  <span className="font-medium">{formatCurrency(calculatedValues.electricityBill)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-primary">Total Amount:</span>
                  <span className="font-bold text-primary">{formatCurrency(calculatedValues.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/room/${roomId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Save Record
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddRentPage;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

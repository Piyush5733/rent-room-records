
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRent } from "@/context/RentContext";
import { useForm } from "react-hook-form";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoomFormData {
  name: string;
  tenant: string;
  monthlyRent: number;
}

const EditRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const { getRoomById, updateRoom } = useRent();
  const navigate = useNavigate();

  const room = getRoomById(roomId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    defaultValues: {
      name: room?.name || "",
      tenant: room?.tenant || "",
      monthlyRent: room?.monthlyRent || 0,
    },
  });

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

  const onSubmit = (data: RoomFormData) => {
    updateRoom(roomId, {
      name: data.name,
      tenant: data.tenant,
      monthlyRent: Number(data.monthlyRent),
    });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="pb-6 bg-gray-50 min-h-screen">
      <Navigation title={`Edit ${room.name}`} showBackButton />
      
      <main className="pt-16 px-4">
        <div className="mb-6 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="Room 1"
                  {...register("name", { required: "Room name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="tenant">Tenant Name</Label>
                <Input
                  id="tenant"
                  placeholder="John Doe"
                  {...register("tenant", { required: "Tenant name is required" })}
                />
                {errors.tenant && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenant.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  placeholder="5000"
                  {...register("monthlyRent", { 
                    required: "Monthly rent is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Rent must be positive" }
                  })}
                />
                {errors.monthlyRent && (
                  <p className="text-red-500 text-xs mt-1">{errors.monthlyRent.message}</p>
                )}
              </div>
            </div>
            
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
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditRoomPage;

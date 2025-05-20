
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Room, RentRecord } from "@/types";
import { toast } from "sonner";

// Initial room data
const initialRooms: Room[] = [
  {
    id: 1,
    name: "Room 1",
    tenant: "John Doe",
    monthlyRent: 5000,
    records: [],
  },
  {
    id: 2,
    name: "Room 2",
    tenant: "Jane Smith",
    monthlyRent: 4500,
    records: [],
  },
  {
    id: 3,
    name: "Room 3",
    tenant: "Mike Johnson",
    monthlyRent: 5500,
    records: [],
  },
];

// Price per electricity unit
const ELECTRICITY_RATE = 9;

interface RentContextType {
  rooms: Room[];
  addRentRecord: (roomId: number, record: Omit<RentRecord, "id" | "electricityUnits" | "electricityBill" | "totalAmount">) => void;
  getRoomById: (id: number) => Room | undefined;
  getRecordsByRoomId: (roomId: number) => RentRecord[];
  updateRoom: (roomId: number, roomData: Partial<Room>) => void;
}

const RentContext = createContext<RentContextType | undefined>(undefined);

export const useRent = (): RentContextType => {
  const context = useContext(RentContext);
  if (!context) {
    throw new Error("useRent must be used within a RentProvider");
  }
  return context;
};

interface RentProviderProps {
  children: ReactNode;
}

export const RentProvider = ({ children }: RentProviderProps) => {
  // Initialize from localStorage or use default data
  const [rooms, setRooms] = useState<Room[]>(() => {
    const savedRooms = localStorage.getItem("rooms");
    if (savedRooms) {
      const parsedRooms = JSON.parse(savedRooms);
      // Convert date strings back to Date objects
      return parsedRooms.map((room: any) => ({
        ...room,
        records: room.records.map((record: any) => ({
          ...record,
          date: new Date(record.date),
        })),
      }));
    }
    return initialRooms;
  });

  // Save to localStorage whenever rooms change
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const addRentRecord = (
    roomId: number,
    record: Omit<RentRecord, "id" | "electricityUnits" | "electricityBill" | "totalAmount">
  ) => {
    const { currentMeterReading, previousMeterReading, amount } = record;

    // Calculate electricity units, bill and total amount
    const electricityUnits = currentMeterReading - previousMeterReading;
    const electricityBill = electricityUnits * ELECTRICITY_RATE;
    const totalAmount = amount + electricityBill;

    const newRecord: RentRecord = {
      id: Date.now().toString(),
      roomId,
      electricityUnits,
      electricityBill,
      totalAmount,
      ...record,
    };

    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            records: [...room.records, newRecord],
          };
        }
        return room;
      })
    );

    toast.success("Rent record added successfully");
  };

  const getRoomById = (id: number) => {
    return rooms.find((room) => room.id === id);
  };

  const getRecordsByRoomId = (roomId: number) => {
    const room = getRoomById(roomId);
    return room ? [...room.records].sort((a, b) => b.date.getTime() - a.date.getTime()) : [];
  };

  const updateRoom = (roomId: number, roomData: Partial<Room>) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          return { ...room, ...roomData };
        }
        return room;
      })
    );
    toast.success("Room details updated");
  };

  return (
    <RentContext.Provider
      value={{
        rooms,
        addRentRecord,
        getRoomById,
        getRecordsByRoomId,
        updateRoom,
      }}
    >
      {children}
    </RentContext.Provider>
  );
};

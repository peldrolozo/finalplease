import { useState, useEffect, useRef, useCallback } from 'react';

type CourtOccupancy = Record<number, boolean>;

type CourtOccupancyMessage = {
  type: 'courtOccupancy';
  data: CourtOccupancy;
};

type CourtAvailabilityMessage = {
  type: 'courtAvailability';
  data: {
    courtId: number;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
};

type CourtBookingsMessage = {
  type: 'courtBookings';
  data: Record<string, boolean>;
};

type WebSocketMessage = CourtOccupancyMessage | CourtAvailabilityMessage | CourtBookingsMessage;

export function useCourtOccupancy() {
  const [occupancy, setOccupancy] = useState<CourtOccupancy>({});
  const [isConnected, setIsConnected] = useState(false);
  const [availabilityResults, setAvailabilityResults] = useState<Record<string, boolean>>({});
  const [bookings, setBookings] = useState<Record<string, boolean>>({});
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;
    console.log("Connecting to WebSocket at:", wsUrl);
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.addEventListener('open', () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      });
      
      socket.addEventListener('message', (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const message = JSON.parse(event.data) as WebSocketMessage;
          
          if (message.type === 'courtOccupancy') {
            setOccupancy(message.data);
          } else if (message.type === 'courtAvailability') {
            const { courtId, date, startTime, endTime, isAvailable } = message.data;
            const key = `${courtId}-${date}-${startTime}-${endTime}`;
            setAvailabilityResults(prev => ({ ...prev, [key]: isAvailable }));
          } else if (message.type === 'courtBookings') {
            setBookings(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      });
      
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      });
      
      // Clean up on unmount
      return () => {
        console.log('Closing WebSocket connection');
        socket.close();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      return () => {/* cleanup */};
    }
  }, []);

  // Check if a court is occupied
  const isCourtOccupied = useCallback((courtId: number): boolean => {
    return occupancy[courtId] || false;
  }, [occupancy]);

  // Check court availability for a specific time slot
  const checkCourtAvailability = useCallback((courtId: number, date: string, startTime: string, endTime: string): void => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'checkCourtAvailability',
        data: { courtId, date, startTime, endTime }
      }));
    }
  }, []);

  // Get availability result for a specific court and time
  const getAvailabilityResult = useCallback((courtId: number, date: string, startTime: string, endTime: string): boolean | null => {
    const key = `${courtId}-${date}-${startTime}-${endTime}`;
    return key in availabilityResults ? availabilityResults[key] : null;
  }, [availabilityResults]);

  // Check if a time slot is booked for a specific court and hour
  const isTimeSlotBooked = useCallback((courtId: number, date: string, hour: number): boolean => {
    const formattedDate = date.split('T')[0]; // Make sure we have YYYY-MM-DD format
    const bookingKey = `${courtId}-${formattedDate}-${hour}`;
    return bookings[bookingKey] || false;
  }, [bookings]);

  return {
    isConnected,
    isCourtOccupied,
    checkCourtAvailability,
    getAvailabilityResult,
    isTimeSlotBooked,
    occupancy,
    bookings
  };
}
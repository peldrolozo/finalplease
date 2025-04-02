import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BookingForm from "@/components/booking/BookingForm";
import { CourtOccupancyGrid } from "@/components/booking/CourtOccupancyIndicator";
import { Court } from "@shared/schema";

const BookCourt = () => {
  const { data: courts, isLoading } = useQuery<Court[]>({ 
    queryKey: ['/api/courts'],
  });

  return (
    <div className="pt-24">
      {/* Real-time Court Occupancy Status */}
      <section className="py-12 bg-[#1a2430]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-time <span className="text-[#22c55e]">Court Status</span>
            </h2>
            <p className="text-[#d1d5db] max-w-2xl mx-auto">
              See which courts are currently available for immediate play
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full"></div>
            </div>
          ) : courts && courts.length > 0 ? (
            <CourtOccupancyGrid courts={courts} />
          ) : (
            <p className="text-center text-[#d1d5db]">No courts available</p>
          )}
        </div>
      </section>
      
      {/* Booking Form */}
      <BookingForm />
    </div>
  );
};

export default BookCourt;

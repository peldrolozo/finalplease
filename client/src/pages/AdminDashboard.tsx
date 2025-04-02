import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Booking, Court } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, User, Mail, Phone, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("bookings");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[] | null>(null);
  
  const { user } = useAuth();
  
  // Modify the query to include authorization header
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string, {
        headers: {
          'Authorization': `Bearer admin-token` // Use the token format expected by our isAdmin middleware
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings: ' + response.statusText);
      }
      return response.json();
    },
  });
  
  // Fetch courts data for reference
  const { data: courts } = useQuery<Court[]>({
    queryKey: ['/api/courts'],
  });
  
  // Apply filters whenever filter values or bookings change
  useEffect(() => {
    if (!bookings) {
      setFilteredBookings([]);
      return;
    }
    
    let result = [...bookings];
    
    // Apply customer name filter
    if (customerNameFilter) {
      const filterLowerCase = customerNameFilter.toLowerCase();
      result = result.filter(booking => 
        booking.customerName && booking.customerName.toLowerCase().includes(filterLowerCase)
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      try {
        const filterDate = new Date(dateFilter);
        result = result.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.toDateString() === filterDate.toDateString();
        });
      } catch (error) {
        console.error("Invalid date filter:", error);
      }
    }
    
    setFilteredBookings(result);
  }, [bookings, customerNameFilter, dateFilter]);
  
  // Determine which bookings to display: filtered or all
  const displayBookings: Booking[] = filteredBookings || bookings || [];
  
  // Function to clear all filters
  const clearFilters = () => {
    setCustomerNameFilter("");
    setDateFilter("");
  };
  
  // Get court name by ID
  const getCourtName = (courtId: number) => {
    if (!courts) return "Unknown Court";
    const court = courts.find(c => c.id === courtId);
    return court ? court.name : "Unknown Court";
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time
  const formatTime = (timeString: string | Date) => {
    const date = typeof timeString === 'string' ? new Date(timeString) : timeString;
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Format booking status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  // Format payment status
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="bookings" className="text-lg py-3">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-lg py-3">
            Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="w-full">
          <Card className="bg-[#1a2430] border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">All Bookings</CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                <i>Note: Bookings made before customer info tracking was added are marked as "Legacy booking"</i>
              </p>
              
              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="h-4 w-4 text-[#22c55e]" />
                    <label className="text-sm font-medium">Customer Name</label>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={customerNameFilter}
                      onChange={(e) => setCustomerNameFilter(e.target.value)}
                      placeholder="Filter by customer name"
                      className="pl-8 bg-[#0f141a] border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#22c55e]" />
                    <label className="text-sm font-medium">Booking Date</label>
                  </div>
                  <Input 
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#0f141a] border-gray-700 text-white"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-700 w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-white">ID</TableHead>
                        <TableHead className="text-white">Court</TableHead>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Time</TableHead>
                        <TableHead className="text-white">Customer</TableHead>
                        <TableHead className="text-white">Contact</TableHead>
                        <TableHead className="text-white">Amount</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayBookings.length > 0 ? (
                        displayBookings.map((booking) => (
                          <TableRow key={booking.id} className="border-gray-700">
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{getCourtName(booking.courtId)}</TableCell>
                            <TableCell>{formatDate(booking.date)}</TableCell>
                            <TableCell>
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-[#22c55e]" />
                                {booking.customerName || 
                                 (booking.id <= 6 ? 
                                   <span className="text-gray-500 italic">Legacy booking</span> : 
                                   <span className="text-yellow-500">No customer name</span>)
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-xs flex items-center">
                                  <Mail className="h-3 w-3 mr-1 text-[#22c55e]" />
                                  {booking.customerEmail || 
                                   (booking.id <= 6 ? 
                                     <span className="text-gray-500 italic">Legacy booking</span> : 
                                     <span className="text-yellow-500">No email</span>)
                                  }
                                </div>
                                <div className="text-xs flex items-center">
                                  <Phone className="h-3 w-3 mr-1 text-[#22c55e]" />
                                  {booking.customerPhone || <span className="text-gray-500">No phone</span>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>€{booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{getPaymentStatusBadge(booking.paymentStatus || 'unknown')}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#1a2430] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-400">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bookings?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a2430] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-400">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  €{bookings?.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0).toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a2430] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-400">Confirmed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {bookings?.filter(b => b.status === 'confirmed').length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a2430] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-400">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {bookings?.filter(b => b.paymentStatus === 'pending').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
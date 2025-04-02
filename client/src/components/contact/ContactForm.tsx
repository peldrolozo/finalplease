import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  defaultSubject?: string;
  defaultMessage?: string;
}

const ContactForm = ({ defaultSubject = "", defaultMessage = "" }: ContactFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: defaultSubject || "",
      message: defaultMessage || "",
    },
  });
  
  // Update form when props change
  useEffect(() => {
    if (defaultSubject) {
      form.setValue('subject', defaultSubject);
    }
    if (defaultMessage) {
      form.setValue('message', defaultMessage);
    }
  }, [defaultSubject, defaultMessage, form]);
  
  const contactMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="bg-[#0f141a] p-8 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#d1d5db] text-sm">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-[#1a2430] border-gray-700 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#d1d5db] text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-[#1a2430] border-gray-700 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#d1d5db] text-sm">Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#1a2430] border-gray-700 focus:ring-[#22c55e]">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a2430] border-gray-700">
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Booking Question">Booking Question</SelectItem>
                    <SelectItem value="Membership Information">Membership Information</SelectItem>
                    <SelectItem value="Coaching Question">Coaching Question</SelectItem>
                    <SelectItem value="Event Information">Event Information</SelectItem>
                    <SelectItem value="Feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#d1d5db] text-sm">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message..."
                    className="bg-[#1a2430] border-gray-700 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold shadow-lg hover:shadow-[#22c55e]/30"
            disabled={contactMutation.isPending}
          >
            {contactMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;

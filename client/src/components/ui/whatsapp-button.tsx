import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  return (
    <Button
      className="fixed bottom-6 right-6 z-50 rounded-full p-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
      asChild
    >
      <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
        </svg>
      </a>
    </Button>
  );
};

export default WhatsAppButton;

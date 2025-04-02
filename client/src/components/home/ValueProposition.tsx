import { Medal, UserCheck, Users } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="bg-[#0f141a] p-8 rounded-lg text-center transition-transform hover:scale-105">
      <div className="bg-[#22c55e]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-[#d1d5db]">{description}</p>
    </div>
  );
};

const ValueProposition = () => {
  const features = [
    {
      icon: <Medal className="text-[#22c55e] h-8 w-8" />,
      title: "Premium Facilities",
      description: "Four professional-grade courts with state-of-the-art lighting and surfaces."
    },
    {
      icon: <UserCheck className="text-[#22c55e] h-8 w-8" />,
      title: "Expert Coaching",
      description: "Learn from certified coaches with international tournament experience."
    },
    {
      icon: <Users className="text-[#22c55e] h-8 w-8" />,
      title: "Vibrant Community",
      description: "Join a friendly community of players with regular events and tournaments."
    }
  ];

  return (
    <section className="py-20 bg-[#1a2430]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-[#22c55e]">Celtic Padel</span>
          </h2>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Experience the fastest growing sport in Europe at Dublin's finest facility
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

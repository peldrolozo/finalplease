import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@shared/schema";

type BlogCardProps = {
  post: BlogPost;
};

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.imagePath}
          alt={post.title}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="text-[#22c55e] text-sm mb-2">
          {format(new Date(post.publishDate), "MMMM d, yyyy")}
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-[#d1d5db] mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-[#22c55e] hover:underline"
        >
          Read More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;

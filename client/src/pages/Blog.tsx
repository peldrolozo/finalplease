import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@shared/schema";

const BlogList = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  return (
    <>
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Padel <span className="text-[#22c55e]">Insights</span>
        </h1>
        <p className="text-[#d1d5db] max-w-2xl mx-auto">
          News, tips, and stories from the Celtic Padel community
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="bg-[#1a2430]">
              <div className="h-48 bg-gray-800 animate-pulse" />
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-6 w-full bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          blogPosts?.map((post: BlogPost) => (
            <BlogCard key={post.id} post={post} />
          ))
        )}
      </div>
    </>
  );
};

const BlogPost = ({ slug }: { slug: string }) => {
  const [location, setLocation] = useLocation();
  const { data: post, isLoading } = useQuery({
    queryKey: [`/api/blog-posts/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-full mb-4" />
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
        <button 
          onClick={() => setLocation("/blog")}
          className="text-[#22c55e] hover:underline flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => setLocation("/blog")}
        className="text-[#22c55e] hover:underline flex items-center mb-6"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to all posts
      </button>
      
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center text-[#d1d5db] mb-6">
        <div className="flex items-center mr-6">
          <Calendar className="h-4 w-4 mr-2 text-[#22c55e]" />
          {format(new Date(post.publishDate), "MMMM d, yyyy")}
        </div>
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-[#22c55e]" />
          Admin
        </div>
      </div>
      
      {post.imagePath && (
        <img 
          src={post.imagePath}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-6 object-cover"
        />
      )}
      
      <div className="prose prose-invert prose-p:text-[#d1d5db] prose-headings:text-white max-w-none">
        {post.content.split('...')[0]}
        <p>{post.content.split('...')[1] || ''}</p>
      </div>
    </div>
  );
};

const Blog = () => {
  const [location] = useLocation();
  const slug = location.split('/blog/')[1];

  return (
    <section className="py-20 pt-28 bg-[#0f141a] min-h-screen">
      <div className="container mx-auto px-4">
        {slug ? <BlogPost slug={slug} /> : <BlogList />}
      </div>
    </section>
  );
};

export default Blog;

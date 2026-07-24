import BlogForm from "@/components/blog/blog-form";
export default function AddPost({ websites = [], categories = [] }) {
  return <BlogForm websites={websites} categories={categories} />;
}

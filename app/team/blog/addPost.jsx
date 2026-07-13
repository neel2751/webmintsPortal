import BlogForm from "@/components/blog/blog-form";
export default function AddPost({ websites = [] }) {
  return <BlogForm websites={websites} />;
}

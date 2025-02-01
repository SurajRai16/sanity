import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

// Sanity Query to fetch posts
const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
] | order(publishedAt desc)[0...12] {
  _id, title, slug, publishedAt
}`;

<<<<<<< HEAD
// Enforce Static Site Generation (SSG)
export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Blog Posts",
    description: "A collection of the latest blog posts.",
  };
}

export default async function IndexPage() {
  // Fetch data ONLY at build time
=======
export default async function IndexPage() {
  // Fetch data only at build time
>>>>>>> f913cabddd4e6bd6c7d4b4a62a3d2779d8725dc8
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, { cache: "force-cache" });

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
<<<<<<< HEAD
=======

// ✅ Prevent re-fetching on every request by marking as a static route
export const dynamic = "force-static"; // Ensures this page is statically generated at build time
>>>>>>> f913cabddd4e6bd6c7d4b4a62a3d2779d8725dc8

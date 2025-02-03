import Link from "next/link";
import { groq, type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

// ✅ Query to fetch all posts
const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc)[0...12] {
    _id, title, slug, publishedAt
  }
`;

const options = { cache: "force-cache" };

// ✅ Fetch posts at build time (SSG)
export async function generateStaticParams() {
  const posts = await client.fetch<{ slug: { current: string } }[]>(POSTS_QUERY);

  return posts.map((post) => ({
    slug: post.slug.current, // Generates static pages for each slug
  }));
}

// ✅ Page Component
export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

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

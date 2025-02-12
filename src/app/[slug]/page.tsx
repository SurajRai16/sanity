import { groq, PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";

// ✅ Define queries
const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]`;
const POSTS_QUERY = groq`*[_type == "post"]{slug}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { cache: "force-cache" };

// ✅ Fetch post data at build time (SSG)
async function getPost(slug: string): Promise<SanityDocument | null> {
  console.log(`Fetching post: ${slug} at build time`);
  return client.fetch<SanityDocument>(POST_QUERY, { slug });
}

// ✅ Generate static paths at build time
export async function generateStaticParams() {
  console.log("🔄 Running generateStaticParams at build time...");
  const posts = await client.fetch<{ slug: { current: string } }[]>(POSTS_QUERY);

  console.log("✅ Posts fetched:", posts);
  return posts.map((post) => ({
    slug: post.slug.current, // Generates static pages for each slug
  }));
}

// ✅ Page Component (SSG)
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) return notFound();

  const postImageUrl = post.image ? urlFor(post.image)?.width(550).height(310).url() : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">← Back to posts</Link>
      {postImageUrl && (
        <img src={postImageUrl} alt={post.title} className="aspect-video rounded-xl" width="550" height="310" />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose">
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}

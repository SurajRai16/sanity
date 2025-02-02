import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const POSTS_QUERY = `*[_type == "post"]{slug}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// ✅ Fetch post data at build time (SSG)
async function getPost(slug: string) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, { cache: "force-cache" });
  if (!post) return null;
  return post;
}

// ✅ Define dynamic route
export async function generateStaticParams() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, { cache: "force-cache" });

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// ✅ Page Component (Server Component by Default)
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

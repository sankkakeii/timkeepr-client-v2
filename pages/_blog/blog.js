import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackContainer from '@/components/Modular/Containers/BackContainer';

const Blog = ({ blogItems }) => {
    const featuredPost = blogItems[Math.floor(Math.random() * blogItems.length)];

    return (
        <main className="container mx-auto">
            {/* Featured Post Section */}
            <BackContainer>
                <section className="featured-post mb-8 mx-20">
                    <h1 className="text-4xl font-bold my-8">Featured Post</h1>
                    <Card className="flex flex-col md:flex-row h-1/2">
                        <img
                            src={featuredPost.frontMatter.headerImage}
                            alt="Featured Blog Thumbnail"
                            className="w-full md:w-1/2 h-64 object-cover mb-2 md:mb-0"
                        />
                        <div className="md:w-1/2 p-4">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{featuredPost.frontMatter.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 mb-2">Published on: {featuredPost.frontMatter.date}</p>
                                <Link legacyBehavior href={`/_blog/${featuredPost.slug}`}>
                                    <a className="text-blue-500 hover:underline">Read more</a>
                                </Link>
                            </CardContent>
                        </div>
                    </Card>
                </section>

                {/* Blog List Section */}
                <div className="blog-container flex flex-col mx-20">
                    <h1 className="text-4xl font-bold my-8">My Blog</h1>
                    <div className="blog-container flex flex-col">
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {blogItems.map((blog) => (
                                <Card key={blog.id} className="mb-4 hover:shadow-lg rounded-lg">
                                    <img
                                        src={blog.frontMatter.headerImage}
                                        alt="Blog Thumbnail"
                                        className="w-full h-40 object-cover rounded-t-lg mb-2"
                                    />
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold">{blog.frontMatter.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500 mb-2">Published on: {blog.frontMatter.date}</p>
                                        <Link legacyBehavior href={`/_blog/${blog.slug}`}>
                                            <a className="text-blue-500 hover:underline">Read more</a>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </BackContainer>
        </main>
    );
};

export async function getStaticProps() {
    const postsDirectory = path.join(process.cwd(), 'blog-content');
    const filenames = fs.readdirSync(postsDirectory);

    const blogItems = filenames.map((filename, index) => {
        const filePath = path.join(postsDirectory, filename);
        const source = fs.readFileSync(filePath, 'utf-8');
        const { content, data } = matter(source);

        return {
            id: index + 1,
            slug: filename.replace(/\.mdx$/, ''),
            frontMatter: data,
        };
    });

    return {
        props: {
            blogItems,
        },
    };
}

export default Blog;

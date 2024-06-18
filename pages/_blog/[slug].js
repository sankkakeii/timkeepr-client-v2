// _blog/[slug].js
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import BackContainer from '@/components/Modular/Containers/BackContainer';

const components = {}; // You can add custom components here if needed

const BlogPost = ({ source, frontMatter }) => {
    return (
        <BackContainer>
            <div className="container mx-auto my-8">
                <img
                    src={frontMatter.headerImage}
                    alt="Header Image"
                    className="w-full h-64 object-cover mb-8 rounded-lg"
                />
                <div className="sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">{frontMatter.title}</h1>
                    <p className="text-sm text-gray-500 mb-4">
                        By {frontMatter.author} on {frontMatter.date}
                    </p>
                    <div className="prose max-w-none">
                        <MDXRemote {...source} components={components} />
                    </div>
                </div>
            </div>
        </BackContainer>
    );
};

export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), 'blog-content');
    const filenames = fs.readdirSync(postsDirectory);

    const paths = filenames.map((filename) => ({
        params: {
            slug: filename.replace(/\.mdx$/, ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'blog-content', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(source);

    const mdxSource = await serialize(content);

    return {
        props: {
            source: mdxSource,
            frontMatter: data,
        },
    };
}

export default BlogPost;

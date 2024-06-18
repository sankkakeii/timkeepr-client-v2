// components/SEO.js
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import globalConfig from '@/globalConfig';

function SEO({ title, description, canonical, openGraph }) {
    return (
        <>
            <NextSeo
                title={title}
                description={description}
                canonical={canonical}
                openGraph={openGraph}
            />
            <Head>
                <title>{title}</title>
                <link rel="icon" href={globalConfig.site.logo} />
            </Head>
        </>
    );
}

export default SEO;

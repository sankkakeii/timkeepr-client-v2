import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import Image from 'next/image';
import { useRouter } from 'next/router';


export default function FourOhFourPage() {
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };

    return (
        <>
            <SEO
                title="Page Not Found"
                description="404 page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <main className="flex flex-col">
                <section className="flex flex-col gap-7 mt-20 px-3 justify-center items-center text-center">
                    <Image
                        src="/images/404.png"
                        width={300}
                        height={300}
                        alt="404 Image"
                    />
                    <h1 className="text-6xl font-bold">404</h1>
                    <p className="text-2xl text-muted-foreground">Page does not exist</p>
                    <div className="flex gap-6">
                        <Button variant={'outline'}><Link href={'/'}>Go Home</Link></Button>
                        <Button onClick={handleGoBack}>Go Back</Button>
                    </div>
                </section>
            </main>
        </>

    )
}

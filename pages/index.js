import Nav from '@/components/Modular/LandingContent/LandingNav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SEO from '@/components/Modular/SEO';
import globalConfig from '@/globalConfig';
import Image from 'next/image';
import Footer from '@/components/Modular/LandingContent/Footer';

export default function Home() {
  return (
    <>
      <SEO
        title="Timekeepr"
        description="Landing page"
        canonical={globalConfig.site.siteUrl}
        openGraph={{
          url: `${globalConfig.site.siteUrl}/`,
        }}
      />
      <main className="flex flex-col h-full justify-center items-center">
        <Nav />
        <section className="flex gap-7 mt-20 p-4 lg:p-10 justify-center items-center text-center">
          <Image
            src="/images/clock2.jpg"
            width={250}
            height={250}
            alt="Home Image"
            className="rounded-2xl"
          />
          <div className="flex flex-col gap-7 text-left">
            <h1 className="text-4xl font-bold">
              Manage your <span className="">staff</span> with ease
            </h1>
            <p className="text-xl lg:text-1xl text-muted-foreground">
              Track work efficiently with Timekeepr <br /> Get individual staff data on the fly
            </p>
            <div className="flex lg:flex-row gap-6">
              {/* <Button variant={'outline'}><Link href={'/'}>View Template</Link></Button> */}
              <Button><Link href={'/auth/sign-up'}>Get Started</Link></Button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

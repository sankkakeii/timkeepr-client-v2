import Image from 'next/image'
import { ModeToggle } from '@/components/ui/toggle-mode'
import Link from 'next/link'
import { UserSettings } from './UserSettings'

export default function ProfileNav() {
    return (
        <main className="">
            <div className="flex h-16 p-5 w-full items-end justify-between from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <Link href={'/'} className="flex gap-2 justify-center items-center text-foreground">
                    <Image
                        src="/vercel.svg"
                        alt="Sameframe Logo"
                        // className="dark:invert"
                        width={30}
                        height={30}
                        priority
                    />
                    <p className="font-semibold">sameframe</p>
                </Link>
                <div className="flex gap-5">
                    <UserSettings />
                    <ModeToggle />
                </div>
            </div>
        </main>
    )
}

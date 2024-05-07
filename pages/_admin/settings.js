import Head from "next/head";
import Link from 'next/link';
import Image from "next/image";
import { useState } from "react";
import MapArea from "../../components/MapArea";
import styles from "../../styles/Home.module.css";

export default function Home() {

  const [coordinates, setCoordinates] = useState({
    lat: 2.996576908645812,
    lng: 101.59493478782426,
  });

  return (
    <div className="min-h-screen bg-gray-200 py-6 flex flex-col justify-center">
      <Head>
        <title>Timekeepr App</title>
        <meta name="description" content="A simple time tracking application." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-5 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-extrabold text-center mb-5 text-gray-500">Timekeepr</h1>
          <MapArea></MapArea>
          <div className="flex justify-center mt-4">
            <Link href="/_admin/add-user">
              <a className="mx-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Add User</a>
            </Link>
            <Link href="/_admin/view-users">
              <a className="mx-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">View Users</a>
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center">
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600"
        >
          Timekeepr 2023{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
